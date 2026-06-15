// Validate and store the selected CSV file, updating the dropzone UI.
function setFile(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".csv")) {
    showToast("Please select a .csv file");
    return;
  }
  state.selectedFile = file;
  dom.dropzone.classList.add("has-file");
  dom.dropzone.querySelector("strong").textContent = "CSV ready";
  dom.dropHint.innerHTML = `<span class="file-name">${file.name}</span>`;
}

// Wire up click-to-browse and drag & drop on the dropzone.
function initUpload() {
  const { dropzone, fileInput } = dom;

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => setFile(e.target.files[0]));

  ["dragover", "dragenter"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("drag");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("drag");
    })
  );
  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) setFile(file);
  });
}
