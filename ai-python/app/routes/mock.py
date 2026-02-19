from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
from app.services.generator import generate_test_structure
from app.services.scoring import calculate_score
from app.services.analytics import section_analysis

router = APIRouter()

class Question(BaseModel):
    id: str
    section: str

class StartTestRequest(BaseModel):
    type: str
    difficulty: str
    questions: List[Question]

@router.post("/generate")
def generate_test(data: StartTestRequest):
    selected = generate_test_structure(
        data.type,
        data.difficulty,
        [q.dict() for q in data.questions]
    )

    return {"selected_questions": selected}
