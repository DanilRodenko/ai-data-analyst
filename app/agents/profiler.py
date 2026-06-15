import json
import numpy as np
import pandas as pd
import io

from app.agents.state import AnalystState

async def profile_data(state: AnalystState) -> dict:
    raw_data = state['raw_data']
    df = pd.read_json(io.BytesIO(raw_data.encode('utf-8')))
    columns_meta = {}

    for col, dtype in df.dtypes.items():
        if dtype == 'object':
            columns_meta[col] = 'categorical'
        elif dtype == 'int64' or dtype == 'float64':
            columns_meta[col] = 'numeric'
        elif dtype == 'datetime64[ns]':
            columns_meta[col] = 'datetime'
        else:
            columns_meta[col] = 'unknown'

    statistics = {
        "row_count": len(df),
        "column_count": len(df.columns),
        "missing_values": df.isnull().sum().to_dict(),
        "missing_count": df.isnull().sum().sum(),
        "missing_percentage": df.isnull().sum().sum() / (len(df) * len(df.columns)) * 100,
        "duplicated_count": df.duplicated().sum(),
        "duplicated_percentage": df.duplicated().sum() / len(df) * 100,
        "unique_count": df.nunique().sum(),
        "unique_percentage": df.nunique().sum() / len(df.columns) * 100,
        "description": df.describe().to_dict(),
        "head": df.head().to_dict(),
        "tail": df.tail().to_dict(),
        "sample": df.sample(min(10, len(df))).to_dict(),
        "sample_size": 10,
        "sample_percentage": 10 / len(df) * 100,
    }

    statistics = json.loads(json.dumps(statistics, default=lambda x: int(x) if isinstance(x, np.integer) else float(x) if isinstance(x, np.floating) else x))

    return {"columns_meta": columns_meta, "statistics": statistics}