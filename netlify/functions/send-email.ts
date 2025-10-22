import type { Handler } from '@netlify/functions';
// FIX: Import Buffer to resolve TypeScript error "Cannot find name 'Buffer'".
import { Buffer } from 'buffer';

// Helper function to create the raw email message
const createRawMessage = (to: string, from: string, subject: string, body: string): string => {
  const message = [
    `Content-Type: text/html; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    `to: ${to}`,
    `from: ${from}`,
    `subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`, // Handles UTF-8 subjects
    ``,
    body,
  ].join('\n');

  // Base64Url encode the message (different from standard Base64)
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { to, from, subject, body, accessToken } = JSON.parse(event.body || '{}');

    if (!to || !from || !subject || !body || !accessToken) {
      return { statusCode: 400, body: 'Missing required fields in request body.' };
    }

    const rawMessage = createRawMessage(to, from, subject, body);

    const gmailResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: rawMessage,
      }),
    });

    const responseData = await gmailResponse.json();

    if (!gmailResponse.ok) {
        console.error('Gmail API Error:', responseData);
        return { statusCode: gmailResponse.status, body: JSON.stringify(responseData) };
    }
    
    return { statusCode: 200, body: JSON.stringify(responseData) };

  } catch (error) {
    console.error("Error in send-email function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error processing request: ${error.message}` }),
    };
  }
};

export { handler };