import React from 'react';
import { AuthField, AuthSelect } from '../AuthFields/AuthFields';
import OAuth1Auth from '../OAuth1Auth/OAuth1Auth';
import OAuth2Auth from '../OAuth2Auth/OAuth2Auth';
import { AUTH_MODE_OPTIONS, API_KEY_PLACEMENTS } from '../../../../../../constants';
import { StyledWrapper } from './StyledWrapper';

interface AuthTabProps {
  auth: any;
  onAuthChange: (authType: string) => void;
  onAuthFieldChange?: (field: string, value: string) => void;
  onItemChange?: (item: any) => void;
  item?: any;
  title?: string;
  description?: string;
  showInherit?: boolean;
  showFullAuth?: boolean;
  nestUnderRequest?: boolean;
}

export const AuthTab: React.FC<AuthTabProps> = ({
  auth,
  onAuthChange,
  onItemChange,
  item,
  title,
  description,
  showInherit = false,
  showFullAuth = false,
  nestUnderRequest = false
}) => {
  const authType = typeof auth === 'object' && auth !== null ? auth.type : auth === 'inherit' ? 'inherit' : 'none';

  const updateItemAuth = (newAuth: any) => {
    if (!onItemChange || !item) return;

    if (nestUnderRequest || ('request' in item && item.request !== undefined)) {
      onItemChange({ ...item, request: { ...(item.request ?? {}), auth: newAuth } });
      return;
    }

    const protocol = ['http', 'graphql', 'grpc', 'websocket'].find((key) => item[key] !== undefined);
    if (protocol) {
      onItemChange({ ...item, [protocol]: { ...item[protocol], auth: newAuth } });
      return;
    }

    onItemChange({ ...item, auth: newAuth });
  };

  const handleAuthTypeChange = (newAuthType: string) => {
    if (!(showFullAuth && onItemChange && item)) {
      onAuthChange(newAuthType);
      return;
    }

    if (newAuthType === 'none') return updateItemAuth(undefined);
    if (newAuthType === 'inherit') return updateItemAuth('inherit');
    if (newAuthType === 'basic') return updateItemAuth({ type: 'basic', username: '', password: '' });
    if (newAuthType === 'bearer') return updateItemAuth({ type: 'bearer', token: '' });
    if (newAuthType === 'apikey') return updateItemAuth({ type: 'apikey', key: '', value: '', placement: 'header' });
    if (newAuthType === 'oauth2') return updateItemAuth({ type: 'oauth2', flow: 'authorization_code' });
    return updateItemAuth({ type: newAuthType });
  };

  return (
    <StyledWrapper className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        {Boolean(title) && (
          <span className="auth-title text-sm font-semibold">
            {title}
          </span>
        )}
        {description && (
          <span className="auth-description text-xs leading-tight">
            {description}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="auth-field">
          <label className="auth-field-label">Mode</label>
          <select
            value={authType}
            onChange={(e) => handleAuthTypeChange(e.target.value)}
            aria-label="Authentication type"
            data-testid="auth-mode-select"
            className="auth-control"
          >
            <option value="none">No Auth</option>
            {showInherit && <option value="inherit">Inherit</option>}
            {AUTH_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {!auth ? (
          <div className="auth-note py-2">
            <i>No authentication configured.</i>
          </div>
        ) : auth === 'inherit' ? (
          <div className="auth-note py-2">
            <i>Inherits authentication from the parent.</i>
          </div>
        ) : showFullAuth && typeof auth === 'object' ? (
          <div className="space-y-3">
            {['basic', 'digest', 'wsse'].includes(auth.type) && (
              <>
                <AuthField label="Username" testId="auth-username" value={auth.username || ''} placeholder="Enter username" onChange={(v) => updateItemAuth({ ...auth, type: auth.type, username: v })} />
                <AuthField label="Password" testId="auth-password" type="password" value={auth.password || ''} placeholder="Enter password" onChange={(v) => updateItemAuth({ ...auth, type: auth.type, password: v })} />
              </>
            )}

            {auth.type === 'bearer' && (
              <AuthField label="Token" value={auth.token || ''} placeholder="Enter bearer token" onChange={(v) => updateItemAuth({ type: 'bearer', token: v })} />
            )}

            {auth.type === 'apikey' && (
              <>
                <AuthField label="Key" value={auth.key || ''} placeholder="Header or param name" onChange={(v) => updateItemAuth({ ...auth, type: 'apikey', key: v })} />
                <AuthField label="Value" value={auth.value || ''} placeholder="API key value" onChange={(v) => updateItemAuth({ ...auth, type: 'apikey', value: v })} />
                <AuthSelect label="Add to" value={auth.placement || 'header'} options={API_KEY_PLACEMENTS} onChange={(v) => updateItemAuth({ ...auth, type: 'apikey', placement: v })} />
              </>
            )}

            {auth.type === 'ntlm' && (
              <>
                <AuthField label="Username" value={auth.username || ''} placeholder="Enter username" onChange={(v) => updateItemAuth({ ...auth, type: 'ntlm', username: v })} />
                <AuthField label="Password" type="password" value={auth.password || ''} placeholder="Enter password" onChange={(v) => updateItemAuth({ ...auth, type: 'ntlm', password: v })} />
                <AuthField label="Domain" value={auth.domain || ''} placeholder="Enter domain" onChange={(v) => updateItemAuth({ ...auth, type: 'ntlm', domain: v })} />
              </>
            )}

            {auth.type === 'awsv4' && (
              <>
                <AuthField label="Access Key" value={auth.accessKeyId || ''} placeholder="Enter access key id" onChange={(v) => updateItemAuth({ ...auth, type: 'awsv4', accessKeyId: v })} />
                <AuthField label="Secret Key" type="password" value={auth.secretAccessKey || ''} placeholder="Enter secret access key" onChange={(v) => updateItemAuth({ ...auth, type: 'awsv4', secretAccessKey: v })} />
                <AuthField label="Session Token" value={auth.sessionToken || ''} placeholder="Enter session token" onChange={(v) => updateItemAuth({ ...auth, type: 'awsv4', sessionToken: v })} />
                <AuthField label="Service" value={auth.service || ''} placeholder="e.g. execute-api" onChange={(v) => updateItemAuth({ ...auth, type: 'awsv4', service: v })} />
                <AuthField label="Region" value={auth.region || ''} placeholder="e.g. us-east-1" onChange={(v) => updateItemAuth({ ...auth, type: 'awsv4', region: v })} />
                <AuthField label="Profile" value={auth.profileName || ''} placeholder="AWS CLI profile" onChange={(v) => updateItemAuth({ ...auth, type: 'awsv4', profileName: v })} />
              </>
            )}

            {auth.type === 'oauth1' && <OAuth1Auth auth={auth} onChange={updateItemAuth} />}
            {auth.type === 'oauth2' && <OAuth2Auth auth={auth} onChange={updateItemAuth} />}

            {!['basic', 'digest', 'wsse', 'bearer', 'apikey', 'ntlm', 'awsv4', 'oauth1', 'oauth2'].includes(auth.type) && (
              <div className="auth-note py-2">
                <i>Editing {auth.type} auth isn’t available in the playground yet — configure it in Bruno.</i>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-note py-2">
            <i>Configuration for {auth?.type} auth is not available here.</i>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default AuthTab;
