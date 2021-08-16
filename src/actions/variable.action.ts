import { Action } from "actionhero";
import * as Variable from "../modules/variable";

export class SetVariable extends Action {
  constructor() {
    super();
    this.name = "setVariable";
    this.description = "I set a variable";
    this.outputExample = {};
    this.inputs = {
      key: { required: true },
      value: { required: true },
    };
  }

  async run({ params }) {
    const response = await Variable.set(params.key, params.value);
    return { key: params.key, value: params.value.toString() };
  }
}

export class GetVariable extends Action {
  constructor() {
    super();
    this.name = "getVariable";
    this.description = "I get a variable";
    this.outputExample = {
      dummyVariable: "1",
    };
    this.inputs = {
      key: { required: true },
    };
  }

  async run({ params }) {
    const variableValue = await Variable.get(params.key);
    return { key: params.key, value: variableValue };
  }
}

export class GetAllVariables extends Action {
  constructor() {
    super();
    this.name = "getAllVariables";
    this.description = "I get all variables";
    this.outputExample = {
      variables: {
        dummyVariable: "1",
        anotherVariable: "100",
      },
    };
    this.inputs = {};
  }

  async run({ params }) {
    const variables = (await Variable.getAll()) ?? {};
    return { variables };
  }
}
