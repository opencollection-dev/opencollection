export function createPropertyTable(properties, order, required = []) {
  if (!properties) return '';
  
  const rows = order.map(key => {
    const prop = properties[key];
    if (!prop) return '';
    
    const isRequired = required.includes(key);
    const type = getPropertyType(prop);
    const description = prop.description || '';
    
    return `
      <tr>
        <td><span class="property-name">${key}</span></td>
        <td><span class="property-type">${type}</span></td>
        <td>${isRequired ? '<span class="badge badge-required">Required</span>' : '<span class="badge badge-optional">Optional</span>'}</td>
        <td>${description}</td>
      </tr>
    `;
  }).join('');
  
  return `
    <table class="property-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

export function getPropertyType(prop) {
  if (prop.type) {
    if (prop.enum) {
      return `enum: ${prop.enum.join(' | ')}`;
    }
    return prop.type;
  }
  if (prop.$ref) {
    return prop.$ref.split('/').pop();
  }
  if (prop.oneOf) {
    return prop.oneOf.map(p => p.type || p.$ref?.split('/').pop() || 'object').join(' | ');
  }
  if (prop.const) {
    return `"${prop.const}"`;
  }
  return 'any';
}

export function formatAuthTypeName(authType) {
  const names = {
    'auth-awsv4': 'AWS V4 Authentication',
    'auth-basic': 'Basic Authentication',
    'auth-bearer': 'Bearer Token Authentication',
    'auth-digest': 'Digest Authentication',
    'auth-apikey': 'API Key Authentication',
    'auth-ntlm': 'NTLM Authentication',
    'auth-wsse': 'WSSE Authentication',
    'auth-oauth2': 'OAuth 2.0 Authentication'
  };
  return names[authType] || authType;
}

export function formatBodyTypeName(bodyType) {
  const names = {
    'raw-body': 'Raw Body',
    'form-urlencoded': 'Form URL Encoded Body',
    'multipart-form': 'Multipart Form Body',
    'file-body': 'File Body'
  };
  return names[bodyType] || bodyType;
}

export function getAuthSchemaName(authType) {
  const mapping = {
    'auth-awsv4': 'AuthAwsV4',
    'auth-basic': 'AuthBasic',
    'auth-bearer': 'AuthBearer',
    'auth-digest': 'AuthDigest',
    'auth-apikey': 'AuthApiKey',
    'auth-ntlm': 'AuthNTLM',
    'auth-wsse': 'AuthWsse',
    'auth-oauth2': 'AuthOAuth2'
  };
  return mapping[authType];
}

export function getBodySchemaName(bodyType) {
  const mapping = {
    'raw-body': 'RawBody',
    'form-urlencoded': 'FormUrlEncodedBody',
    'multipart-form': 'MultipartFormBody',
    'file-body': 'FileBody'
  };
  return mapping[bodyType];
}