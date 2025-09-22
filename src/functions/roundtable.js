import { callOpenAI } from './utils/openai.js';
import { callClaude } from './utils/claude.js';
import { callGemini } from './utils/gemini.js';

export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing prompt' }),
      };
    }

    async function safeCall(fn, name) {
      try {
        const res = await fn(prompt);
        return { response: res || null, success: !!res };
      } catch (err) {
        console.error(`${name} error:`, err);
        return { response: null, success: false, error: err.message };
      }
    }

    const [openaiRes, claudeRes, geminiRes] = await Promise.all([
      safeCall(callOpenAI, 'OpenAI'),
      safeCall(callClaude, 'Claude'),
      safeCall(callGemini, 'Gemini'),
    ]);

    // Create inline status for the chatbubble
    const statusText = `
**Prompt:** ${prompt}

**Model Status:**
- OpenAI: ${openaiRes.success ? '✅ Responded' : `❌ Failed (${openaiRes.error || 'No response'})`}
- Claude: ${claudeRes.success ? '✅ Responded' : `❌ Failed (${claudeRes.error || 'No response'})`}
- Gemini: ${geminiRes.success ? '✅ Responded' : `❌ Failed (${geminiRes.error || 'No response'})`}

**Raw Responses:**
--- OpenAI ---
${openaiRes.response || '*No response*'}

--- Claude ---
${claudeRes.response || '*No response*'}

--- Gemini ---
${geminiRes.response || '*No response*'}
`;

    const moderatorPrompt = `
You are the moderator of the Areopagus council.
Your task: merge and refine the following answers into one final reply that is
- accurate,
- clear,
- elaborate
- and draws the best insights from each.
- keeps equal weightage to each and facilitates all the points

${statusText}

Final Moderated Answer:
`;

    const moderatedAnswer = await callOpenAI(moderatorPrompt);

    const message = {
      id: Date.now().toString(),
      senderId: 'council',
      text: moderatedAnswer,
      ts: Date.now(),
    };

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify([message]),
    };
  } catch (err) {
    console.error('Roundtable error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message || String(err) }),
    };
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}
