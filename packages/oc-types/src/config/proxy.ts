/**
 * Proxy configuration for HTTP and gRPC requests
 */

export interface ProxyAuth {
  username: string;
  password: string;
}

export type ProxyAuthConfig = false | ProxyAuth;

export interface ProxyConnectionConfig {
  protocol?: string;
  hostname?: string;
  port?: number;
  auth?: ProxyAuthConfig;
  bypassProxy?: string;
}

export interface Proxy {
  enabled?: boolean;
  inherit?: boolean;
  config?: ProxyConnectionConfig;
}
