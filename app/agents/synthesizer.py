from langchain_core.messages import AIMessage

from app.agents.state import AnalystState
from app.config import llm
from app.prompts import SYNTHESIZER_PROMPT


async def synthesize_data(state: AnalystState) -> dict:
    query = state['messages'][-1].content
    insights = state['insights']
    charts = state['charts']
    prompt = SYNTHESIZER_PROMPT
    chain = prompt | llm
    synthesis = chain.invoke({
        "query": query,
        "insights": insights,
        "charts": charts,
    })
    return {"messages": [AIMessage(content=synthesis.content)]}