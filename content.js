function runSuggestionsFramework(settingsData) {
    // Send the settings data to the background script
    chrome.runtime.sendMessage({
        action: "injectWhatsAppScript",
        settings: settingsData
    });
}

chrome.storage.sync.get([
    'yourName',
    'enableAutoSuggestion',
    'lastXChat',
    'openAIKey',
    'modelSelect'
], function(data) {
    if (data.enableAutoSuggestion === true) {
        runSuggestionsFramework(data);
    }
});

// Inject custom CSS
chrome.runtime.sendMessage({action: "injectCSS"});
