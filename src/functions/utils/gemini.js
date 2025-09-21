// netlify/functions/utils/gemini.js
export async function callGemini(prompt, model = 'gemini-1.5-pro') {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('No GEMINI_API_KEY set, skipping Gemini');
    return '';
  }

  
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      console.error('Gemini error:', data);
      return '';
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return '';
  }
}
