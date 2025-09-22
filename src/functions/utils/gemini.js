// Import the GoogleAuth library for authenticating with Google Cloud services.
import { GoogleAuth } from 'google-auth-library';

/**
 * Sends a prompt to a Gemini model on Google Cloud Vertex AI using a service account.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @param {string} [model='gemini-1.5-flash-preview-0514'] The specific Vertex AI model to use.
 * @returns {Promise<string>} A promise that resolves to the model's text response or an error message.
 */
export async function callGemini(prompt, model = 'gemini-1.5-flash-preview-0514') {
  // Check for the required environment variables.
  if (!process.env.GEMINI_KEY_JSON || !process.env.GC_PROJECT_ID) {
    console.warn('Missing GEMINI_KEY_JSON or GC_PROJECT_ID environment variables.');
    return '*Gemini is unavailable: Your Google Cloud configuration is incomplete.*';
  }

  try {
    // --- Step 1: Authentication ---
    // Parse the service account credentials stored in the environment variable.
    const credentials = JSON.parse(process.env.GEMINI_KEY_JSON);

    // Create a new GoogleAuth client with the provided credentials and required scope.
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // Get an authenticated client and generate an OAuth2 access token.
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // --- Step 2: API Endpoint Construction ---
    // Construct the URL for the Vertex AI predict endpoint.
    const projectId = process.env.GC_PROJECT_ID;
    const location = 'us-central1'; // Or your specific GCP region
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

    // --- Step 3: API Request ---
    // Make the POST request to the Vertex AI API.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      // The request payload must match the format expected by the Vertex AI endpoint.
      body: JSON.stringify({
        instances: [{
          content: {
            parts: [{ text: prompt }],
          },
        }],
        parameters: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Vertex AI API Error:', errorBody.error);
        return `*Error: API request failed with status ${response.status}. ${errorBody.error.message}*`;
    }

    // --- Step 4: Response Parsing ---
    // Parse the JSON response from the API.
    const data = await response.json();

    // Extract the generated text from the predictions array.
    // The path is specific to the Vertex AI response structure for Gemini.
    const text = data.predictions?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return text;
    }

    // Fallback if the response format is unexpected.
    console.warn('Unexpected response structure from Vertex AI:', data);
    return JSON.stringify(data) || '*No valid response from Gemini*';

  } catch (err) {
    console.error('Gemini client execution error:', err);
    return `*Error: The Gemini request failed. ${err.message}*`;
  }
}
