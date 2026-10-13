const API_BASE = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://wi4ehqrtygslvz6ygmkmyhc2za0zujwh.lambda-url.eu-west-1.on.aws";

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
