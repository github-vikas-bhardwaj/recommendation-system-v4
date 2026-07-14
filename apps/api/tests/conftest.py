import pytest
from fastapi.testclient import TestClient

from config.settings import settings
from index import app

TEST_INTERNAL_SECRET = "test-internal-secret"
TEST_USER_ID = "user-test-id"


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


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
