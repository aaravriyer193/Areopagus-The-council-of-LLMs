// netlify/functions/utils/gemini.js
export async function callGemini(prompt, model = 'gemini-2.0-pro') {
  // Check for required env vars
  if (!process.env.GEMINI_API_KEY || !process.env.GC_PROJECT_ID) {
    console.warn('Missing GEMINI_API_KEY or GC_PROJECT_ID, skipping Gemini');
    return '*Gemini unavailable*';
  }

  try {
    // Correct endpoint with project ID
    const url = `https://generativelanguage.googleapis.com/v1beta/projects/${process.env.GC_PROJECT_ID}/models/${model}:generateText?key=${process.env.GEMINI_API_KEY}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7,
        candidateCount: 1
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error('Gemini API error:', data);
      return `*Error: Gemini failed (${resp.status})*`;
    }

    // Return the first candidate text
    return data.candidates?.[0]?.output || '*No response from Gemini*';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return `*Error: Gemini fetch failed (${err.message})*`;
  }
}
