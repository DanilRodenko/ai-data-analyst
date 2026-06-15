// Append a user message bubble to the chat history.
function addUserBubble(text) {
  dom.chatEmpty.style.display = "none";
  const el = document.createElement("div");
  el.className = "bubble user";
  el.textContent = text;
  dom.chatEl.appendChild(el);
  scrollChat();
}

function scrollChat() {
  dom.chatEl.scrollTop = dom.chatEl.scrollHeight;
}
