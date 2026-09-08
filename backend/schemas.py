from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

class QuestionResponse(BaseModel):
    id: int
    question_no: int
    text: str

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    dob: date
    gender: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class SessionCreate(BaseModel):
    user_id: int

class AnswerSubmit(BaseModel):
    question_id: int
    answer: bool

class AnswersSubmitBulk(BaseModel):
    answers: List[AnswerSubmit]

class ResultResponse(BaseModel):
    valid: bool
    t_scores: dict
    raw_scores: dict
