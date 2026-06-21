from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.graph import build_graph
import pandas as pd


app = FastAPI(
    title="AI Data Analyst",
    description="An AI-powered data analyst that can answer questions about your data.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    query: str = Form("Give me a summary of this dataset")
):
    try:
        df = pd.read_csv(file.file, encoding='utf-8')
    except UnicodeDecodeError:
        file.file.seek(0)
        df = pd.read_csv(file.file, encoding='latin-1')
    raw_data = df.to_json(orient='columns')
    graph = build_graph()
    result = await graph.ainvoke({
        "messages": [{"role": "user", "content": query}],
        "raw_data": raw_data,
        "columns_meta": {},
        "statistics": {},
        "charts": [],
        "insights": [],
        "route_to": []
    })
    return result