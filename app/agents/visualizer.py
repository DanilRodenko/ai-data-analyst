import pandas as pd
import io
import plotly.express as px

from langchain_core.output_parsers import JsonOutputParser


from app.agents.state import AnalystState
from app.config import visualizer_llm as llm
from app.prompts import VISUALIZER_PROMPT


async def visualize_data(state: AnalystState) -> dict:
    query = state['messages'][-1].content
    columns_meta = state['columns_meta']
    raw_data = state['raw_data']
    df = pd.read_json(io.BytesIO(raw_data.encode('utf-8')))
    available_columns = list(df.columns)

    prompt = VISUALIZER_PROMPT

    chain = prompt | llm | JsonOutputParser()
    chart = chain.invoke({
        "query": query,
        "columns_meta": columns_meta,
        "available_columns": available_columns
    })

    chart_type = chart['chart_type']
    x = chart['x']
    y = chart.get('y')
    title = chart['title']

    if chart_type == 'histogram':
        fig = px.histogram(df, x=x, y=y, title=title)
    elif chart_type == 'bar':
        fig = px.bar(df, x=x, y=y, title=title)
    elif chart_type == 'scatter':
        fig = px.scatter(df, x=x, y=y, title=title)
    elif chart_type == 'line':
        fig = px.line(df, x=x, y=y, title=title)
    elif chart_type == 'box':
        fig = px.box(df, x=x, y=y, title=title)
    elif chart_type == "heatmap":
        corr = df.select_dtypes(include="number").corr()
        fig = px.imshow(corr, title=title)
    elif chart_type == 'pie':
        fig = px.pie(df, x=x, y=y, title=title)
    elif chart_type == 'treemap':
        fig = px.treemap(df, x=x, y=y, title=title)
    elif chart_type == 'funnel':
        fig = px.funnel(df, x=x, y=y, title=title)
    else:
        raise ValueError(f"Invalid chart type: {chart_type}")

    chart = fig.to_json()

    return {"charts": [chart]}
