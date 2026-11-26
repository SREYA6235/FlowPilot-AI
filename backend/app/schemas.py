
from pydantic import BaseModel


class QuestionRequest(BaseModel):
    question: str


class AnalysisRequest(BaseModel):
    x_column: str
    y_column: str
    chart_type: str = "bar"

