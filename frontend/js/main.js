// Shared DOM references and app state, populated on init.
const dom = {};
const state = { selectedFile: null, sessions: [] };

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(dom, {
    fileInput: document.getElementById("fileInput"),
    dropzone: document.getElementById("dropzone"),
    dropHint: document.getElementById("dropHint"),
    queryInput: document.getElementById("queryInput"),
    analyzeBtn: document.getElementById("analyzeBtn"),
    summarizeBtn: document.getElementById("summarizeBtn"),
    results: document.getElementById("results"),
    subtitle: document.getElementById("subtitle"),
    chatEl: document.getElementById("chat"),
    chatEmpty: document.getElementById("chatEmpty"),
    toast: document.getElementById("toast"),
  });

  initUpload();

  dom.analyzeBtn.addEventListener("click", () => runAnalysis());
  dom.summarizeBtn.addEventListener("click", () =>
    runAnalysis("Give me a summary of this dataset")
  );
  dom.queryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runAnalysis();
  });
});

// Runs an analysis. When `presetQuery` is provided (e.g. the "Analyze Dataset"
// button), it bypasses the textarea so the user doesn't have to type.
async function runAnalysis(presetQuery) {
  const query = (presetQuery ?? dom.queryInput.value).trim();
  if (!state.selectedFile) return showToast("Upload a CSV first");
  if (!query) return showToast("Enter a question");

  setLoading(true);
  dom.subtitle.textContent = `Analyzing “${query}”…`;
  const bubble = addUserBubble(query);
  dom.queryInput.value = "";

  try {
    const data = await analyzeRequest(state.selectedFile, query);

    // Store the session so the bubble can re-render this result later
    // without issuing another network request. Push BEFORE render so the
    // bubble's dataset.sessionIndex resolves to this entry.
    state.sessions.push({ query, data });
    setActiveBubble(bubble);
    render(query, data);
  } catch (err) {
    showToast(err.message || "Request failed");
    dom.subtitle.textContent = "Something went wrong. Try again.";
  } finally {
    setLoading(false);
  }
}

function setLoading(loading) {
  dom.summarizeBtn.disabled = loading;
  dom.analyzeBtn.disabled = loading;
  dom.analyzeBtn.innerHTML = loading
    ? '<span class="spinner"></span>'
    : "Send";
}

let toastTimer;
function showToast(msg) {
  dom.toast.textContent = msg;
  dom.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 3000);
}
