from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import api, auth

# Automatically create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MMPI Scoring API")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only, should be specific in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(api.router, prefix="/api", tags=["api"])

@app.get("/")
def root():
    return {"message": "MMPI Scoring Engine API is running"}
