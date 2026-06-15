import pandas as pd
from prophet import Prophet
import plotly.express as px

from app.agents.state import AnalystState

async def forecast_data(state: AnalystState) -> dict:
    query = state['messages'][-1].content
    columns_meta = state['columns_meta']
    raw_data = state['raw_data']
    df = pd.read_json(raw_data)
    datetime_col = [col for col, dtype in columns_meta.items() if dtype == "datetime"][0]
    numeric_cols = [col for col, dtype in columns_meta.items() if dtype == "numeric"]
    df_prophet = df[[datetime_col, numeric_cols[0]]].rename(
    columns={datetime_col: "ds", numeric_cols[0]: "y"}
        )
    model = Prophet()
    model.fit(df_prophet)
    future = model.make_future_dataframe(periods=365)
    forecast = model.predict(future)
    fig = px.line(forecast, x="ds", y="yhat", title="Forecast")
    return {"charts": [fig.to_json()]}