from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
import scoring_engine

router = APIRouter()

@router.post("/users", response_model=dict)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id, "name": db_user.name}

@router.get("/questions", response_model=List[schemas.QuestionResponse])
def get_questions(skip: int = 0, limit: int = 600, db: Session = Depends(get_db)):
    questions = db.query(models.Question).offset(skip).limit(limit).all()
    return questions

@router.post("/sessions", response_model=dict)
def start_session(session_data: schemas.SessionCreate, db: Session = Depends(get_db)):
    db_session = models.Session(user_id=session_data.user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return {"session_id": db_session.id}

@router.post("/sessions/{session_id}/submit")
def submit_answers(session_id: int, data: schemas.AnswersSubmitBulk, db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    for answer in data.answers:
        # Check if response already exists
        existing = db.query(models.Response).filter(
            models.Response.session_id == session_id,
            models.Response.question_id == answer.question_id
        ).first()
        
        if existing:
            existing.answer = answer.answer
        else:
            new_response = models.Response(
                session_id=session_id,
                question_id=answer.question_id,
                answer=answer.answer
            )
            db.add(new_response)
            
    db.commit()
    return {"message": "Answers saved successfully"}

@router.post("/sessions/{session_id}/score", response_model=schemas.ResultResponse)
def calculate_session_score(session_id: int, db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    results = scoring_engine.calculate_scores(db, session_id)
    return results

@router.get("/sessions/{session_id}/results", response_model=schemas.ResultResponse)
def get_session_results(session_id: int, db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    results = db.query(models.Result).filter(models.Result.session_id == session_id).all()
    if not results:
        # Calculate if not already calculated
        return calculate_session_score(session_id, db)
        
    t_scores = {}
    raw_scores = {}
    is_valid = True
    
    for r in results:
        t_scores[r.scale.name] = r.t_score
        raw_scores[r.scale.name] = r.raw_score
        if not r.is_valid:
            is_valid = False
            
    return {
        "valid": is_valid,
        "t_scores": t_scores,
        "raw_scores": raw_scores
    }
