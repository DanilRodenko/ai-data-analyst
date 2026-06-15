from langgraph.graph import MessagesState

class AnalystState(MessagesState):
    raw_data: str
    columns_meta: dict
    statistics: dict
    charts: list[dict]
    insights: list[str]
    route_to: list[str]