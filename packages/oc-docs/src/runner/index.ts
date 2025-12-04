import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import { RequestExecutor } from './RequestExecutor';
import ScriptRuntime from '../scripting/runtime/script-runtime';
import AssertRuntime, { type AssertionResult } from '../scripting/runtime/assert-runtime';
import { getTreePathFromCollectionToItem, mergeHeaders, mergeScripts, mergeAuth, interpolateVars } from './utils';
import { getCollectionFolderRequestVariables } from './utils/variable-merger';

export interface RunRequestOptions {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  environment?: Environment;
  runtimeVariables?: Record<string, any>;
  timeout?: number;
  validateSSL?: boolean;
}

export interface TestResultsResponse {
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

export interface AssertionResultsResponse {
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

export interface RunRequestResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, any>;
  data?: any;
  size?: number;
  duration?: number;
  url?: string;
  error?: string;
  errorType?: string;
  isCancel?: boolean;
  requestId?: string;
  assertionResults?: AssertionResultsResponse;
  testResults?: TestResultsResponse;
}

export class RequestRunner {
  private executor: RequestExecutor;
  private scriptRuntime: ScriptRuntime;
  private assertRuntime: AssertRuntime;

  constructor() {
    this.executor = new RequestExecutor();
    this.scriptRuntime = new ScriptRuntime();
    this.assertRuntime = new AssertRuntime();
  }

  async runRequest(options: RunRequestOptions): Promise<RunRequestResponse> {
    const { item, collection, environment, runtimeVariables = {}, timeout = 30000 } = options;
    const requestId = this.generateRequestId();
    
    try {
      const environmentVariables = this.getEnvironmentVariables(environment);
      const processEnvVars = process?.env || {};
      
      const processedRequest = await this.preprocessRequest(item, collection);

      const { collectionVariables, folderVariables, requestVariables } = getCollectionFolderRequestVariables(collection, processedRequest);

      const allVariables = {
        environmentVariables,
        runtimeVariables,
        processEnvVars,
        collectionVariables,
        folderVariables,
        requestVariables
      };
      
      // Pre-request script
      if (processedRequest.scripts?.preRequest) {
        
        try {
          await this.scriptRuntime.runScript({
            script: processedRequest.scripts.preRequest,
            request: processedRequest,
            variables: allVariables,
            collectionName: collection.info?.name || '',
            collectionPath: ""
          });
        } catch (scriptError) {
          return {
            requestId,
            error: `Pre-request script error: ${scriptError instanceof Error ? scriptError.message : 'Unknown script error'}`
          };
        }
      }
      
      const interpolatedRequest = interpolateVars(processedRequest, allVariables);

      const response = await this.executor.executeRequest(interpolatedRequest, { timeout });
      
      // Post-response script
      if (processedRequest.scripts?.postResponse) {
        try {
          await this.scriptRuntime.runScript({
            script: processedRequest.scripts.postResponse,
            request: interpolatedRequest,
            response,
            variables: allVariables,
            collectionName: collection.info?.name || '',
            collectionPath: ""
          });
        } catch (scriptError) {
          // Don't fail the request for post-response script errors, just log them
          console.warn('Post-response script error:', scriptError);
        }
      }
      let assertionResults: AssertionResult[] | undefined;
      let assertionResultsResponse: AssertionResultsResponse | undefined;
      let testResultsResponse: TestResultsResponse | undefined;
      
      // Run assertions
      if (processedRequest.assertions && processedRequest.assertions.length > 0) {
        try {
          assertionResults = this.assertRuntime.runAssertions(
            processedRequest.assertions,
            interpolatedRequest,
            response,
            allVariables
          );
        } catch (assertError) {
          // Don't fail the request for assertion errors, just log them
          console.warn('Assertion error:', assertError);
        }
      }
      
      // Tests
      if (processedRequest.scripts?.tests) {
        try {
          const bru = await this.scriptRuntime.runScript({
            script: processedRequest.scripts.tests,
            request: interpolatedRequest,
            response,
            variables: allVariables,
            collectionName: collection.info?.name || '',
            collectionPath: "",
            assertionResults
          });
          
          // Capture test results and assertion results from bru object
          if (bru && typeof bru.getTestResults === 'function') {
            testResultsResponse = await bru.getTestResults();
          }
          if (bru && typeof bru.getAssertionResults === 'function') {
            assertionResultsResponse = await bru.getAssertionResults();
          }
        } catch (scriptError) {
          // Don't fail the request for test script errors, just log them
          console.warn('Test script error:', scriptError);
        }
      }
      
      return {
        ...response,
        requestId,
        assertionResults: assertionResultsResponse,
        testResults: testResultsResponse
      };
    } catch (error) {
      return {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getEnvironmentVariables(environment?: Environment): Record<string, any> {
    if (!environment?.variables) return {};
    
    return environment.variables.reduce((vars, variable) => {
      if (variable.name && !variable.disabled) {
        vars[variable.name] = variable.value || variable.default || '';
      }
      return vars;
    }, {} as Record<string, any>);
  }


  private async preprocessRequest(
    item: HttpRequest, 
    collection: OpenCollectionCollection
  ): Promise<HttpRequest> {
    // Create a deep copy of the request to avoid mutating the original
    const processed = JSON.parse(JSON.stringify(item)) as HttpRequest;
    
    // Get the tree path from collection to this item
    const requestTreePath = getTreePathFromCollectionToItem(collection, item);
    
    // Apply collection and folder defaults in the correct order
    mergeHeaders(collection, processed, requestTreePath);
    mergeAuth(collection, processed, requestTreePath);
    mergeScripts(collection, processed, requestTreePath, 'sandwich'); // Default to sandwich flow
    
    return processed;
  }

  getGlobalVariables(): Record<string, any> {
    // todo
    return {};
  }

  clearGlobalVariables(): void {
    // todo
  }
}

export const createRequestRunner = () => new RequestRunner();

export const requestRunner = new RequestRunner();

export const getGlobalVariables = () => requestRunner.getGlobalVariables();
export const clearGlobalVariables = () => requestRunner.clearGlobalVariables(); 