from app.agents.state import AnalystState
from app.config import llm

from app.prompts import ANALYST_PROMPT

async def analyst(state: AnalystState) -> dict:
    query = state['messages'][-1].content
    columns_meta = state['columns_meta']
    statistics = state['statistics']
    prompt = ANALYST_PROMPT
    chain = prompt | llm
    insights = chain.invoke({
    "query": query,
    "columns_meta": columns_meta,
    "statistics": statistics
}).content

    return {"insights": [insights]}