/**
 * Root OpenCollection types and collection-level defaults
 */

import type { Documentation } from './common/documentation';
import type { RequestDefaults } from './common/request-defaults';
import type { Info } from './common/info';
import type { CollectionConfig } from './config/collection';
import type { Item } from './collection/item';

export type Extensions = Record<string, unknown>;

export interface OpenCollection {
  info?: Info;
  opencollection?: string;
  config?: CollectionConfig;
  items?: Item[];
  request?: RequestDefaults;
  docs?: Documentation;
  bundled?: boolean;
  extensions?: Extensions;
}
