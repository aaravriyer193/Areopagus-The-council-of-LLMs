// netlify/functions/utils/groq.js
export async function callGroq(prompt, model = 'llama-3.1-70b-versatile') {
  if (!process.env.GROQ_API_KEY) {
    console.warn('No GROQ_API_KEY set, skipping Groq');
    return '';
  }

  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.6,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error('Groq error:', data);
    return '';
  }

  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
