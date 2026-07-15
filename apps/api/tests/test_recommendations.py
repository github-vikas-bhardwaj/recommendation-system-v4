from unittest.mock import AsyncMock

VALID_REQUEST = {"showIds": [1, 2, 3]}


def test_recommendations_valid_body(client, auth_headers, monkeypatch):
    monkeypatch.setattr(
        "index.recommend",
        AsyncMock(return_value=[123, 456, 789]),
    )

    response = client.post(
        "/recommendations",
        json=VALID_REQUEST,
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json() == {"recommendedShowIds": [123, 456, 789]}


def test_recommendations_rejects_extra_field(client, auth_headers):
    response = client.post(
        "/recommendations",
        json={"showIds": [1], "hack": True},
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_recommendations_rejects_invalid_type(client, auth_headers):
    response = client.post(
        "/recommendations",
        json={"showIds": ["not-a-number"]},
        headers=auth_headers,
    )

    assert response.status_code == 422
