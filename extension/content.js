console.log("🔥 NEW CONTENT SCRIPT LOADED");

document.addEventListener("copy", () => {
  const text = window.getSelection().toString().trim();

  if (!text) return;

  console.log("🔥 Copy:", text);

  chrome.runtime.sendMessage({
    type: "SAVE_SNIPPET",
    text: text
  });

  console.log("runtime:", chrome.runtime);
});