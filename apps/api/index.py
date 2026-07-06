from fastapi import FastAPI
from fastapi.responses import JSONResponse

from config.settings import settings
from schemas.requests.recommendation import RecommendationRequest

app = FastAPI(
    docs_url="/docs" if settings.is_local else None,
    redoc_url="/redoc" if settings.is_local else None,
    openapi_url="/openapi.json" if settings.is_local else None,
)


@app.get("/health")
def root():
    return JSONResponse(status_code=200, content={"detail": "Up and running"})


@app.post("/recommendations")
def recommendations(request: RecommendationRequest):
    return {"message": "Recommendations"}
