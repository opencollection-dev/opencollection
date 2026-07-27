import type { OpenCollection } from '@opencollection/types';

// A single request carrying authored descriptions on every editable surface (query params, headers,
// pre-request variables, form-urlencoded body fields), used to prove the playground shows and edits
// them. One header uses the legacy `{ content }` object form to exercise description normalization.
export const descriptionsFixtureCollection = {
  opencollection: '1.0.0',
  info: { name: 'Descriptions Demo', version: '1.0.0' },
  items: [
    {
      name: 'Described Request',
      type: 'http',
      seq: 1,
      method: 'POST',
      url: 'https://api.example.com/orders?status=open',
      params: [
        { name: 'status', value: 'open', type: 'query', description: 'Filter orders by their fulfilment status' }
      ],
      headers: [
        { name: 'Authorization', value: 'Bearer token', description: 'Bearer access token for the API' },
        {
          name: 'X-Trace',
          value: 'abc-123',
          description: { content: 'Correlation id echoed back on the response', type: 'text' }
        }
      ],
      body: {
        type: 'form-urlencoded',
        data: [{ name: 'grant_type', value: 'client_credentials', description: 'The OAuth2 grant type to use' }]
      },
      runtime: {
        variables: [{ name: 'orderId', value: 'ord-42', description: 'The order identifier under test' }]
      }
    }
  ]
} as unknown as OpenCollection;
