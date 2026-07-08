import type { OpenCollection } from '@opencollection/types';

export const variablesFixtureCollection = {
  opencollection: '1.0.0',
  info: { name: 'Variables Demo', version: '1.0.0' },
  config: {
    environments: [
      {
        name: 'Dev',
        variables: [
          { name: 'host', value: 'https://api.dev.example.com' },
          { name: 'endpoint', value: '{{host}}/v1' },
          { name: 'bearer_token', value: 'super-secret-token', secret: true }
        ]
      }
    ]
  },
  request: {
    headers: [
      { name: 'X-Api-Version', value: '{{apiVersion}}' },
      { name: 'Authorization', value: 'Bearer {{bearer_token}}' }
    ],
    variables: [
      { name: 'apiVersion', value: '2024-01' },
      { name: 'profile', value: { type: 'object', data: { city: 'NYC', zip: 10001 } } }
    ]
  },
  items: [
    {
      name: 'Customers',
      type: 'folder',
      seq: 1,
      request: {
        headers: [{ name: 'X-Folder-Scope', value: '{{folderScope}}' }],
        variables: [{ name: 'folderScope', value: 'from-folder' }]
      },
      items: [
        {
          name: 'Variables Demo',
          type: 'http',
          seq: 1,
          method: 'GET',
          url: '{{host}}/customers/{{userId}}?v={{apiVersion}}',
          headers: [
            { name: 'Authorization', value: 'Bearer {{bearer_token}}' },
            { name: 'X-Endpoint', value: '{{endpoint}}' },
            { name: 'X-Folder', value: '{{folderScope}}' },
            { name: 'X-Profile', value: '{{profile}}' },
            { name: 'X-Home', value: '{{process.env.HOME}}' },
            { name: 'X-Random', value: '{{$randomInt}}' }
          ],
          runtime: {
            variables: [{ name: 'userId', value: 'req-42' }]
          }
        }
      ]
    }
  ]
} as unknown as OpenCollection;
