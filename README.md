⚖️ Areopagus: The Council of LLMs
A web-based chat application designed to facilitate a dialogue with a "council" of Large Language Models. Areopagus provides a clean, classical-themed interface for users to pose questions and receive responses as if from a deliberating body of AI minds. 

✨ Features
Council Deliberation: Engage in a conversation with multiple AI models, receiving their collective and unique insights.

Session Management: Save, load, and clear chat sessions, with a history sidebar for easy navigation.

Quick Prompts: Use pre-defined prompts to kickstart your discussions on various topics.

Elegant UI: A minimalist, classical design inspired by the ancient Greek council of the same name.

Markdown Rendering: The council's responses are rendered from Markdown, allowing for rich, formatted text.

Responsive Design: A seamless experience across desktop and mobile devices.

🚀 Tech Stack
HTML5: The structural foundation of the application.

CSS3: Custom styles to create the unique visual theme.

JavaScript (Vanilla): Powers all application logic, from UI interactions to API communication.

Marked.js: A powerful library for parsing Markdown.

DOMPurify: Ensures all content is sanitized and secure before rendering.

💻 Installation
To get a local copy up and running, follow these steps:

Clone the repository:

git clone [https://github.com/aaravriyer193/Areopagus-The-council-of-LLMs.git](https://github.com/aaravriyer193/Areopagus-The-council-of-LLMs.git)

Navigate to the project directory:

cd Areopagus-The-council-of-LLMs

Run Locally:
The application is a front-end web app. You can open index.html directly in your web browser. However, for the chat functionality to work, you will need to set up a backend service to handle the LLM API calls.

The application currently expects a backend function at the URL specified by the FN_URL constant in the JavaScript code. You will need to create your own backend function (e.g., using a serverless function, a simple Node.js server, or a Python script) that takes a prompt and returns a response from your chosen AI models.

📚 Usage
Once the application is running:

Send a Prompt: Type your question into the text area at the bottom and click "Send" or press Enter.

View Responses: The council's deliberation will appear in the chat area above.

Manage Sessions: Use the buttons in the header to save, clear, or start a new session.

Browse History: Click on any session in the "Sessions" sidebar to reload a previous conversation.

Quickly Prompt: Use the predefined prompts in the "Quick Prompts" section to get started instantly.

🤝 Contributing
Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

📄 License
This project is licensed under the MIT License.
