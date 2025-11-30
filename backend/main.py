from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, submissions, analytics

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ResearchSentinel API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(submissions.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ResearchSentinel API"}
