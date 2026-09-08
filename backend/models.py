from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    age = Column(Integer)
    gender = Column(String(10)) # M / F
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("Session", back_populates="user")

class Scale(Base):
    __tablename__ = "scales"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), unique=True, index=True) # e.g. L, F, K, 1-Hs, etc.
    description = Column(String(255))
    mean = Column(Float, default=50.0)
    std_dev = Column(Float, default=10.0)

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_no = Column(Integer, unique=True, index=True)
    text = Column(String(1000))

class AnswerKey(Base):
    """
    Maps a question to a scale.
    answer_trigger: True for 'Yes', False for 'No'.
    If user's answer matches answer_trigger, they get a point for this scale.
    """
    __tablename__ = "answer_keys"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    scale_id = Column(Integer, ForeignKey("scales.id"))
    answer_trigger = Column(Boolean)

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="IN_PROGRESS") # IN_PROGRESS, COMPLETED
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="sessions")
    responses = relationship("Response", back_populates="session")
    results = relationship("Result", back_populates="session")

class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer = Column(Boolean) # True = Ya, False = Tidak

    session = relationship("Session", back_populates="responses")

class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    scale_id = Column(Integer, ForeignKey("scales.id"))
    raw_score = Column(Integer)
    t_score = Column(Float)
    is_valid = Column(Boolean, default=True) # Marked False if L/F/K invalidates it

    session = relationship("Session", back_populates="results")
    scale = relationship("Scale")
