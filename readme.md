# WhatsApp Suggestion Chips

WhatsApp Suggestion Chips is a Chrome extension that enhances the functionality of WhatsApp Web by using OpenAI to suggest potential responses to continue your conversations. 

It detects your tone, language, and personality to provide the most relevant suggestions.
It sends last X messages to OpenAI to generate suggestions. The default value of X is 10, but you can change it in the settings.

![English Suggestion Example](/images/english-suggestion-example.png)
![Hindi Suggestion Example](/images/hindi-suggestion-example.png)

## Features

- **AI Suggestions**: The extension provides AI-generated suggestions as chips for your next message, helping you to continue the conversation smoothly.
- **Custom Prompts**: It also includes a feature that allows you to provide a custom prompt to the AI, giving you the flexibility to guide the AI's suggestions.

## Installation

1. Download the repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable Developer Mode
4. Click on `Load unpacked`
5. Select the downloaded repository

## Configure Settings

- **Your Name (From Whatsapp Profile Settings)**: The extension will use your name to filter out your own messages from the conversation.
- **API Key**: You will need to provide your own OpenAI API key in order to use the extension. You can get one [here](https://beta.openai.com/).

## Usage

After installing the extension, open WhatsApp Web and start a conversation. The extension will automatically provide suggestions for your next message. If you want to provide a custom prompt to the AI, simply enter your prompt in the provided field.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details