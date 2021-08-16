import { Process, specHelper } from "actionhero";
import { Round } from "../../src/modules/round/round.model";

describe("Action: roundStart", () => {
  const actionhero = new Process();

  beforeAll(async () => {
    await actionhero.start();
  });
  afterAll(async () => await actionhero.stop());

  test("starts a round", async () => {
    // @ts-ignore
    const actionResponse = await specHelper.runAction("roundStart", {
      gameId: "1",
    });
    const round = actionResponse["round"] as Round;

    expect(round.id).toBeString();
    expect(round.gameId).toEqual("1");
    expect(round.createdAt).toBeDate();
    expect(round.endedAt).toBeNull();
  });
});

describe("Action: roundEnd", () => {
  const actionhero = new Process();

  beforeAll(async () => await actionhero.start());
  afterAll(async () => await actionhero.stop());

  test("ends a round", async () => {
    // @ts-ignore
    const actionResponse = await specHelper.runAction("roundEnd", {
      id: "1",
    });
    const round = actionResponse["round"] as Round;

    expect(round.id).toEqual("1");
    expect(round.gameId).toEqual("1");
    expect(round.createdAt).toBeDate();
    expect(round.endedAt).toBeDate();
  });
});
