from langchain_core.output_parsers import JsonOutputParser

from app.agents.state import AnalystState
from app.config import llm
from app.prompts import ROUTER_PROMPT


async def route_query(state: AnalystState) -> dict:
    query = state['messages'][-1].content
    columns_meta = state['columns_meta']

    chain = ROUTER_PROMPT | llm | JsonOutputParser()
    route_to = chain.invoke({
        "query": query,
        "columns_meta": columns_meta
    })

    print(f"DEBUG: query='{query}' route_to={route_to}")

    return {"route_to": route_to}