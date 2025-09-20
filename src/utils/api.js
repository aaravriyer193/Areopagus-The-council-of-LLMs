export const sendPromptToCouncil = async (prompt) => {
// placeholder endpoint for serverless roundtable orchestration
const res = await fetch('/.netlify/functions/roundtable', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ prompt }),
});
if (!res.ok) throw new Error('Roundtable API failed');
return res.json(); // expected: [{ senderId, text, ts }, ...]
};
