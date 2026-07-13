import React from 'react';
import { SubHeading } from '@components/SubHeading/SubHeading';
import { PropertyTable } from '@components/PropertyTable/PropertyTable';
import type { PreRequestVarRow, PostResponseVarRow } from '@utils/request';
import { StyledWrapper } from './StyledWrapper';

interface RequestVarsProps {
  preRequest?: PreRequestVarRow[];
  postResponse?: PostResponseVarRow[];
  className?: string;
}

export const RequestVars: React.FC<RequestVarsProps> = ({ preRequest = [], postResponse = [], className }) => {
  if (preRequest.length === 0 && postResponse.length === 0) return null;

  return (
    <StyledWrapper className={['request-vars', className].filter(Boolean).join(' ')}>
      {preRequest.length > 0 && (
        <div className="request-vars-group">
          <SubHeading>Pre-Request</SubHeading>
          <PropertyTable
            rows={preRequest.map((v) => ({ label: v.name, value: v.value, description: v.description, disabled: v.disabled }))}
          />
        </div>
      )}
      {postResponse.length > 0 && (
        <div className="request-vars-group">
          <SubHeading>Post-Response</SubHeading>
          <PropertyTable
            rows={postResponse.map((v) => ({
              label: v.name,
              value: v.expression,
              description: v.description,
              disabled: v.disabled
            }))}
          />
        </div>
      )}
    </StyledWrapper>
  );
};

export default RequestVars;
