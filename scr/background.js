// Function to send a message to the content script to copy HTML from the current tab
function copyFromCurrentTab(tabId) {
    console.log("Attempting to copy from tab:", tabId); // Log tab ID
    chrome.tabs.sendMessage(tabId, { action: "copy_config" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error copying config:", chrome.runtime.lastError);
            return;
        }
        if (response && response.html) {
            console.log("HTML copied successfully:", response.html);
            chrome.storage.local.set({ copiedHtml: response.html }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error storing copied HTML:", chrome.runtime.lastError);
                } else {
                    console.log("Copied HTML stored successfully.");
                }
            });
        } else {
            console.error("No HTML received from content script.", response);
            if (response && response.error) {
                console.error("Error details:", response.error);
            }
        }
    });
}

// Function to send a message to the content script to paste HTML into the current tab
function pasteIntoCurrentTab(tabId) {
    chrome.storage.local.get("copiedHtml", (data) => {
        if (!data.copiedHtml) {
            console.error("No HTML copied. Please copy from dev first.");
            return;
        }

        console.log("Attempting to paste the following HTML:", data.copiedHtml); // Log copied HTML

        // Attempt to send a message to the content script
        chrome.tabs.sendMessage(tabId, { action: "paste_config", html: data.copiedHtml }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error pasting into tab:", chrome.runtime.lastError);
                return;
            }

            console.log("Received response from content script:", response); // Log response
            if (response && response.status === "success") {
                console.log("HTML successfully pasted.");
            } else {
                console.error("Failed to paste HTML. Response:", response); // Debugging line
            }
        });
    });
}


// Listener for browser action (like clicking the extension icon)
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get("mode", (data) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving mode:", chrome.runtime.lastError);
            return;
        }
        const mode = data.mode || "dev";  // Default to 'dev' mode if not set
        if (mode === "dev") {
            console.log("Copying config from the current tab...");
            copyFromCurrentTab(tab.id);
        } else if (mode === "staging") {
            console.log("Pasting config into the current tab...");
            pasteIntoCurrentTab(tab.id);
        } else {
            console.error("Unknown mode:", mode);
        }
    });
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message from popup:", request);
    if (request.action === "copy_from_tab") {
        copyFromCurrentTab(request.tabId);
    } else if (request.action === "paste_into_tab") {
        pasteIntoCurrentTab(request.tabId);
    } else {
        console.error("Unknown action received from popup:", request.action);
    }
});
