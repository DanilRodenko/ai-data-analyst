# AI Data Analyst

Multi-agent system for natural language data analysis. Upload a CSV/Excel file, 
ask questions in plain English, and get statistical insights, visualizations, 
and forecasts — powered by a LangGraph orchestrated pipeline.

## Architecture

         ┌─────────────┐
  CSV →  │  profiler   │  (pandas: types, stats, missing values)
         └──────┬──────┘
                ↓
         ┌─────────────┐
         │   router    │  (LLM classifies query → which agents to run)
         └──────┬──────┘
                ↓
      ┌─────────┼─────────┐
      ↓         ↓         ↓
  ┌────────┐┌──────────┐┌────────────┐
  │analyst ││visualizer││ forecaster │
  └────┬───┘└────┬─────┘└─────┬──────┘
       └─────────┼─────────────┘
                  ↓
          ┌──────────────┐
          │ synthesizer  │  (concise answer to the user's question)
          └──────────────┘

## Tech Stack

- **Orchestration**: LangGraph (conditional fan-out routing)
- **LLMs**: Groq (Llama 3.3 70B) for fast agents, Anthropic Claude for synthesis/visualization (better instruction-following)
- **Backend**: FastAPI
- **Visualization**: Plotly
- **Frontend**: Vanilla HTML/CSS/JS (no framework)
- **Tracing**: LangSmith

## Key Features

- **Smart routing**: an LLM-based router decides which agents to invoke per query, 
  rather than running the full pipeline every time
- **Query history**: previous dashboards are cached client-side and instantly 
  restorable without re-querying the backend
- **Auto-analysis**: one-click dataset summary on upload
- **Dynamic charts**: visualizer extracts column names directly from natural 
  language and builds the appropriate Plotly chart type

## Running locally

\`\`\`bash
# Backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
python -m http.server 3000
\`\`\`

Open `http://localhost:3000`

## Environment variables

See `.env.example` for required API keys (Groq, Anthropic, LangSmith).

## Project structure

\`\`\`
app/
├── agents/          # LangGraph nodes
│   ├── profiler.py
│   ├── router.py
│   ├── analyst.py
│   ├── visualizer.py
│   ├── forecaster.py
│   ├── synthesizer.py
│   └── state.py
├── prompts.py       # all LLM prompts, centralized
├── config.py        # LLM provider switching
├── graph.py         # graph assembly
└── main.py          # FastAPI app
frontend/
├── css/
├── js/
└── index.html
\`\`\`
