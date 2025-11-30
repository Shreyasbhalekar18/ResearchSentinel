from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, submissions, analytics, ai_features
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ResearchSentinel API")

# CORS - Allow both local and production URLs
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    os.getenv("FRONTEND_URL", ""),
]

# Add Vercel preview and production URLs
if os.getenv("VERCEL_URL"):
    allowed_origins.append(f"https://{os.getenv('VERCEL_URL')}")

# Filter out empty strings
allowed_origins = [origin for origin in allowed_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(submissions.router)
app.include_router(analytics.router)
app.include_router(ai_features.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ResearchSentinel API"}
