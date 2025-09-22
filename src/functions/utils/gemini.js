/**
 * Sends a text prompt to a Gemini model using the Google AI Studio API.
 * This is a simpler method than using the Vertex AI endpoint and is
 * ideal for development and prototyping with the free tier.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @param {string} [model='gemini-1.5-flash-preview-0514'] The specific model to use.
 * @returns {Promise<string>} A promise that resolves to the model's text response or an error message.
 */
export async function callGemini(prompt, model = 'gemini-1.5-flash-preview-0514') {
  // Check for the required environment variable.
  // The Google AI Studio API uses a simple API key, not a service account JSON.
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Missing GEMINI_API_KEY environment variable.');
    return '*Gemini is unavailable: Your Google AI Studio configuration is incomplete.*';
  }

  // Use a try-catch block to handle potential errors during the API call.
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // The request body for the Google AI Studio endpoint is different.
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    };

    // Make the POST request to the Google AI Studio API.
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Google AI Studio API Error:', errorBody.error);
      return `*Error: API request failed with status ${response.status}. ${errorBody.error.message}*`;
    }

    // Parse the JSON response. The structure is different from the Vertex AI endpoint.
    const data = await response.json();

    // Extract the generated text from the candidates array.
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return text;
    }

    // Fallback if the response format is unexpected.
    console.warn('Unexpected response structure from Google AI Studio:', data);
    return JSON.stringify(data) || '*No valid response from Gemini*';

  } catch (err) {
    console.error('Gemini client execution error:', err);
    return `*Error: The Gemini request failed. ${err.message}*`;
  }
}
