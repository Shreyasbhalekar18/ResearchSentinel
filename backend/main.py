from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, submissions, analytics, ai_features

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ResearchSentinel API")

# 🚀 TEMPORARY: Allow ALL origins to fix CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(submissions.router)
app.include_router(analytics.router)
app.include_router(ai_features.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ResearchSentinel API"}
