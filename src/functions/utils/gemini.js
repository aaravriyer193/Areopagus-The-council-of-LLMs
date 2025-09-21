// netlify/functions/utils/gemini.js
export async function callGemini(prompt, model = 'gemini-1.5-pro') {
  if (!process.env.GEMINI_API_KEY || !process.env.GC_PROJECT_ID) {
    console.warn('Missing GEMINI_API_KEY or GC_PROJECT_ID, skipping Gemini');
    return '*Gemini unavailable*';
  }

  try {
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

    const text = await resp.text();

    if (!text) {
      console.error('Gemini returned empty response');
      return '*Error: Gemini returned no data*';
    }

    // Return raw text (no JSON parsing)
    return text.trim();

  } catch (err) {
    console.error('Gemini fetch error:', err);
    return `*Error: Gemini fetch failed (${err.message})*`;
  }
}
