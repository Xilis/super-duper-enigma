import { Process, specHelper } from "actionhero";
import { redis } from "../../src/modules/variable";

describe("Action: variable", () => {
  const actionhero = new Process();
  const key = "dummyVariable";

  beforeAll(async () => {
    await actionhero.start();
    await redis().flushdb();
  });

  afterAll(async () => await actionhero.stop());

  test("sets a variable", async () => {
    const response = await specHelper.runAction("setVariable", {
      key,
      value: 100,
    });
    // expect(response.response).toEqual("OK");
    // expect(response.key).toEqual(key);
    expect(response.error).toBeUndefined();
  });

  test("returns variable", async () => {
    const response = await specHelper.runAction("getVariable", {
      key,
    });
    // expect(response).toEqual(100);
    expect(response.error).toBeUndefined();
  });
});
