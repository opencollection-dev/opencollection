import React from 'react';
import type { HttpRequestParam } from '@opencollection/types/requests/http';
import { SubHeading } from '../SubHeading/SubHeading';
import { PropertyTable, type PropertyRow } from '../PropertyTable/PropertyTable';
import { StyledWrapper } from './StyledWrapper';

const toRows = (params: HttpRequestParam[]): PropertyRow[] =>
  params.map((param) => ({ label: param.name, value: param.value, disabled: param.disabled }));

interface RequestParamsProps {
  path?: HttpRequestParam[];
  query?: HttpRequestParam[];
  className?: string;
}

export const RequestParams: React.FC<RequestParamsProps> = ({ path = [], query = [], className }) => {
  if (path.length === 0 && query.length === 0) return null;

  return (
    <StyledWrapper className={['oc-request-params', className].filter(Boolean).join(' ')}>
      {path.length > 0 && (
        <div className="oc-request-params-group">
          <SubHeading className="oc-request-params-heading">Path</SubHeading>
          <PropertyTable rows={toRows(path)} />
        </div>
      )}
      {query.length > 0 && (
        <div className="oc-request-params-group">
          <SubHeading className="oc-request-params-heading">Query</SubHeading>
          <PropertyTable rows={toRows(query)} />
        </div>
      )}
    </StyledWrapper>
  );
};

export default RequestParams;
