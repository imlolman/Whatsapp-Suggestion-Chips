// Asynchronously fetch suggestions (static for now)
async function getSuggestions(chat) {
    // Check if a fetch operation is already in progress using a flag on the window object
    if (window.isFetchingSuggestions) {
        return []; // Return an empty array if a request is ongoing
    }

    // Get Prompt
    let prompt;
    const promptInput = document.getElementById('prompt');
    if (promptInput) {
        prompt = promptInput.value;
    } else {
        prompt = ""; // Set default prompt value if prompt input is not found
    }

    injectSuggestions(["Loading..."]);
    window.isFetchingSuggestions = true; // Set the flag to indicate a request is in progress

    try {
        let suggestions = await fetchSuggestions(chat, prompt);
        if (suggestions.choices && suggestions.choices.length > 0) {
            let content = JSON.parse(suggestions.choices[0].message.content);
            response = content.responses;

            window.isFetchingSuggestions = false; // Reset the flag after the request is complete
            return response;
        } else {
            // Handle the case where no suggestions are returned
            alert('No suggestions received');
            window.isFetchingSuggestions = false;
            return [];
        }
    } catch (error) {
        alert('Error fetching suggestions: ' + error.message);
        window.isFetchingSuggestions = false; // Reset the flag in case of an error
        return [];
    }
}


// Function to inject suggestions
function injectSuggestions(suggestions) {
    const footer = document.querySelector('footer');
    let suggestionsDiv = footer.querySelector('.suggestions');

    // If .suggestions div doesn't exist, create it
    if (!suggestionsDiv) {
        suggestionsDiv = document.createElement('div');
        suggestionsDiv.classList.add('suggestions');
        footer.prepend(suggestionsDiv);
    }

    if (suggestions.length != 0) {
        suggestionsDiv.innerHTML = '';
    }

    // Clear existing resuggest button if it exists
    const resuggestButton = footer.querySelector('.resuggest');
    if (!resuggestButton) {
        const reSuggestButton = document.createElement('div');
        reSuggestButton.classList.add('suggestion');
        reSuggestButton.classList.add('resuggest');
        reSuggestButton.textContent = 'Get Suggestions...';
        reSuggestButton.addEventListener('click', async () => {
            const suggestions = await getSuggestions(getChat());
            injectSuggestions(suggestions);
        });
        suggestionsDiv.appendChild(reSuggestButton);
    }

    // Inject new suggestions
    suggestions.forEach(text => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.classList.add('suggestion');
        suggestionDiv.textContent = text;

        // Add click event listener for copying text
        suggestionDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                // Tooltip - show 'Copied!' message
                const tooltip = document.createElement('span');
                tooltip.textContent = 'Copied!';
                tooltip.classList.add('tooltip');
                suggestionDiv.appendChild(tooltip);

                setTimeout(() => {
                    tooltip.classList.add('visible');
                    setTimeout(() => {
                        suggestionDiv.removeChild(tooltip);
                    }, 1000);
                }, 100);
            });
        });

        suggestionsDiv.appendChild(suggestionDiv);
    });

    // Check if prompt input box already exists
    const promptInput = document.getElementById('prompt');
    if (!promptInput) {
        // Insert a Input box to enter the prompt
        const promptInput = document.createElement('input');
        promptInput.classList.add('prompt');
        promptInput.id = 'prompt';
        promptInput.placeholder = 'Enter prompt here...(if needed)';
        suggestionsDiv.appendChild(promptInput);

        // Add event listener for enter key
        promptInput.addEventListener('keyup', async (event) => {
            if (event.key === 'Enter') {
                const prompt = promptInput.value;
                const suggestions = await getSuggestions(getChat());
                injectSuggestions(suggestions);
            }
        });
    }
}


// Placeholder function to check if new suggestions are needed
function checkForNewSuggestions(chat) {
    // Check if storedLastChat is empty. If so, set storedLastChat to chat and return true to initialize
    window.storedLastChat = window.storedLastChat || [];
    if (storedLastChat.length === 0) {
        storedLastChat = chat;
        return true;
    }

    // Compare storedLastChat to chat
    if (JSON.stringify(storedLastChat) !== JSON.stringify(chat)) {
        storedLastChat = chat;
        return true; // New chat data detected
    }

    // Check if suggestions are set. If not, return true to initialize
    if ($(".suggestion").length === 0) {
        return true;
    }

    return false; // No new chat data and suggestions are already set
}


// Function to get the chat data
function getChat() {
    const chatData = [];

    $("div.copyable-text").each((i, v) => {
        const prePlainText = $(v).data('pre-plain-text');

        if (!prePlainText) {
            return;
        }

        const messageText = $($(v).find(".selectable-text")[0]).text();

        // Extract the name from the pre-plain-text
        const nameMatch = prePlainText.trim().match(/\] (.+?):/);
        const name = nameMatch ? nameMatch[1] : 'Unknown';

        chatData.push({
            name: name,
            message: messageText
        });
    });

    // get last 10 messages
    chatData.splice(0, chatData.length - window.whatsappSettings.lastXChat);

    return chatData;
}


// Modified function to insert suggestions
async function insertSuggestions() {
    const footer = document.querySelector('footer');
    const chat = getChat();
    if (footer && checkForNewSuggestions(chat)) {
        injectSuggestions([]);
        // const suggestions = await getSuggestions(chat);
    }
}

async function fetchSuggestions(chatArray, prompt) {
    // Use the settings from window.whatsappSettings
    const settings = window.whatsappSettings;

    let chatMessages = [];

    let fullPrompt = "";

    if (prompt) {
        fullPrompt = "You are whatsapp user, learn the personality, language, emotion, way of assistant and respond to keep the conversation going and interesting. Suggest 3 possible and very short to medium replies (4-5 words only!) and 2 medium (10 words) reply in strings format in json array example {responses: ['shortMessage1', 'shortMessage2', 'shortMessage3', 'mediumMessage4', 'mediumMessage']}. \n\n"+prompt;
    }else{
        fullPrompt = "You are whatsapp user, learn the personality, language, emotion, way of assistant and respond to keep the conversation going and interesting. Suggest 3 possible and very short to medium replies (4-5 words only!) and 2 medium (10 words) reply in strings format in json array example {responses: ['shortMessage1', 'shortMessage2', 'shortMessage3', 'mediumMessage4', 'mediumMessage']}"
    }

    chatMessages.push({ role: "system", content: fullPrompt });

    chatArray.map(chat => ({ role: (chat.name == settings.yourName)? "assistant" : "user", content: chat.message }))
        .forEach(chat => chatMessages.push(chat));

    const body = {
        model: settings.modelSelect,
        response_format: {"type": "json_object"},
        max_tokens: 100,
        messages: chatMessages,
        temperature: 0.7
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.openAIKey}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetching suggestions failed:', error);
        return null;
    }
}

// Check every second for the footer element and the need for new suggestions
setInterval(insertSuggestions, 1000);