from langgraph.graph import StateGraph, START, END
from app.agents.state import AnalystState
from app.agents.profiler import profile_data
from app.agents.router import route_query
from app.agents.analyst import analyst
from app.agents.visualizer import visualize_data
from app.agents.forecaster import forecast_data
from app.agents.synthesizer import synthesize_data


def fan_out(state: AnalystState) -> list[str]:
    return state["route_to"]


def build_graph() -> StateGraph[AnalystState]:
    graph = StateGraph(AnalystState)
    graph.add_node("profiler", profile_data)
    graph.add_node("router", route_query)
    graph.add_node("analyst", analyst)
    graph.add_node("visualizer", visualize_data)
    graph.add_node("forecaster", forecast_data)
    graph.add_node("synthesizer", synthesize_data)

    graph.add_edge(START, "profiler")
    graph.add_edge("profiler", "router")
    graph.add_conditional_edges(
        "router",
        fan_out,
        ["analyst", "visualizer", "forecaster"],
    )
    graph.add_edge("analyst", "synthesizer")
    graph.add_edge("visualizer", "synthesizer")
    graph.add_edge("forecaster", "synthesizer")
    graph.add_edge("synthesizer", END)
    return graph.compile()
