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

    // Helper to safely call an LLM and return an error message in response
    async function safeCall(fn, name) {
      try {
        const res = await fn(prompt);
        return { response: res || null, success: !!res };
      } catch (err) {
        console.error(`${name} error:`, err);
        return { response: null, success: false, error: err.message };
      }
    }

    // Call LLMs concurrently
    const [openaiRes, claudeRes, geminiRes] = await Promise.all([
      safeCall(callOpenAI, 'OpenAI'),
      safeCall(callClaude, 'Claude'),
      safeCall(callGemini, 'Gemini'),
    ]);

    // Prepare status log for each model
    const statusLog = {
      OpenAI: openaiRes.success ? 'Responded' : `Failed (${openaiRes.error || 'No response'})`,
      Claude: claudeRes.success ? 'Responded' : `Failed (${claudeRes.error || 'No response'})`,
      Gemini: geminiRes.success ? 'Responded' : `Failed (${geminiRes.error || 'No response'})`,
    };

    // Moderator prompt to merge responses
    const moderatorPrompt = `
You are the moderator of the Areopagus council.
Your task: merge and refine the following answers into one final reply that is
- accurate,
- clear,
- concise,
- and draws the best insights from each.

User Prompt: ${prompt}

--- OpenAI Response ---
${openaiRes.response || '*No response*'}

--- Claude Response ---
${claudeRes.response || '*No response*'}

--- Gemini Response ---
${geminiRes.response || '*No response*'}

Final Moderated Answer:
    `;

    const moderatedAnswer = await callOpenAI(moderatorPrompt);

    const message = {
      id: Date.now().toString(),
      senderId: 'council',
      prompt: prompt,               // include the user prompt in output
      text: moderatedAnswer,
      statusLog: statusLog,         // include whether each model responded
      rawResponses: {
        OpenAI: openaiRes.response || `*Error: ${openaiRes.error || 'No response'}*`,
        Claude: claudeRes.response || `*Error: ${claudeRes.error || 'No response'}*`,
        Gemini: geminiRes.response || `*Error: ${geminiRes.error || 'No response'}*`,
      },
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
