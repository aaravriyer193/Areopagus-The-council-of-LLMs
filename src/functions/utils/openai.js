// netlify/functions/utils/openai.js
export async function callOpenAI(prompt, model = 'gpt-3.5-turbo') {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 500,
    }),
  });

  let data;
  try {
    data = await resp.json();
  } catch (err) {
    const raw = await resp.text(); // fallback
    console.error('OpenAI raw response (not JSON):', raw);
    throw new Error(`OpenAI returned a non-JSON response: ${raw.slice(0, 200)}`);
  }

  if (!resp.ok) {
    console.error('OpenAI API error:', data);
    throw new Error(data.error?.message || 'OpenAI request failed');
  }

  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
