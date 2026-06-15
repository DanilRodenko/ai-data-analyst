// Shared DOM references and app state, populated on init.
const dom = {};
const state = { selectedFile: null };

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(dom, {
    fileInput: document.getElementById("fileInput"),
    dropzone: document.getElementById("dropzone"),
    dropHint: document.getElementById("dropHint"),
    queryInput: document.getElementById("queryInput"),
    analyzeBtn: document.getElementById("analyzeBtn"),
    results: document.getElementById("results"),
    subtitle: document.getElementById("subtitle"),
    chatEl: document.getElementById("chat"),
    chatEmpty: document.getElementById("chatEmpty"),
    toast: document.getElementById("toast"),
  });

  initUpload();

  dom.analyzeBtn.addEventListener("click", runAnalysis);
  dom.queryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runAnalysis();
  });
});

async function runAnalysis() {
  const query = dom.queryInput.value.trim();
  if (!state.selectedFile) return showToast("Upload a CSV first");
  if (!query) return showToast("Enter a question");

  setLoading(true);
  dom.subtitle.textContent = `Analyzing “${query}”…`;
  addUserBubble(query);
  dom.queryInput.value = "";

  try {
    const data = await analyzeRequest(state.selectedFile, query);
    render(query, data);
  } catch (err) {
    showToast(err.message || "Request failed");
    dom.subtitle.textContent = "Something went wrong. Try again.";
  } finally {
    setLoading(false);
  }
}

function setLoading(loading) {
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
