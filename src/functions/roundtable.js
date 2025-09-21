// netlify/functions/roundtable.js
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

    // Helper to safely call an LLM
    async function safeCall(fn, name) {
      try {
        const res = await fn(prompt);
        return res || `*No response from ${name}*`;
      } catch (err) {
        console.error(`${name} error:`, err);
        return `*Error: ${name} failed to load or respond*`;
      }
    }

    // Gather responses concurrently
    const [openaiRes, claudeRes, geminiRes] = await Promise.all([
      safeCall(callOpenAI, 'OpenAI'),
      safeCall(callClaude, 'Claude'),
      safeCall(callGemini, 'Gemini'),
    ]);

    // Moderator step: OpenAI merges
    const moderatorPrompt = `
You are the moderator of the Areopagus council.
Your task: merge and refine the following answers into one final reply that is
- accurate,
- clear,
- concise,
- and draws the best insights from each.

User Prompt: ${prompt}

--- OpenAI Response ---
${openaiRes}

--- Claude Response ---
${claudeRes}

--- Gemini Response ---
${geminiRes}

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
