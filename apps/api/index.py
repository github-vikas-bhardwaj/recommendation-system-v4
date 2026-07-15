from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse

from auth.dependencies import require_authenticated_bff
from config.settings import settings
from db.index import close_pool, open_pool
from retrieval.service import recommend
from schemas.generated.recommendations_request import RecommendationsRequest
from schemas.generated.recommendations_response import RecommendationsResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db_pool = await open_pool()
    yield
    await close_pool()


app = FastAPI(
    docs_url="/docs" if settings.is_local else None,
    redoc_url="/redoc" if settings.is_local else None,
    openapi_url="/openapi.json" if settings.is_local else None,
    lifespan=lifespan,
)


@app.get("/health")
def root():
    return JSONResponse(status_code=200, content={"detail": "Up and running"})


@app.post("/recommendations", response_model=RecommendationsResponse)
async def recommendations(
    request: RecommendationsRequest,
    http_request: Request,
    _user_id: Annotated[str, Depends(require_authenticated_bff)],
):
    recommended = await recommend(
        http_request.app.state.db_pool,
        request.show_ids,
    )
    return {"recommendations": recommended}
