from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse

from auth.dependencies import require_authenticated_bff
from config.settings import settings
from schemas.generated.recommendations_request import RecommendationsRequest
from schemas.generated.recommendations_response import RecommendationsResponse

app = FastAPI(
    docs_url="/docs" if settings.is_local else None,
    redoc_url="/redoc" if settings.is_local else None,
    openapi_url="/openapi.json" if settings.is_local else None,
)


@app.get("/health")
def root():
    return JSONResponse(status_code=200, content={"detail": "Up and running"})


@app.post("/recommendations", response_model=RecommendationsResponse)
def recommendations(
    request: RecommendationsRequest,
    user_id: Annotated[str, Depends(require_authenticated_bff)],
):
    return {"recommendedShowIds": [123, 456, 789]}
