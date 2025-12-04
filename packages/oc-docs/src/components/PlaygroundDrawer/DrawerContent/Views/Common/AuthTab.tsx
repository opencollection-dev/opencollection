import React from 'react';

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
}

export const AuthTab: React.FC<AuthTabProps> = ({
  auth,
  onAuthChange,
  onAuthFieldChange,
  onItemChange,
  item,
  title = "Authentication",
  description,
  showInherit = false,
  showFullAuth = false
}) => {
  const authType = typeof auth === 'object' && auth !== null ? auth.type : auth === 'inherit' ? 'inherit' : 'none';

  // Helper function to update auth in the correct location
  const updateItemAuth = (newAuth: any) => {
    if (!onItemChange || !item) return;
    
    // Check if item has 'request' property (Collection/Folder) or auth directly (HttpRequest)
    if ('request' in item && item.request !== undefined) {
      // Collection or Folder: auth is nested in request
      onItemChange({ 
        ...item, 
        request: {
          ...item.request,
          auth: newAuth
        }
      });
    } else {
      // HttpRequest: auth is directly on item
      onItemChange({ 
        ...item, 
        auth: newAuth
      });
    }
  };

  const handleAuthTypeChange = (newAuthType: string) => {
    if (showFullAuth && onItemChange && item) {
      let auth: any;
      
      if (newAuthType === 'none') {
        auth = undefined;
      } else if (newAuthType === 'inherit') {
        auth = 'inherit';
      } else if (newAuthType === 'basic') {
        auth = { type: 'basic', username: '', password: '' };
      } else if (newAuthType === 'bearer') {
        auth = { type: 'bearer', token: '' };
      } else if (newAuthType === 'apikey') {
        auth = { type: 'apikey', key: '', value: '', placement: 'header' };
      } else {
        auth = { type: newAuthType as any };
      }
      
      updateItemAuth(auth);
    } else {
      onAuthChange(newAuthType);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        {description && (
          <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Type
          </span>
          <select
            value={authType}
            onChange={(e) => handleAuthTypeChange(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="none">No Auth</option>
            {showInherit && <option value="inherit">Inherit</option>}
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="apikey">API Key</option>
            <option value="digest">Digest Auth</option>
            <option value="awsv4">AWS Signature v4</option>
          </select>
        </div>

        {!auth ? (
          <div className="text-center py-6 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            No authentication configured. Select an auth type to configure.
          </div>
        ) : auth === 'inherit' ? (
          <div className="text-center py-6 border-2 border-dashed rounded" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            Authentication inherited from parent
          </div>
        ) : showFullAuth && typeof auth === 'object' && auth !== null ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Type: {auth.type}
              </span>
            </div>
            
            {auth.type === 'basic' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                    Username:
                  </label>
                  <input
                    type="text"
                    value={auth.username || ''}
                    onChange={(e) => {
                      updateItemAuth({ type: 'basic', username: e.target.value, password: auth.password });
                    }}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Enter username"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                    Password:
                  </label>
                  <input
                    type="password"
                    value={auth.password || ''}
                    onChange={(e) => {
                      updateItemAuth({ type: 'basic', password: e.target.value, username: auth.username });
                    }}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Enter password"
                  />
                </div>
              </>
            )}
            
            {auth.type === 'bearer' && (
              <div className="flex items-center gap-2">
                <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                  Token:
                </label>
                <input
                  type="text"
                  value={auth.token || ''}
                  onChange={(e) => {
                    updateItemAuth({ type: 'bearer', token: e.target.value });
                  }}
                  className="flex-1 px-2 py-1 text-sm border rounded"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Enter bearer token"
                />
              </div>
            )}
            
            {auth.type === 'apikey' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                    Key:
                  </label>
                  <input
                    type="text"
                    value={auth.key || ''}
                    onChange={(e) => {
                      updateItemAuth({ ...auth, type: 'apikey', key: e.target.value });
                    }}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Enter API key name"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                    Value:
                  </label>
                  <input
                    type="text"
                    value={auth.value || ''}
                    onChange={(e) => {
                      updateItemAuth({ ...auth, type: 'apikey', value: e.target.value });
                    }}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Enter API key value"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm" style={{ color: 'var(--text-primary)' }}>
                    Add to:
                  </label>
                  <select
                    value={auth.placement || 'header'}
                    onChange={(e) => {
                      const placement = e.target.value as 'header' | 'query';
                      updateItemAuth({ ...auth, type: 'apikey', placement });
                    }}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="header">Header</option>
                    <option value="query">Query Parameter</option>
                  </select>
                </div>
              </>
            )}
            
            {!['basic', 'bearer', 'apikey'].includes(auth.type) && (
              <div className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                Configuration for {auth.type} auth is not yet implemented
              </div>
            )}
          </div>
        ) : typeof auth === 'object' && auth !== null && !showFullAuth && (
          <div className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
            Configuration for {auth.type} auth is not yet implemented in {title.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTab;
