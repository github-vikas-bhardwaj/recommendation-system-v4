import pytest
from fastapi.testclient import TestClient

from index import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
