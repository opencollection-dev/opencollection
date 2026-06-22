import React from 'react';
import { SubHeading } from '../SubHeading';
import { PropertyTable } from '../PropertyTable';
import type { PreRequestVarRow, PostResponseVarRow } from '../../utils/requestVars';
import { RequestVarsWrapper } from './StyledWrapper';

interface RequestVarsProps {
  preRequest?: PreRequestVarRow[];
  postResponse?: PostResponseVarRow[];
  className?: string;
}

/** Pre-request (static values) and post-response (captured expressions) variable tables. */
export const RequestVars: React.FC<RequestVarsProps> = ({ preRequest = [], postResponse = [], className }) => {
  if (preRequest.length === 0 && postResponse.length === 0) return null;

  return (
    <RequestVarsWrapper className={['oc-request-vars', className].filter(Boolean).join(' ')}>
      {preRequest.length > 0 && (
        <div className="oc-request-vars-group">
          <SubHeading>Pre-Request</SubHeading>
          <PropertyTable rows={preRequest.map((v) => ({ label: v.name, value: v.value, disabled: v.disabled }))} />
        </div>
      )}
      {postResponse.length > 0 && (
        <div className="oc-request-vars-group">
          <SubHeading>Post-Response</SubHeading>
          <PropertyTable rows={postResponse.map((v) => ({ label: v.name, value: v.expression, disabled: v.disabled }))} />
        </div>
      )}
    </RequestVarsWrapper>
  );
};

export default RequestVars;
