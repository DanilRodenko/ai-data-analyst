// Append a user message bubble to the chat history.
function addUserBubble(text) {
  dom.chatEmpty.style.display = "none";
  const el = document.createElement("div");
  el.className = "bubble user clickable";
  el.textContent = text;

  // Index this bubble will map to once its session is pushed (see runAnalysis).
  el.dataset.sessionIndex = String(state.sessions.length);

  el.addEventListener("click", () => {
    const index = Number(el.dataset.sessionIndex);
    const session = state.sessions[index];
    if (!session) return; // data not ready yet (still analyzing)
    setActiveBubble(el);
    render(session.query, session.data);
  });

  dom.chatEl.appendChild(el);
  scrollChat();
  return el;
}

// Mark a single bubble as the currently viewed dashboard.
function setActiveBubble(bubble) {
  dom.chatEl
    .querySelectorAll(".bubble.user.active")
    .forEach((el) => el.classList.remove("active"));
  bubble.classList.add("active");
}

function scrollChat() {
  dom.chatEl.scrollTop = dom.chatEl.scrollHeight;
}
