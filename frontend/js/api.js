const API_BASE = "http://localhost:8000";

// POST the CSV file + query to the backend and return the parsed JSON result.
async function analyzeRequest(file, query) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("query", query);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}
