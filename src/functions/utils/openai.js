// netlify/functions/utils/openai.js
export async function callOpenAI(prompt, model = 'gpt-4.1-mini') {
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
      max_tokens: 800,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error?.message || 'OpenAI request failed');

  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
