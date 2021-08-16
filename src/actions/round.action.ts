import { action, Action, api } from "actionhero";
import { db } from "../config/postgres";

export class RoundStart extends Action {
  constructor() {
    super();
    this.name = "roundStart";
    this.description = "Start a new round";
    this.outputExample = {};
    this.inputs = {
      gameId: {
        required: true,
      },
    };
  }

  async run(data) {
    const round = await db.round.add({ gameId: data.params.gameId });

    // Queue task to transition this round into a cancel phase after 1 minute
    (await api.rabbitmq.publish("roundCancelPhase", { round })).on(
      "error",
      console.error
    );

    // Queue task to transition this round into end phase after 5 minutes
    (await api.rabbitmq.publish("roundEndPhase", { round })).on(
      "error",
      console.error
    );

    data.response.round = round;
  }
}

export class RoundEnd extends Action {
  constructor() {
    super();
    this.name = "roundEnd";
    this.description = "End a round";
    this.outputExample = {};
    this.inputs = {
      id: {
        required: true,
      },
    };
  }

  async run(data) {
    const round = await db.round.end({ id: data.params.id });

    // TODO process all bets in round!
    const bets = await db.bet.findInRound({ roundId: round.id });
    for (const bet of bets) {
      const win = Math.random() >= 0.5;
      let result;
      if (win) {
        // Win!
        result = await db.bet.winOrLose({
          id: bet.id,
          winAmount: +bet.betAmount * 2,
        });
      } else {
        // Lose :(
        result = await db.bet.winOrLose({ id: bet.id, winAmount: null });
      }
    }
    data.response.round = round;
  }
}

export class RoundCancelPhase extends Action {
  constructor() {
    super();
    this.name = "roundCancelPhase";
    this.description = "transition round into cancel phase, start new round";
    this.outputExample = {};
    this.inputs = {
      id: {
        required: true,
      },
      gameId: {
        required: true,
      },
    };
  }

  async run(data) {
    const round = await db.round.cancel({ id: data.params.id });

    await action.run("roundStart", undefined, { gameId: round.gameId });

    data.response.round = round;
  }
}

export class RoundGet extends Action {
  constructor() {
    super();
    this.name = "roundGet";
    this.description = "get a round";
    this.outputExample = {};
    this.inputs = {
      id: {
        required: true,
      },
    };
  }

  async run(data) {
    const round = await db.round.findById({ id: data.params.id });

    data.response.round = round;
  }
}

export class RoundGetAll extends Action {
  constructor() {
    super();
    this.name = "roundGetAll";
    this.description = "get all rounds";
    this.outputExample = {};
    this.inputs = {};
  }

  async run(data) {
    const rounds = await db.round.all();

    data.response.round = rounds;
  }
}
