// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request); 
    if (request.action === "copy_config") {
        const allHtml = document.documentElement.outerHTML;
        const cssBlock = '#container {\n  height: 100vh;\n}';
        const startIndex = allHtml.indexOf(cssBlock);

        if (startIndex !== -1) {
            const copiedHtml = allHtml.substring(startIndex + cssBlock.length);
            console.log("Copied HTML:", copiedHtml);
            sendResponse({ html: copiedHtml });
        } else {
            console.error("CSS block not found for copying.");
            sendResponse({ html: '', error: "CSS block not found for copying." });
        }
    } else if (request.action === "paste_config") {
        try {
            // Get the outer HTML of the current page
            const allHtml = document.documentElement.outerHTML;
            const cssBlock = '#container {\n  height: 100vh;\n}';
            const startIndex = allHtml.indexOf(cssBlock);

            if (startIndex !== -1) {
                // Find the end of the CSS block
                const insertionPoint = startIndex + cssBlock.length;

                // Check if the HTML to be pasted is valid
                if (request.html && typeof request.html === 'string' && request.html.trim() !== '') {
                    // Create the new HTML by combining the CSS block and the copied HTML
                    const newHtml = allHtml.substring(0, insertionPoint) + request.html;

                    // Update the document's outer HTML
                    document.documentElement.outerHTML = newHtml; 
                    console.log("HTML successfully pasted.");
                    sendResponse({ status: "success" });
                } else {
                    console.error("Invalid HTML received for pasting:", request.html);
                    sendResponse({ status: "error", message: "Invalid HTML received for pasting." });
                }
            } else {
                console.error("CSS block not found for insertion.");
                sendResponse({ status: "error", message: "CSS block not found for insertion." });
            }
        } catch (error) {
            console.error("Error in paste logic:", error);
            sendResponse({ status: "error", message: "An error occurred during pasting." });
        }
        // Important: Return true to indicate that we will respond asynchronously
        return true; 
    }
});
