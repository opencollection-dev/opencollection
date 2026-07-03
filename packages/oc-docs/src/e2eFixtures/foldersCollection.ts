import type { OpenCollection } from '@opencollection/types';

export const foldersFixtureCollection = {
  opencollection: '1.0.0',
  info: { name: 'Hotel API', version: '1.0.0' },
  config: {
    environments: [
      { name: 'Dev', variables: [{ name: 'host', value: 'https://api.hotel.dev' }, { name: 'api_key', value: 'dev-key-123' }] },
      { name: 'Prod', variables: [{ name: 'host', value: 'https://api.hotel.com' }, { name: 'api_key', value: 'prod-key-abc' }] },
    ],
  },
  items: [
    {
      name: 'Authentication',
      type: 'folder',
      seq: 1,
      items: [
        { name: 'Login', type: 'http', seq: 1, method: 'POST', url: '{{host}}/auth/login' },
        { name: 'Refresh Token', type: 'http', seq: 2, method: 'POST', url: '{{host}}/auth/refresh' },
        { name: 'Logout', type: 'http', seq: 3, method: 'POST', url: '{{host}}/auth/logout' },
        { name: 'Get Current User', type: 'http', seq: 4, method: 'GET', url: '{{host}}/auth/me' },
      ],
    },
    {
      name: 'Rooms',
      type: 'folder',
      seq: 2,
      items: [
        { name: 'List Rooms', type: 'http', seq: 1, method: 'GET', url: '{{host}}/rooms' },
        { name: 'Get Room', type: 'http', seq: 2, method: 'GET', url: '{{host}}/rooms/:id' },
        { name: 'Create Room', type: 'http', seq: 3, method: 'POST', url: '{{host}}/rooms' },
        { name: 'Update Room', type: 'http', seq: 4, method: 'PUT', url: '{{host}}/rooms/:id' },
        { name: 'Patch Room', type: 'http', seq: 5, method: 'PATCH', url: '{{host}}/rooms/:id' },
        { name: 'Room Headers', type: 'http', seq: 6, method: 'HEAD', url: '{{host}}/rooms/:id' },
        { name: 'Room Options', type: 'http', seq: 7, method: 'OPTIONS', url: '{{host}}/rooms' },
        { name: 'Purge Room Cache', type: 'http', seq: 8, method: 'PURGE', url: '{{host}}/rooms/:id/cache' },
        { name: 'Delete Room', type: 'http', seq: 9, method: 'DELETE', url: '{{host}}/rooms/:id' },
        {
          name: 'Availability',
          type: 'folder',
          seq: 6,
          items: [
            { name: 'Check Availability', type: 'http', seq: 1, method: 'GET', url: '{{host}}/rooms/:id/availability' },
            { name: 'Block Dates', type: 'http', seq: 2, method: 'POST', url: '{{host}}/rooms/:id/block' },
            { name: 'Unblock Dates', type: 'http', seq: 3, method: 'DELETE', url: '{{host}}/rooms/:id/block' },
          ],
        },
      ],
    },
    {
      name: 'Bookings',
      type: 'folder',
      seq: 3,
      items: [
        { name: 'List Bookings', type: 'http', seq: 1, method: 'GET', url: '{{host}}/bookings' },
        { name: 'Get Booking', type: 'http', seq: 2, method: 'GET', url: '{{host}}/bookings/:id' },
        {
          name: 'Lifecycle',
          type: 'folder',
          seq: 3,
          items: [
            { name: 'Create Booking', type: 'http', seq: 1, method: 'POST', url: '{{host}}/bookings' },
            { name: 'Confirm Booking', type: 'http', seq: 2, method: 'PATCH', url: '{{host}}/bookings/:id/confirm' },
            { name: 'Cancel Booking', type: 'http', seq: 3, method: 'DELETE', url: '{{host}}/bookings/:id' },
          ],
        },
        {
          name: 'Payments',
          type: 'folder',
          seq: 4,
          items: [
            { name: 'Get Payment', type: 'http', seq: 1, method: 'GET', url: '{{host}}/bookings/:id/payment' },
            { name: 'Charge Payment', type: 'http', seq: 2, method: 'POST', url: '{{host}}/bookings/:id/payment/charge' },
            { name: 'Refund Payment', type: 'http', seq: 3, method: 'POST', url: '{{host}}/bookings/:id/payment/refund' },
          ],
        },
      ],
    },
    {
      name: 'Guests',
      type: 'folder',
      seq: 4,
      items: [
        { name: 'List Guests', type: 'http', seq: 1, method: 'GET', url: '{{host}}/guests' },
        { name: 'Get Guest', type: 'http', seq: 2, method: 'GET', url: '{{host}}/guests/:id' },
        { name: 'Create Guest', type: 'http', seq: 3, method: 'POST', url: '{{host}}/guests' },
        { name: 'Update Guest', type: 'http', seq: 4, method: 'PUT', url: '{{host}}/guests/:id' },
        { name: 'Delete Guest', type: 'http', seq: 5, method: 'DELETE', url: '{{host}}/guests/:id' },
      ],
    },
    { name: 'Health Check', type: 'http', seq: 5, method: 'GET', url: '{{host}}/ping' },
    {
      name: 'Setup Script',
      type: 'script',
      seq: 6,
      script: "bru.setVar('requestedAt', Date.now());\nconsole.log('Hotel API docs loaded');",
    },
  ],
} as unknown as OpenCollection;
