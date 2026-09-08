from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuestionResponse(BaseModel):
    id: int
    question_no: int
    text: str

    class Config:
        orm_mode = True
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    age: int
    gender: str

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
