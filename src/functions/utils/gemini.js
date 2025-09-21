export async function callGemini(prompt, model = 'gemini-1.5-pro') {
  if (!process.env.GEMINI_API_KEY || !process.env.GC_PROJECT_ID) {
    console.warn('Missing GEMINI_API_KEY or GC_PROJECT_ID');
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
    console.log('Gemini raw response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Failed to parse Gemini JSON');
      return '*Error: Gemini returned invalid JSON*';
    }

    if (!resp.ok) {
      console.error('Gemini API error:', data);
      return `*Error: Gemini failed (${resp.status})*`;
    }

    return data.candidates?.[0]?.output || '*No response from Gemini*';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return `*Error: Gemini fetch failed (${err.message})*`;
  }
}
