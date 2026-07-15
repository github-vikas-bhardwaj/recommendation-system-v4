import json
from pathlib import Path
from typing import Any

import jsonschema
import pytest
from jsonschema.exceptions import ValidationError as JsonSchemaValidationError
from pydantic import ValidationError

from schemas.generated.recommendations_request import RecommendationsRequest
from schemas.generated.recommendations_response import RecommendationsResponse

CONTRACTS_DIR = (
    Path(__file__).resolve().parents[3] / "packages" / "api-contracts" / "schemas"
)
REQUEST_SCHEMA_PATH = CONTRACTS_DIR / "recommendations.request.json"
RESPONSE_SCHEMA_PATH = CONTRACTS_DIR / "recommendations.response.json"

VALID_REQUEST: dict[str, Any] = {"showIds": [1, 2, 3]}
VALID_RESPONSE: dict[str, Any] = {
    "recommendations": [
        {"showId": 123, "score": 98},
        {"showId": 456, "score": 91},
        {"showId": 789, "score": 85},
    ]
}
INVALID_REQUESTS = [
    pytest.param({}, id="missing-showIds"),
    pytest.param({"showIds": []}, id="empty-showIds"),
    pytest.param({"showIds": ["1", "2"]}, id="string-items"),
    pytest.param({"showIds": [1, "two", 3]}, id="mixed-item-types"),
    pytest.param({"showIds": [1], "userId": 1}, id="extra-field"),
    pytest.param({"showIds": [1], "hack": True}, id="unknown-extra-field"),
]


@pytest.fixture
def request_schema() -> dict[str, Any]:
    return json.loads(REQUEST_SCHEMA_PATH.read_text(encoding="utf-8"))


@pytest.fixture
def response_schema() -> dict[str, Any]:
    return json.loads(RESPONSE_SCHEMA_PATH.read_text(encoding="utf-8"))


def test_valid_request_passes_jsonschema(request_schema: dict[str, Any]) -> None:
    jsonschema.validate(VALID_REQUEST, request_schema)


def test_valid_request_passes_pydantic() -> None:
    model = RecommendationsRequest.model_validate(VALID_REQUEST)
    assert model.model_dump(by_alias=True) == VALID_REQUEST


@pytest.mark.parametrize("payload", INVALID_REQUESTS)
def test_invalid_request_rejected_by_jsonschema(
    request_schema: dict[str, Any],
    payload: dict[str, Any],
) -> None:
    with pytest.raises(JsonSchemaValidationError):
        jsonschema.validate(payload, request_schema)


@pytest.mark.parametrize("payload", INVALID_REQUESTS)
def test_invalid_request_rejected_by_schema_or_pydantic(
    request_schema: dict[str, Any],
    payload: dict[str, Any],
) -> None:
    schema_rejects = False
    try:
        jsonschema.validate(payload, request_schema)
    except JsonSchemaValidationError:
        schema_rejects = True

    pydantic_rejects = False
    try:
        RecommendationsRequest.model_validate(payload)
    except ValidationError:
        pydantic_rejects = True

    assert schema_rejects or pydantic_rejects


def test_recommendation_response_matches_contract(
    response_schema: dict[str, Any],
) -> None:
    model = RecommendationsResponse.model_validate(VALID_RESPONSE)
    jsonschema.validate(model.model_dump(by_alias=True), response_schema)


def test_api_response_matches_contract(
    client,
    auth_headers: dict[str, str],
    response_schema: dict[str, Any],
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from unittest.mock import AsyncMock

    monkeypatch.setattr(
        "index.recommend",
        AsyncMock(return_value=VALID_RESPONSE["recommendations"]),
    )

    response = client.post(
        "/recommendations",
        json=VALID_REQUEST,
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json() == VALID_RESPONSE
    jsonschema.validate(response.json(), response_schema)
