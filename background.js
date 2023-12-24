
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "injectWhatsAppScript") {
        // First, inject the settings as a script
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: setSettings,
            args: [request.settings] // Pass the settings as an argument
        }, () => {
            // After settings are set, inject the main scripts
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: ['jquery-3.7.0.min.js', 'whatsapp-inject.js']
            });
        });
    } else if (request.action === "injectCSS") {
        chrome.scripting.insertCSS({
            target: { tabId: sender.tab.id },
            files: ["whatsapp-inject.css"]
        });
    }
});

// Function to set settings on the window object
function setSettings(settings) {
    window.whatsappSettings = settings;
}
