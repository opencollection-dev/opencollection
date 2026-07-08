/**
 * Collection items supported by the OpenCollection schema
 */

import type { Description } from '../common/description';
import type { Documentation } from '../common/documentation';
import type { RequestDefaults } from '../common/request-defaults';
import type { Tag } from '../common/tags';
import type { GraphQLRequest } from '../requests/graphql';
import type { GrpcRequest } from '../requests/grpc';
import type { HttpRequest } from '../requests/http';
import type { WebSocketRequest } from '../requests/websocket';

export interface FolderInfo {
  name?: string;
  description?: Description;
  type?: 'folder';
  seq?: number;
  tags?: Tag[];
}

export interface Folder {
  info?: FolderInfo;
  items?: Item[];
  request?: RequestDefaults;
  docs?: Documentation;
}

export interface ScriptFile {
  type: 'script';
  script?: string;
}

export interface AppInfo {
  name?: string;
  description?: Description;
  type?: 'app';
  seq?: number;
  tags?: Tag[];
}

export interface App {
  info?: AppInfo;
  code?: string;
}

export type Item = HttpRequest | GraphQLRequest | GrpcRequest | WebSocketRequest | Folder | ScriptFile | App;
