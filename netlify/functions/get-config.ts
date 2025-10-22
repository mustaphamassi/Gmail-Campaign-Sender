import type { Handler } from '@netlify/functions';

const handler: Handler = async () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Google Client ID not configured on the server.' }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId }),
  };
};

export { handler };