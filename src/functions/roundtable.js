import { callOpenAI } from './utils/openai.js';
import { callGroq } from './utils/groq.js';
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
        return { model: name, response: res || null, success: !!res };
      } catch (err) {
        console.error(`${name} error:`, err);
        return { model: name, response: null, success: false, error: err.message };
      }
    }

    const [openaiRes, groqRes, geminiRes] = await Promise.all([
      safeCall(callOpenAI, 'OpenAI'),
      safeCall(callGroq, 'Groq'),
      safeCall(callGemini, 'Gemini'),
    ]);

    // Create inline status for moderator
    const statusText = `
**Prompt:** ${prompt}

**Model Status:**
- ${openaiRes.model}: ${openaiRes.success ? '✅ Responded' : `❌ Failed (${openaiRes.error || 'No response'})`}
- ${groqRes.model}: ${groqRes.success ? '✅ Responded' : `❌ Failed (${groqRes.error || 'No response'})`}
- ${geminiRes.model}: ${geminiRes.success ? '✅ Responded' : `❌ Failed (${geminiRes.error || 'No response'})`}

**Raw Responses:**
--- ${openaiRes.model} ---
${openaiRes.response || '*No response*'}

--- ${groqRes.model} ---
${groqRes.response || '*No response*'}

--- ${geminiRes.model} ---
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

    // Build chat messages
    const messages = [];

    // Push model responses as bubbles
    for (const res of [openaiRes, groqRes, geminiRes]) {
      messages.push({
        id: `${Date.now()}-${res.model}`,
        senderId: res.model.toLowerCase(),
        text: res.response || '*No response*',
        ts: Date.now(),
        success: res.success,
      });
    }

    // Push council moderated reply
    messages.push({
      id: Date.now().toString(),
      senderId: 'council',
      text: moderatedAnswer,
      ts: Date.now(),
    });

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(messages),
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
