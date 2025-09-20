import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

export async function callClaude(prompt) {
  const res = await client.messages.create({
    model: "claude-3.5-sonnet-20240620", // latest Claude 3.5 Sonnet
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  return res.content[0].text.trim();
}

