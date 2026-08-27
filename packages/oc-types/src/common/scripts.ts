/**
 * Scripts executed throughout the collection lifecycle
 */

export type ScriptType =
  | 'before-request'
  | 'after-response'
  | 'tests'
  | 'hooks'
  | 'grpc:before-call-start'
  | 'grpc:after-call-end'
  | 'grpc:before-message-send'
  | 'grpc:after-message-receive';

export interface Script {
  type: ScriptType;
  code: string;
}

export type Scripts = Script[];
