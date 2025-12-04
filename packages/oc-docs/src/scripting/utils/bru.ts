const _interpolate = (str: string, _vars: any) => str;
const variableNameRegex = /^[\w-.]*$/;

interface TestResultsResponse {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  results: Array<{
    status: string;
    description: string;
    expected?: any;
    actual?: any;
    error?: string;
  }>;
}

interface AssertionResultsResponse {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  results: Array<{
    status: string;
    lhsExpr?: string;
    rhsExpr?: string;
    operator?: string;
    rhsOperand?: any;
    error?: string;
  }>;
}

class Bru {
  // variables
  environmentVariables: any;
  runtimeVariables: any;
  globalEnvironmentVariables: any;
  
  collectionPath: any;
  collectionName: any;

  // These methods are added dynamically by setupBruTestMethods
  getTestResults?: () => Promise<TestResultsResponse>;
  getAssertionResults?: () => Promise<AssertionResultsResponse>;

  constructor({ collectionPath, collectionName, variables }: any) {
    const { environmentVariables, runtimeVariables, globalEnvironmentVariables } = variables || {};
    this.environmentVariables = environmentVariables || {};
    this.runtimeVariables = runtimeVariables || {};
    this.globalEnvironmentVariables = globalEnvironmentVariables || {};
    this.collectionPath = collectionPath;
    this.collectionName = collectionName;
  }

  interpolate = (strOrObj: any): any => {
    if (!strOrObj) return strOrObj;
    const isObj = typeof strOrObj === 'object';
    const strToInterpolate = isObj ? JSON.stringify(strOrObj) : strOrObj;

    const combinedVars = {
      ...this.globalEnvironmentVariables,
      ...this.environmentVariables,
      ...this.runtimeVariables
    };

    const interpolatedStr = _interpolate(strToInterpolate, combinedVars);
    return isObj ? JSON.parse(interpolatedStr) : interpolatedStr;
  };

  cwd() {
    return this.collectionPath;
  }

  getEnvName() {
    return this.environmentVariables.__name__;
  }

  getProcessEnv(_key: string) {
    return '';
  }

  hasEnvVar(key: string) {
    return Object.prototype.hasOwnProperty.call(this.environmentVariables, key);
  }

  getEnvVar(key: string) {
    return this.interpolate(this.environmentVariables[key]);
  }

  setEnvVar(key: string, value: any, options: any = {}) {
    if (!key) {
      throw new Error('Creating a env variable without specifying a name is not allowed.');
    }

    if (variableNameRegex.test(key) === false) {
      throw new Error(
        `Variable name: "${key}" contains invalid characters! Names must only contain alpha-numeric characters, "-", "_", "."`
      );
    }

    // When persist is true, only string values are allowed
    if (options?.persist && typeof value !== 'string') {
      throw new Error(`Persistent environment variables must be strings. Received ${typeof value} for key "${key}".`);
    }

    this.environmentVariables[key] = value;
  }

  deleteEnvVar(key: string) {
    delete this.environmentVariables[key];
  }

  getGlobalEnvVar(key: string) {
    return this.interpolate(this.globalEnvironmentVariables[key]);
  }

  setGlobalEnvVar(key: string, value: any) {
    if (!key) {
      throw new Error('Creating a env variable without specifying a name is not allowed.');
    }

    this.globalEnvironmentVariables[key] = value;
  }

  hasVar(key: string) {
    return Object.prototype.hasOwnProperty.call(this.runtimeVariables, key);
  }

  setVar(key: string, value: any) {
    if (!key) {
      throw new Error('Creating a variable without specifying a name is not allowed.');
    }

    if (variableNameRegex.test(key) === false) {
      throw new Error(
        `Variable name: "${key}" contains invalid characters!` +
          ' Names must only contain alpha-numeric characters, "-", "_", "."'
      );
    }

    this.runtimeVariables[key] = value;
  }

  getVar(key: string) {
    if (variableNameRegex.test(key) === false) {
      throw new Error(
        `Variable name: "${key}" contains invalid characters!` +
          ' Names must only contain alpha-numeric characters, "-", "_", "."'
      );
    }

    return this.interpolate(this.runtimeVariables[key]);
  }

  deleteVar(key: string) {
    delete this.runtimeVariables[key];
  }

  deleteAllVars() {
    for (const key in this.runtimeVariables) {
      if (Object.prototype.hasOwnProperty.call(this.runtimeVariables, key)) {
        delete this.runtimeVariables[key];
      }
    }
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getCollectionName() {
    return this.collectionName;
  }
}

export default Bru;
