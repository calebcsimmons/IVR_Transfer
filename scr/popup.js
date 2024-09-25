document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('copy-config').addEventListener('click', () => {
        // Call the background script to copy HTML
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.runtime.sendMessage({ action: "copy_from_tab", tabId: tabs[0].id });
                console.log("Copying config from the current tab...");
            }
        });
    });

    document.getElementById('paste-config').addEventListener('click', () => {
        // Call the background script to paste HTML
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.runtime.sendMessage({ action: "paste_into_tab", tabId: tabs[0].id });
                console.log("Pasting config into the current tab...");
            }
        });
    });
});
