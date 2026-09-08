from sqlalchemy.orm import Session
from models import Session as DBSession, AnswerKey, Response, Result, Scale

def calculate_scores(db: Session, session_id: int):
    # Fetch all responses for this session
    responses = db.query(Response).filter(Response.session_id == session_id).all()
    
    # Map responses: question_id -> answer (Boolean)
    response_map = {r.question_id: r.answer for r in responses}

    # Fetch all scales
    scales = db.query(Scale).all()
    
    # Initialize raw scores
    raw_scores = {s.id: 0 for s in scales}
    
    # Fetch all answer keys
    keys = db.query(AnswerKey).all()
    
    for key in keys:
        if key.question_id in response_map:
            # If user's answer matches the trigger, add point to raw score
            if response_map[key.question_id] == key.answer_trigger:
                raw_scores[key.scale_id] += 1
                
    # Calculate T-Scores and save results
    results_to_save = []
    
    # First pass: calculate t-scores
    t_scores = {}
    for scale in scales:
        raw = raw_scores[scale.id]
        # Formula: T = 50 + 10 * ((Raw - Mean) / SD)
        if scale.std_dev == 0:
            t = 50.0 # Prevent division by zero
        else:
            t = 50 + 10 * ((raw - scale.mean) / scale.std_dev)
        t_scores[scale.name] = t
        
        result = Result(
            session_id=session_id,
            scale_id=scale.id,
            raw_score=raw,
            t_score=t,
            is_valid=True # Default True, evaluate later
        )
        results_to_save.append(result)
        
    # Validity Check: L Scale > 65 or F > 80, etc. (Simplified validation logic)
    # Based on standard MMPI T-Score thresholds
    is_profile_valid = True
    l_t_score = t_scores.get("L", 50)
    f_t_score = t_scores.get("F", 50)
    
    if l_t_score > 65: # e.g. L scale too high
        is_profile_valid = False
    if f_t_score > 80: # e.g. F scale very high
        is_profile_valid = False
        
    # Update validity status for the session results
    for res in results_to_save:
        res.is_valid = is_profile_valid
        
    # Delete old results if recalculating
    db.query(Result).filter(Result.session_id == session_id).delete()
    
    db.add_all(results_to_save)
    
    # Update session status
    db_session = db.query(DBSession).filter(DBSession.id == session_id).first()
    if db_session:
        db_session.status = "COMPLETED"
        from datetime import datetime
        db_session.completed_at = datetime.utcnow()
        
    db.commit()
    
    return {"valid": is_profile_valid, "t_scores": t_scores, "raw_scores": raw_scores}
