def test_recommendations_valid_body(client):
    response = client.post(
        "/recommendations",
        json={"userId": 1, "showIds": ["show-101", "show-202"]},
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Recommendations"}


def test_recommendations_rejects_extra_field(client):
    response = client.post(
        "/recommendations",
        json={"userId": 1, "showIds": [], "hack": True},
    )

    assert response.status_code == 422


def test_recommendations_rejects_invalid_type(client):
    response = client.post(
        "/recommendations",
        json={"userId": "not-a-number", "showIds": []},
    )

    assert response.status_code == 422
