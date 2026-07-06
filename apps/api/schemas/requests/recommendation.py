from pydantic import BaseModel, ConfigDict, Field


class RecommendationRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    user_id: int = Field(alias="userId")
    show_ids: list[str] = Field(alias="showIds")
