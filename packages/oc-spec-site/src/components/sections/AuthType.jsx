import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { formatAuthTypeName, getAuthSchemaName } from '../../utils/schemaHelpers'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function AuthType({ authType, schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const schemaName = getAuthSchemaName(authType);
  const auth = schema.$defs[schemaName];
  
  const getAuthExample = (type) => {
    const examples = {
      'auth-awsv4': {
        type: "awsv4",
        accessKeyId: "AKIAIOSFODNN7EXAMPLE",
        secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        region: "us-east-1",
        service: "execute-api"
      },
      'auth-basic': {
        type: "basic",
        username: "admin",
        password: "password123"
      },
      'auth-bearer': {
        type: "bearer",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      'auth-digest': {
        type: "digest",
        username: "user",
        password: "pass"
      },
      'auth-apikey': {
        type: "apikey",
        key: "X-API-Key",
        value: "your-api-key-here",
        placement: "header"
      },
      'auth-ntlm': {
        type: "ntlm",
        username: "user",
        password: "pass",
        domain: "DOMAIN"
      },
      'auth-wsse': {
        type: "wsse",
        username: "user",
        password: "pass"
      },
      'auth-oauth2': {
        type: "oauth2",
        flow: "client_credentials",
        accessTokenUrl: "https://api.example.com/oauth/token",
        credentials: {
          clientId: "your-client-id",
          clientSecret: "your-client-secret",
          placement: "body"
        },
        scope: "read write"
      }
    };
    
    return examples[type];
  };

  const example = getAuthExample(authType);

  // OAuth2 flow examples
  const clientCredentialsExample = `type: oauth2
flow: client_credentials
accessTokenUrl: "https://api.example.com/oauth/token"
refreshTokenUrl: "https://api.example.com/oauth/refresh"
credentials:
  clientId: "your-client-id"
  clientSecret: "your-client-secret"
  placement: body
scope: "read write"
tokenConfig:
  id: "myToken"
  placement:
    header: "Authorization"
settings:
  autoFetchToken: true
  autoRefreshToken: true`;

  const resourceOwnerExample = `type: oauth2
flow: resource_owner_password_credentials
accessTokenUrl: "https://api.example.com/oauth/token"
credentials:
  clientId: "your-client-id"
  clientSecret: "your-client-secret"
  placement: body
resourceOwner:
  username: "user@example.com"
  password: "userpassword"
scope: "read write"`;

  const authorizationCodeExample = `type: oauth2
flow: authorization_code
authorizationUrl: "https://api.example.com/oauth/authorize"
accessTokenUrl: "https://api.example.com/oauth/token"
callbackUrl: "https://myapp.com/callback"
credentials:
  clientId: "your-client-id"
  clientSecret: "your-client-secret"
  placement: body
scope: "read write"
state: "random-state-string"
pkce:
  enabled: true
  method: S256`;

  const implicitExample = `type: oauth2
flow: implicit
authorizationUrl: "https://api.example.com/oauth/authorize"
callbackUrl: "https://myapp.com/callback"
credentials:
  clientId: "your-client-id"
scope: "read write"
state: "random-state-string"`;

  // Handle OAuth2 which is a oneOf with multiple flow types
  const renderOAuth2Content = () => {
    if (authType === 'auth-oauth2' && auth.oneOf) {
      const clientCredentialsFlow = schema.$defs.OAuth2ClientCredentialsFlow;
      const resourceOwnerFlow = schema.$defs.OAuth2ResourceOwnerPasswordFlow;
      const authCodeFlow = schema.$defs.OAuth2AuthorizationCodeFlow;
      const implicitFlow = schema.$defs.OAuth2ImplicitFlow;

      return (
        <>
          <p className={`${typography.body.default} ${spacing.element}`}>
            OAuth 2.0 supports multiple authorization flows. Choose the appropriate flow based on your application type:
          </p>

          {/* Client Credentials Flow */}
          <div id="oauth2-client-credentials" className="section-divider">
            <h3 className={typography.heading.h2}>Client Credentials Flow</h3>
            <p className={`${typography.body.default} ${spacing.element}`}>{clientCredentialsFlow.description}</p>
            <p className={`${typography.body.default} ${spacing.element}`}>
              Best for: Server-to-server authentication where no user interaction is needed.
            </p>
            
            <h4 className={typography.heading.h3}>Properties</h4>
            <PropertyTable 
              properties={clientCredentialsFlow.properties}
              order={['type', 'flow', 'accessTokenUrl', 'refreshTokenUrl', 'credentials', 'scope', 'additionalParameters', 'tokenConfig', 'settings']}
              required={clientCredentialsFlow.required}
            />
            
            <h4 className={typography.heading.h3}>Example</h4>
            <CodeBlock code={clientCredentialsExample} language="yaml" />
          </div>

          {/* Resource Owner Password Flow */}
          <div id="oauth2-resource-owner" className="section-divider">
            <h3 className={typography.heading.h2}>Resource Owner Password Flow</h3>
            <p className={`${typography.body.default} ${spacing.element}`}>{resourceOwnerFlow.description}</p>
            <p className={`${typography.body.default} ${spacing.element}`}>
              Best for: Highly trusted applications where the user provides credentials directly to the app.
            </p>
            
            <h4 className={typography.heading.h3}>Properties</h4>
            <PropertyTable 
              properties={resourceOwnerFlow.properties}
              order={['type', 'flow', 'accessTokenUrl', 'refreshTokenUrl', 'credentials', 'resourceOwner', 'scope', 'additionalParameters', 'tokenConfig', 'settings']}
              required={resourceOwnerFlow.required}
            />
            
            <h4 className={typography.heading.h3}>Example</h4>
            <CodeBlock code={resourceOwnerExample} language="yaml" />
          </div>

          {/* Authorization Code Flow */}
          <div id="oauth2-authorization-code" className="section-divider">
            <h3 className={typography.heading.h2}>Authorization Code Flow</h3>
            <p className={`${typography.body.default} ${spacing.element}`}>{authCodeFlow.description}</p>
            <p className={`${typography.body.default} ${spacing.element}`}>
              Best for: Web applications with a backend server. Most secure and commonly used flow.
            </p>
            
            <h4 className={typography.heading.h3}>Properties</h4>
            <PropertyTable 
              properties={authCodeFlow.properties}
              order={['type', 'flow', 'authorizationUrl', 'accessTokenUrl', 'refreshTokenUrl', 'callbackUrl', 'credentials', 'scope', 'state', 'pkce', 'additionalParameters', 'tokenConfig', 'settings']}
              required={authCodeFlow.required}
            />
            
            <h4 className={typography.heading.h3}>Example</h4>
            <CodeBlock code={authorizationCodeExample} language="yaml" />
          </div>

          {/* Implicit Flow */}
          <div id="oauth2-implicit" className="section-divider">
            <h3 className={typography.heading.h2}>Implicit Flow</h3>
            <p className={`${typography.body.default} ${spacing.element}`}>{implicitFlow.description}</p>
            <p className={`${typography.body.default} ${spacing.element}`}>
              Best for: Single-page applications (SPAs). Note: This flow is deprecated in OAuth 2.1; consider using Authorization Code with PKCE instead.
            </p>
            
            <h4 className={typography.heading.h3}>Properties</h4>
            <PropertyTable 
              properties={implicitFlow.properties}
              order={['type', 'flow', 'authorizationUrl', 'callbackUrl', 'credentials', 'scope', 'state', 'additionalParameters', 'tokenConfig', 'settings']}
              required={implicitFlow.required}
            />
            
            <h4 className={typography.heading.h3}>Example</h4>
            <CodeBlock code={implicitExample} language="yaml" />
          </div>
        </>
      );
    }
    
    return (
      <>
        <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
        <PropertyTable 
          properties={auth.properties}
          order={Object.keys(auth.properties || {})}
          required={auth.required || []}
        />
        {example && (
          <>
            <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
            <CodeBlock code={convertToYaml(example)} language="yaml" />
          </>
        )}
      </>
    );
  };

  return (
    <section>
      <h2 className={typography.heading.h2}>{formatAuthTypeName(authType)}</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{auth.description}</p>
      
      {renderOAuth2Content()}
    </section>
  )
}

export default AuthType