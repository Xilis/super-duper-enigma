import { config, Process } from "actionhero";
import got from "got";
import { redis } from "../../src/modules/variable";

describe("dummyVariable flow integration", () => {
  let url;
  const key = "dummyVariable";
  const actionhero = new Process();

  beforeAll(async () => {
    await actionhero.start();
    url = `http://localhost:${config.servers.web.port}/api`;

    await redis().flushdb();
  });

  afterAll(async () => await actionhero.stop());

  test("Set dummyVariable to 1", async () => {
    const httpResponse = await got
      .post(`${url}/variable`, {
        json: {
          key,
          value: 1,
        },
      })
      .json<{ value: string; key: string }>();

    expect(httpResponse.value).toEqual("1");
    expect(httpResponse.key).toEqual(key);
  });

  test("Get the dummVariable value", async () => {
    const httpResponse = await got
      .get(`${url}/variable/${key}`)
      .json<{ value: string }>();

    expect(httpResponse.value).toEqual("1");
  });

  test("Set a different variable", async () => {
    const variableKey = "anotherVariable";

    const httpResponse = await got
      .post(`${url}/variable`, {
        json: {
          key: variableKey,
          value: 100,
        },
      })
      .json<{ value: string; key: string }>();

    expect(httpResponse.value).toEqual("100");
    expect(httpResponse.key).toEqual(variableKey);
  });

  test("Get all variables", async () => {
    const httpResponse = await got
      .get(`${url}/variables`)
      .json<{ variables: { [key: string]: string } }>();

    expect(httpResponse.variables.dummyVariable).toEqual("1");
    expect(httpResponse.variables.anotherVariable).toEqual("100");
  });
});
