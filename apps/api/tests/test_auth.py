VALID_REQUEST = {"showIds": [1, 2, 3]}


def test_recommendations_rejects_missing_auth(client, api_secret):
    response = client.post("/recommendations", json=VALID_REQUEST)

    assert response.status_code == 401


def test_recommendations_rejects_wrong_internal_key(client, api_secret):
    response = client.post(
        "/recommendations",
        json=VALID_REQUEST,
        headers={
            "X-Internal-Api-Key": "wrong-secret",
            "Authorization": "Bearer test-token",
        },
    )

    assert response.status_code == 401


def test_recommendations_rejects_missing_bearer(client, api_secret):
    response = client.post(
        "/recommendations",
        json=VALID_REQUEST,
        headers={"X-Internal-Api-Key": api_secret},
    )

    assert response.status_code == 401


def test_recommendations_rejects_only_bearer(client, api_secret):
    response = client.post(
        "/recommendations",
        json=VALID_REQUEST,
        headers={"Authorization": "Bearer test-token"},
    )

    assert response.status_code == 401


def test_health_stays_public(client):
    response = client.get("/health")

    assert response.status_code == 200
