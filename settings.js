document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    chrome.storage.sync.get([
        'yourName',
        'enableAutoSuggestion',
        'lastXChat',
        'openAIKey',
        'modelSelect'
    ], function(data) {
        document.getElementById('yourName').value = data.yourName || false;
        document.getElementById('enableAutoSuggestion').checked = data.enableAutoSuggestion || false;
        document.getElementById('lastXChat').value = data.lastXChat || 10;
        document.getElementById('openAIKey').value = data.openAIKey || '';
        document.getElementById('modelSelect').value = data.modelSelect || 'gpt-4-1106-preview';
    });

    // Save button functionality
    document.getElementById('saveButton').addEventListener('click', function() {
        let yourName = document.getElementById('yourName').value;
        let enableAutoSuggestion = document.getElementById('enableAutoSuggestion').checked;
        let lastXChat = document.getElementById('lastXChat').value;
        let openAIKey = document.getElementById('openAIKey').value;
        let modelSelect = document.getElementById('modelSelect').value;
        chrome.storage.sync.set({yourName, enableAutoSuggestion, lastXChat, openAIKey, modelSelect}, function() {
            console.log('Settings saved');
        });
    });
});
