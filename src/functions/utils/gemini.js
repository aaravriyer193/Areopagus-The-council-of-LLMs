export async function callGemini(prompt, model = 'gemini-1.5-pro') {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('No GEMINI_API_KEY set, skipping Gemini');
    return '*Gemini unavailable*';
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateText?key=${process.env.GEMINI_API_KEY}`;

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

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Failed to parse Gemini JSON, raw:', text);
      return '*Error: Gemini returned invalid JSON*';
    }

    return data.candidates?.[0]?.output || '*No response from Gemini*';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return `*Error: Gemini fetch failed (${err.message})*`;
  }
}
