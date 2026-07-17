import type { OpenCollection } from '@opencollection/types';

export const noEnvsFixtureCollection = {
  opencollection: '1.0.0',
  info: { name: 'No Environments Demo', version: '1.0.0' },
  config: {
    environments: []
  },
  items: [
    { name: 'Ping', type: 'http', seq: 1, method: 'GET', url: 'https://api.example.com/ping' }
  ]
} as unknown as OpenCollection;
