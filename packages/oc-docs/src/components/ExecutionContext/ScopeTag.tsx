import React from 'react';

export type Scope = 'request' | 'folder' | 'collection';

interface ScopeTagProps {
  scope: Scope;
}

/** Small mono pill marking the scope (request / folder / collection) of an assert or test. */
export const ScopeTag: React.FC<ScopeTagProps> = ({ scope }) => (
  <span className={`oc-scope-tag oc-scope-tag--${scope}`}>{scope}</span>
);

export default ScopeTag;
