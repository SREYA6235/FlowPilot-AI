
import pandas as pd
import numpy as np


def analyze_dataset(df):
    numeric = df.select_dtypes(include=np.number)
    categorical = df.select_dtypes(
        include=["object", "category"]
    )

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "column_names": df.columns.tolist(),
        "numeric_columns": numeric.columns.tolist(),
        "categorical_columns": categorical.columns.tolist(),
        "missing_values": int(df.isnull().sum().sum()),
        "duplicates": int(df.duplicated().sum()),
        "statistics": numeric.describe().replace(
            {np.nan: None}
        ).to_dict(),
        "missing_by_column": {
            k: int(v)
            for k, v in df.isnull().sum().items()
        }
    }


def create_chart(df, x_column, y_column, chart_type):
    if x_column not in df.columns or y_column not in df.columns:
        raise ValueError("Invalid chart columns.")

    chart_type = chart_type.lower()

    if chart_type not in [
        "bar", "line", "pie", "scatter", "area"
    ]:
        raise ValueError("Unsupported chart type.")

    if chart_type == "pie":
        grouped = df.groupby(
            x_column, dropna=False
        )[y_column].sum().sort_values(
            ascending=False
        ).head(15)

        return {
            "type": "pie",
            "labels": [str(x) for x in grouped.index],
            "values": grouped.tolist()
        }

    if chart_type in ["bar", "line", "area"]:
        grouped = df.groupby(
            x_column, dropna=False
        )[y_column].sum().sort_values(
            ascending=False
        ).head(30)

        return {
            "type": chart_type,
            "labels": [str(x) for x in grouped.index],
            "values": grouped.tolist()
        }

    return {
        "type": "scatter",
        "labels": df[x_column].dropna().tolist()[:500],
        "values": df[y_column].dropna().tolist()[:500]
    }


def generate_insights(df):
    numeric = df.select_dtypes(include=np.number)

    insights = [
        f"Your dataset contains {len(df)} rows and {len(df.columns)} columns.",
        f"There are {int(df.isnull().sum().sum())} missing values.",
        f"There are {int(df.duplicated().sum())} duplicate records."
    ]

    for column in numeric.columns[:5]:
        insights.append(
            f"{column}: average {df[column].mean():.2f}, "
            f"maximum {df[column].max():.2f}, "
            f"minimum {df[column].min():.2f}."
        )

    return insights


def answer_question(df, question):
    q = question.lower()
    numeric = df.select_dtypes(include=np.number)

    if "row" in q:
        return f"The dataset has {len(df)} rows."

    if "column" in q:
        return f"The dataset has {len(df.columns)} columns: {', '.join(df.columns)}."

    if "missing" in q:
        return f"There are {int(df.isnull().sum().sum())} missing values."

    if "duplicate" in q:
        return f"There are {int(df.duplicated().sum())} duplicate rows."

    if len(numeric.columns) == 0:
        return "This dataset does not contain numeric columns."

    # Select a column mentioned in the question.
    selected = next(
        (c for c in numeric.columns if c.lower() in q),
        numeric.columns[0]
    )

    if "average" in q or "mean" in q:
        return f"The average of {selected} is {df[selected].mean():.2f}."

    if "highest" in q or "maximum" in q:
        return f"The highest value of {selected} is {df[selected].max():.2f}."

    if "lowest" in q or "minimum" in q:
        return f"The lowest value of {selected} is {df[selected].min():.2f}."

    if "total" in q or "sum" in q:
        return f"The total of {selected} is {df[selected].sum():.2f}."

    return (
        "Try asking about total, average, highest, lowest, "
        "missing values, duplicates, rows or columns."
    )
