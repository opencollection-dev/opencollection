/**
 * Runtime actions executed around request lifecycles
 */

import type { Description } from './description';

export type ActionPhase = 'before-request' | 'after-response';

export interface SetVariableActionSelector {
  expression: string;
  method: 'jsonq';
}

export type ActionVariableScope = 'runtime' | 'request' | 'folder' | 'collection' | 'environment';

export interface SetVariableActionTarget {
  name: string;
  scope: ActionVariableScope;
}

export interface ActionSetVariable {
  type: 'set-variable';
  description?: Description;
  phase?: ActionPhase;
  selector: SetVariableActionSelector;
  variable: SetVariableActionTarget;
  disabled?: boolean;
}

export type Action = ActionSetVariable;
