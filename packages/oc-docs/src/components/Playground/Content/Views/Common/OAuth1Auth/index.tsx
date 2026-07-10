import React from 'react';
import { AuthField, AuthSelect, AuthCheckbox } from '../AuthFields';
import { OAUTH1_SIGNATURE_METHODS, OAUTH1_PLACEMENTS } from '../../../../../../constants';
import { StyledWrapper } from './StyledWrapper';

interface OAuth1AuthProps {
  auth: any;
  onChange: (auth: any) => void;
}

const OAuth1Auth: React.FC<OAuth1AuthProps> = ({ auth, onChange }) => {
  const set = (patch: Record<string, unknown>) => onChange({ ...auth, type: 'oauth1', ...patch });
  const signatureMethod = auth.signatureMethod || 'HMAC-SHA1';
  const usesPrivateKey = signatureMethod.startsWith('RSA');

  return (
    <StyledWrapper className="space-y-2">
      <AuthField label="Consumer Key" value={auth.consumerKey || ''} placeholder="Consumer key" onChange={(v) => set({ consumerKey: v })} />
      <AuthField label="Consumer Secret" type="password" value={auth.consumerSecret || ''} placeholder="Consumer secret" onChange={(v) => set({ consumerSecret: v })} />
      <AuthField label="Access Token" value={auth.accessToken || ''} placeholder="Access token" onChange={(v) => set({ accessToken: v })} />
      <AuthField label="Token Secret" type="password" value={auth.accessTokenSecret || ''} placeholder="Access token secret" onChange={(v) => set({ accessTokenSecret: v })} />
      <AuthSelect label="Signature" value={signatureMethod} options={OAUTH1_SIGNATURE_METHODS} onChange={(v) => set({ signatureMethod: v })} />
      {usesPrivateKey && (
        <AuthField
          label="Private Key"
          value={auth.privateKey?.value || ''}
          placeholder="PEM private key"
          onChange={(v) => set({ privateKey: { type: auth.privateKey?.type || 'text', value: v } })}
        />
      )}
      <AuthField label="Callback URL" value={auth.callbackUrl || ''} placeholder='"oob" for out-of-band' onChange={(v) => set({ callbackUrl: v })} />
      <AuthField label="Verifier" value={auth.verifier || ''} onChange={(v) => set({ verifier: v })} />
      <AuthField label="Nonce" value={auth.nonce || ''} placeholder="Auto-generated if empty" onChange={(v) => set({ nonce: v })} />
      <AuthField label="Timestamp" value={auth.timestamp || ''} placeholder="Auto-generated if empty" onChange={(v) => set({ timestamp: v })} />
      <AuthField label="Realm" value={auth.realm || ''} onChange={(v) => set({ realm: v })} />
      <AuthField label="Version" value={auth.version || ''} placeholder="1.0" onChange={(v) => set({ version: v })} />
      <AuthSelect label="Add to" value={auth.placement || 'header'} options={OAUTH1_PLACEMENTS} onChange={(v) => set({ placement: v })} />
      <AuthCheckbox label="Include body hash in signature" checked={Boolean(auth.includeBodyHash)} onChange={(v) => set({ includeBodyHash: v })} />
    </StyledWrapper>
  );
};

export default OAuth1Auth;
