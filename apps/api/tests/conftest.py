from collections.abc import Iterator
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from config.settings import settings
from index import app

TEST_INTERNAL_SECRET = "test-internal-secret"
TEST_USER_ID = "user-test-id"


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> Iterator[TestClient]:
    fake_pool = MagicMock()

    async def fake_open_pool():
        return fake_pool

    async def fake_close_pool():
        return None

    monkeypatch.setattr("index.open_pool", fake_open_pool)
    monkeypatch.setattr("index.close_pool", fake_close_pool)

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def api_secret(monkeypatch: pytest.MonkeyPatch) -> str:
    monkeypatch.setattr(settings, "api_internal_secret", TEST_INTERNAL_SECRET)
    return TEST_INTERNAL_SECRET


@pytest.fixture
def mock_jwt(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "auth.dependencies.verify_bearer_token",
        lambda _authorization: TEST_USER_ID,
    )


@pytest.fixture
def auth_headers(api_secret: str, mock_jwt: None) -> dict[str, str]:
    return {
        "X-Internal-Api-Key": api_secret,
        "Authorization": "Bearer test-token",
    }
