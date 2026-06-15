from app.agents.state import AnalystState

async def route_query(state: AnalystState) -> dict:
    query = state['messages'][-1].content
    columns_meta = state['columns_meta']
    router_to = ["analyst", "visualizer"]
    if "datetime" in columns_meta.values():
        router_to.append("forecaster")

    return {"route_to": router_to}