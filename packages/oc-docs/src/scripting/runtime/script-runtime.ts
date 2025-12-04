import * as chai from 'chai';
import Bru from '../utils/bru';
import BrunoRequest from '../utils/bruno-request';
import BrunoResponse from '../utils/bruno-response';
import { executeQuickJsVmAsync } from '../sandbox/quickjs';
import { AssertionResult, createBruTestResultMethods, type BruTestResultMethods } from '../utils/test';

interface RunScriptOptions {
  script: string;
  request?: any;
  response?: any;
  collectionName?: string;
  collectionPath?: string;
  variables?: any;
  assertionResults?: AssertionResult[];
}

class ScriptRuntime {
  constructor() { }

  async runScript({
    script,
    request,
    response,
    collectionName,
    collectionPath,
    variables,
    assertionResults
  }: RunScriptOptions): Promise<Bru> {
    const bru = new Bru({ collectionPath, collectionName, variables });
    let req, res;
    if (request) {
      req = new BrunoRequest(request);
    }
    if (response) {
      res = new BrunoResponse(response);
    }

    // extend bru with result getter methods
    const { __brunoTestResults, test }: BruTestResultMethods = createBruTestResultMethods(bru, assertionResults || [], chai);

    interface ScriptContext {
      bru: any;
      req?: any;
      res?: any;
      test: (description: string, callback: () => Promise<void> | void) => Promise<void>;
      __brunoTestResults: any;
      console: {
        log: typeof console.log;
        debug: typeof console.debug;
        info: typeof console.info;
        warn: typeof console.warn;
        error: typeof console.error;
      };
    }

    const context: ScriptContext = {
      bru,
      req,
      res,
      test,
      __brunoTestResults: __brunoTestResults,
      console: {
        log: console.log,
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
      }
    };

    await executeQuickJsVmAsync({
      script: script,
      context: context,
      collectionPath
    });

    // Return bru object so caller can access test results
    return bru;
  }
}

export default ScriptRuntime;
