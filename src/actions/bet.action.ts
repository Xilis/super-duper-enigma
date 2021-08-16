import { Action } from "actionhero";
import { db } from "../config/postgres";

export class BetAdd extends Action {
  constructor() {
    super();
    this.name = "betAdd";
    this.description = "make a bet";
    this.outputExample = {
      bet: {
        id: "1",
        createdAt: "2021-08-28T15:35:40.179Z",
        amount: 10.0,
      },
    };
    this.inputs = {
      roundId: {
        required: true,
      },
      amount: {
        required: true,
      },
      customerId: {
        required: true,
      },
    };
  }

  async run(data) {
    const round = await db.round.findById({ id: data.params.roundId });
    if (!round) {
      throw new Error("Invalid roundId!");
    } else if (!round.betPhase) {
      throw new Error("Round bet phase is over!");
    } else {
      const bet = await db.bet.add({
        gameId: round.gameId,
        roundId: round.id,
        amount: data.params.amount,
        customerId: data.params.customerId,
      });

      data.response.bet = bet;
    }
  }
}

export class BetCancel extends Action {
  constructor() {
    super();
    this.name = "betCancel";
    this.description = "cancel a bet";
    this.outputExample = {
      bet: {
        id: "1",
        createdAt: "2021-08-28T15:35:40.179Z",
        amount: 10.0,
      },
    };
    this.inputs = {
      id: {
        required: true,
      },
      roundId: {
        required: true,
      },
    };
  }

  async run(data) {
    const round = await db.round.findById({ id: data.params.roundId });
    if (!round) {
      throw new Error("Invalid roundId!");
    } else if (round.endedAt) {
      throw new Error("Round is over!");
    } else {
      const bet = await db.bet.cancel({
        id: data.params.id,
        roundId: round.id,
      });

      data.response.bet = bet;
    }
  }
}
