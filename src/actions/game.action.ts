import { action, Action } from "actionhero";
import { db } from "../config/postgres";

export class GameStart extends Action {
  constructor() {
    super();
    this.name = "gameStart";
    this.description = "start a game";
    this.outputExample = {
      game: {
        id: "1",
        startedAt: "2021-08-28T15:35:40.179Z",
        endedAt: null,
      },
      round: {
        id: "1",
        startedAt: "2021-08-28T15:35:40.179Z",
        endedAt: null,
      },
    };
  }

  async run(data) {
    const game = await db.game.add();

    const round = await action.run("roundStart", undefined, {
      gameId: game.id,
    });

    data.response.game = game;
    data.response.round = round;
  }
}

export class GameGet extends Action {
  constructor() {
    super();
    this.name = "getGame";
    this.description = "get a game";
    this.outputExample = {};
    this.inputs = {
      id: { required: true },
    };
  }

  async run(data) {
    const game = await db.game.findById({ id: data.params.id });
    data.response.game = game;
  }
}

export class GameGetAll extends Action {
  constructor() {
    super();
    this.name = "getAllGames";
    this.description = "get all games";
    this.outputExample = {
      games: [
        {
          id: "1",
          created_at: "2021-08-28T18:35:56.509Z",
          ended_at: null,
        },
        {
          id: "2",
          created_at: "2021-08-28T18:40:07.739Z",
          ended_at: null,
        },
      ],
    };
    this.inputs = {};
  }

  async run(data) {
    const games = await db.game.all();
    data.response.games = games;
  }
}
