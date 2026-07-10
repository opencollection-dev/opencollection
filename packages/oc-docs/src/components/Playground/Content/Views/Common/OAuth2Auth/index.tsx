import React from 'react';
import { AuthField, AuthSelect, AuthCheckbox } from '../AuthFields';
import {
  OAUTH2_FLOWS,
  OAUTH2_CREDENTIALS_PLACEMENTS,
  OAUTH2_PKCE_METHODS,
  OAUTH2_TOKEN_SOURCES,
  OAUTH2_TOKEN_PLACEMENTS,
  OAUTH2_PARAM_PLACEMENTS,
  type OAuth2Flow,
  OAUTH2_FLOW_FIELDS,
  OAUTH2_ADDITIONAL_PARAM_PHASES
} from '../../../../../../constants';
import { StyledWrapper } from './StyledWrapper';

interface AdditionalParam {
  name?: string;
  value?: string;
  placement?: string;
}

const AdditionalParams: React.FC<{
  label: string;
  params: AdditionalParam[];
  onChange: (params: AdditionalParam[]) => void;
}> = ({ label, params, onChange }) => {
  const patch = (index: number, changes: Partial<AdditionalParam>) =>
    onChange(params.map((param, i) => (i === index ? { ...param, ...changes } : param)));
  const removeAt = (index: number) => onChange(params.filter((_, i) => i !== index));
  const add = () => onChange([...params, { name: '', value: '', placement: 'header' }]);

  return (
    <div className="space-y-1">
      <span className="param-row text-xs">{label}</span>
      {params.map((param, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={param.name || ''}
            placeholder="Name"
            onChange={(e) => patch(index, { name: e.target.value })}
            className="param-input flex-1 px-2 py-1 text-sm border rounded"
          />
          <input
            type="text"
            value={param.value || ''}
            placeholder="Value"
            onChange={(e) => patch(index, { value: e.target.value })}
            className="param-input flex-1 px-2 py-1 text-sm border rounded"
          />
          <select
            value={param.placement || 'header'}
            aria-label="Parameter placement"
            onChange={(e) => patch(index, { placement: e.target.value })}
            className="param-select px-2 py-1 text-sm border rounded"
          >
            {OAUTH2_PARAM_PLACEMENTS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            type="button"
            aria-label="Remove parameter"
            title="Remove parameter"
            onClick={() => removeAt(index)}
            className="param-remove px-2 py-1 text-sm"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="param-add text-sm select-none"
      >
        + Add parameter
      </button>
    </div>
  );
};

interface OAuth2AuthProps {
  auth: any;
  onChange: (auth: any) => void;
}

const OAuth2Auth: React.FC<OAuth2AuthProps> = ({ auth, onChange }) => {
  const flow: OAuth2Flow = OAUTH2_FLOWS.some((option) => option.value === auth.flow) ? auth.flow : 'authorization_code';
  const set = (patch: Record<string, unknown>) => onChange({ ...auth, type: 'oauth2', ...patch });

  const changeFlow = (newFlow: OAuth2Flow) => {
    const next: Record<string, unknown> = { type: 'oauth2', flow: newFlow };
    for (const key of OAUTH2_FLOW_FIELDS[newFlow]) {
      if (auth[key] !== undefined) next[key] = auth[key];
    }
    onChange(next);
  };
  const setCredentials = (patch: Record<string, unknown>) => set({ credentials: { ...auth.credentials, ...patch } });
  const setResourceOwner = (patch: Record<string, unknown>) => set({ resourceOwner: { ...auth.resourceOwner, ...patch } });
  const setTokenConfig = (patch: Record<string, unknown>) => set({ tokenConfig: { ...auth.tokenConfig, ...patch } });
  const setSettings = (patch: Record<string, unknown>) => set({ settings: { ...auth.settings, ...patch } });
  const setPkce = (patch: Record<string, unknown>) => set({ pkce: { ...auth.pkce, ...patch } });

  const isAuthCode = flow === 'authorization_code';
  const isImplicit = flow === 'implicit';
  const isPassword = flow === 'resource_owner_password_credentials';
  const usesAuthorizationUrl = isAuthCode || isImplicit;
  const usesTokenUrls = !isImplicit;
  const usesClientSecret = !isImplicit;

  const placement = auth.tokenConfig?.placement;
  const tokenPlacementType = placement && 'query' in placement ? 'query' : 'header';
  const tokenPlacementName = (tokenPlacementType === 'query' ? placement?.query : placement?.header) || '';
  const setTokenPlacement = (type: string, name: string) =>
    setTokenConfig({ placement: type === 'query' ? { query: name } : { header: name } });

  const pkceEnabled = !auth.pkce?.disabled;

  return (
    <StyledWrapper className="space-y-2">
      <AuthSelect label="Grant Type" testId="oauth2-grant-type" value={flow} options={OAUTH2_FLOWS} onChange={(v) => changeFlow(v as OAuth2Flow)} />

      {usesAuthorizationUrl && (
        <AuthField label="Authorization URL" value={auth.authorizationUrl || ''} onChange={(v) => set({ authorizationUrl: v })} />
      )}
      {usesTokenUrls && (
        <AuthField label="Access Token URL" value={auth.accessTokenUrl || ''} onChange={(v) => set({ accessTokenUrl: v })} />
      )}
      {usesTokenUrls && (
        <AuthField label="Refresh Token URL" value={auth.refreshTokenUrl || ''} onChange={(v) => set({ refreshTokenUrl: v })} />
      )}
      {usesAuthorizationUrl && (
        <AuthField label="Callback URL" value={auth.callbackUrl || ''} onChange={(v) => set({ callbackUrl: v })} />
      )}

      <AuthField label="Client ID" value={auth.credentials?.clientId || ''} onChange={(v) => setCredentials({ clientId: v })} />
      {usesClientSecret && (
        <AuthField label="Client Secret" type="password" value={auth.credentials?.clientSecret || ''} onChange={(v) => setCredentials({ clientSecret: v })} />
      )}
      {usesClientSecret && (
        <AuthSelect label="Send credentials" value={auth.credentials?.placement || 'basic_auth_header'} options={OAUTH2_CREDENTIALS_PLACEMENTS} onChange={(v) => setCredentials({ placement: v })} />
      )}

      {isPassword && (
        <AuthField label="Username" value={auth.resourceOwner?.username || ''} onChange={(v) => setResourceOwner({ username: v })} />
      )}
      {isPassword && (
        <AuthField label="Password" type="password" value={auth.resourceOwner?.password || ''} onChange={(v) => setResourceOwner({ password: v })} />
      )}

      <AuthField label="Scope" value={auth.scope || ''} onChange={(v) => set({ scope: v })} />
      {(isAuthCode || isImplicit) && (
        <AuthField label="State" value={auth.state || ''} onChange={(v) => set({ state: v })} />
      )}

      {isAuthCode && (
        <>
          <AuthCheckbox label="Use PKCE" checked={pkceEnabled} onChange={(v) => setPkce({ disabled: !v, method: auth.pkce?.method || 'S256' })} />
          {pkceEnabled && (
            <AuthSelect label="PKCE Method" value={auth.pkce?.method || 'S256'} options={OAUTH2_PKCE_METHODS} onChange={(v) => setPkce({ method: v })} />
          )}
        </>
      )}

      <AuthSelect label="Token Source" value={auth.tokenConfig?.source || 'access_token'} options={OAUTH2_TOKEN_SOURCES} onChange={(v) => setTokenConfig({ source: v })} />
      <AuthSelect label="Token Placement" value={tokenPlacementType} options={OAUTH2_TOKEN_PLACEMENTS} onChange={(v) => setTokenPlacement(v, tokenPlacementName)} />
      <AuthField
        label={tokenPlacementType === 'query' ? 'Query param' : 'Header name'}
        value={tokenPlacementName}
        placeholder={tokenPlacementType === 'query' ? 'access_token' : 'Authorization'}
        onChange={(v) => setTokenPlacement(tokenPlacementType, v)}
      />

      <AuthCheckbox label="Automatically fetch token" checked={Boolean(auth.settings?.autoFetchToken)} onChange={(v) => setSettings({ autoFetchToken: v })} />
      <AuthCheckbox label="Automatically refresh token" checked={Boolean(auth.settings?.autoRefreshToken)} onChange={(v) => setSettings({ autoRefreshToken: v })} />

      {(OAUTH2_ADDITIONAL_PARAM_PHASES[flow] ?? []).map((phase) => (
        <AdditionalParams
          key={phase.key}
          label={phase.label}
          params={auth.additionalParameters?.[phase.key] ?? []}
          onChange={(params) => set({ additionalParameters: { ...auth.additionalParameters, [phase.key]: params } })}
        />
      ))}
    </StyledWrapper>
  );
};

export default OAuth2Auth;
