import { Process, specHelper } from "actionhero";
import { Game } from "../../src/modules/game/game.model";

describe("Action: gameStart", () => {
  const actionhero = new Process();

  beforeAll(async () => {
    await actionhero.start();
  });

  afterAll(async () => await actionhero.stop());

  test("returns started game", async () => {
    const actionResponse = await specHelper.runAction("gameStart");

    const game = actionResponse["game"] as Game;

    expect(game.id).toBeString();
    expect(game.createdAt).toBeDate();
    expect(game.endedAt).toBeNull();
  });
});
