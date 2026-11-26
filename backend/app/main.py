
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pathlib import Path
import pandas as pd
import io

from app.schemas import QuestionRequest, AnalysisRequest
from app.engine import (
    analyze_dataset,
    create_chart,
    generate_insights,
    answer_question
)

app = FastAPI(title="FlowPilot AI Analytics")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {
        "message": "FlowPilot AI Analytics is running",
        "api_payment_required": False
    }


@app.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    global current_df

    filename = Path(file.filename or "").name

    if not filename.lower().endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV or Excel file."
        )

    try:
        content = await file.read()

        if len(content) > 20 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="File size must be under 20 MB."
            )

        if filename.lower().endswith((".xlsx", ".xls")):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.BytesIO(content))

        if df.empty:
            raise ValueError("The uploaded dataset is empty.")

        if len(df.columns) > 100:
            raise ValueError("Maximum supported columns: 100.")

        current_df = df

        return {
            "filename": filename,
            "summary": analyze_dataset(df),
            "insights": generate_insights(df),
            "preview": df.head(10).fillna("").to_dict(
                orient="records"
            )
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@app.post("/chart")
def build_chart(request: AnalysisRequest):
    if current_df is None:
        raise HTTPException(
            status_code=400,
            detail="Upload a dataset first."
        )

    try:
        return create_chart(
            current_df,
            request.x_column,
            request.y_column,
            request.chart_type
        )
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@app.post("/ask")
def ask_question(request: QuestionRequest):
    if current_df is None:
        raise HTTPException(
            status_code=400,
            detail="Upload a dataset first."
        )

    return {
        "answer": answer_question(
            current_df,
            request.question
        )
    }


@app.get("/download")
def download_dataset():
    if current_df is None:
        raise HTTPException(
            status_code=400,
            detail="Upload a dataset first."
        )

    stream = io.BytesIO()
    current_df.to_csv(stream, index=False)
    stream.seek(0)

    return StreamingResponse(
        stream,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=flowpilot_data.csv"
        }
    )
