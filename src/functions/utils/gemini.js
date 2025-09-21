// netlify/functions/utils/gemini.js
import fetch from 'node-fetch';
import { GoogleAuth } from 'google-auth-library';

export async function callGemini(prompt, model = 'gemini-1.5-pro') {
  // Ensure the environment variables are set
  if (!process.env.GEMINI_KEY_JSON || !process.env.GC_PROJECT_ID) {
    console.warn('Missing GEMINI_KEY_JSON or GC_PROJECT_ID');
    return '*Gemini unavailable*';
  }

  try {
    // Parse the service account JSON from env
    const credentials = JSON.parse(process.env.GEMINI_KEY_JSON);

    // Create Google Auth client
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();

    // Construct the Gemini API endpoint
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GC_PROJECT_ID}/locations/us-central1/publishers/google/models/${model}:predict`;

    // Make the request
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await client.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ content: prompt }],
        parameters: { temperature: 0.7 },
      }),
    });

    // Parse response
    const data = await res.json();
    return data.predictions?.[0]?.content || '*No response from Gemini*';
  } catch (err) {
    console.error('Gemini client error:', err);
    return `*Error: Gemini fetch failed (${err.message})*`;
  }
}
