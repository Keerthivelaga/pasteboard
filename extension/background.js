chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_SNIPPET") {
    const text = message.text;

    chrome.storage.local.get(["snippets"], (result) => {
      const snippets = result.snippets || [];

      // avoid duplicates
      if (snippets.some(s => s.text === text)) return;

      const newSnippet = {
        id: Date.now(),
        text,
        tags: [],
        pinned: false,
        time: Date.now()
      };

      const updated = [newSnippet, ...snippets];

      chrome.storage.local.set({ snippets: updated });

      console.log("Saved from background:", text);
      console.log("🚀 background running");
    });
  }
});