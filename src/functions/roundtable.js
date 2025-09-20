import { callOpenAI } from './utils/openai.js';
import { callClaude } from './utils/claude.js';
import { callGemini } from './utils/gemini.js';

export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    // Collect raw responses
    const [openaiRes, claudeRes, geminiRes] = await Promise.all([
      callOpenAI(prompt),
      callClaude(prompt),
      callGemini(prompt),
    ]);

    // Moderator prompt (OpenAI)
    const moderatorPrompt = `
You are the moderator of the Areopagus council.
Combine the following 3 responses into one single final answer that is:
- accurate,
- clear,
- concise,
- and takes the best ideas from each.

User Prompt: ${prompt}

OpenAI Response: ${openaiRes}
Claude Response: ${claudeRes}
Gemini Response: ${geminiRes}

Final Moderated Answer:
    `;

    const moderatedAnswer = await callOpenAI(moderatorPrompt);

    // Return in frontend-expected shape
    return {
      statusCode: 200,
      body: JSON.stringify([
        {
          id: Date.now().toString(),
          senderId: 'council',
          text: moderatedAnswer,
          ts: Date.now(),
        },
      ]),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
