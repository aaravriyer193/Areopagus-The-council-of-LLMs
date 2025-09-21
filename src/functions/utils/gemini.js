// src/functions/utils/gemini.js
import { GoogleAuth } from 'google-auth-library';

export async function callGemini(prompt, model = 'gemini-1.5-pro') {
  if (!process.env.GEMINI_KEY_JSON || !process.env.GC_PROJECT_ID) {
    console.warn('Missing GEMINI_KEY_JSON or GC_PROJECT_ID');
    return '*Gemini unavailable*';
  }

  try {
    // Parse service account JSON
    const credentials = JSON.parse(process.env.GEMINI_KEY_JSON);

    // Authenticate
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // Gemini predict endpoint
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GC_PROJECT_ID}/locations/us-central1/publishers/google/models/${model}:predict`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ content: prompt }],
        parameters: { temperature: 0.7 },
      }),
    });

    const data = await res.json();

    // Always return something
    if (data.predictions?.[0]?.content) return data.predictions[0].content;

    // fallback: any other field or raw JSON
    if (data.predictions?.[0]?.output) return data.predictions[0].output;
    return JSON.stringify(data) || '*No response from Gemini*';
  } catch (err) {
    console.error('Gemini client error:', err);
    return `*Error: Gemini fetch failed (${err.message})*`;
  }
}
