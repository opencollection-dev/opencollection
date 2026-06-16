import type { OpenCollection } from '@opencollection/types';

/**
 * E2E-only fixture: a collection WITH nested folders, so the Playwright suite
 * can exercise folder hierarchy, nested slugs, auto-expand and prev/next walks
 * (BRU-3188). The shared dev sample (sampleCollection.ts) is intentionally flat,
 * so this lives separately and is mounted via `?fixture=folders` in dev.tsx.
 */
export const foldersFixtureCollection = {
  opencollection: '1.0.0',
  info: { name: 'Hotel API', version: '1.0.0' },
  config: {
    environments: [{ name: 'Dev', variables: [{ name: 'host', value: 'https://api.hotel.dev' }] }],
  },
  items: [
    {
      name: 'Authentication',
      type: 'folder',
      seq: 1,
      items: [
        { name: 'Login', type: 'http', seq: 1, method: 'POST', url: '{{host}}/auth/login' },
        { name: 'Refresh Token', type: 'http', seq: 2, method: 'POST', url: '{{host}}/auth/refresh' },
      ],
    },
    {
      name: 'Bookings',
      type: 'folder',
      seq: 2,
      items: [
        {
          name: 'Lifecycle',
          type: 'folder',
          seq: 1,
          items: [
            { name: 'Create Booking', type: 'http', seq: 1, method: 'POST', url: '{{host}}/bookings' },
            { name: 'Cancel Booking', type: 'http', seq: 2, method: 'DELETE', url: '{{host}}/bookings/1' },
          ],
        },
      ],
    },
    { name: 'Ping', type: 'http', seq: 3, method: 'GET', url: '{{host}}/ping' },
  ],
} as unknown as OpenCollection;
