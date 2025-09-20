// netlify/functions/utils/claude.js
export async function callClaude(prompt, model = 'claude-3-5-sonnet-20240620') {
  if (!process.env.CLAUDE_API_KEY) {
    console.warn('No CLAUDE_API_KEY set, skipping Claude');
    return '';
  }

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      temperature: 0.6,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error('Claude error:', data);
    return '';
  }

  return data.content?.[0]?.text?.trim() ?? '';
}
