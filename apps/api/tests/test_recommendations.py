from unittest.mock import AsyncMock

VALID_REQUEST = {"showIds": [1, 2, 3]}
VALID_RESPONSE = {
    "recommendations": [
        {"showId": 123, "score": 98},
        {"showId": 456, "score": 91},
        {"showId": 789, "score": 85},
    ]
}


def test_recommendations_valid_body(client, auth_headers, monkeypatch):
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
