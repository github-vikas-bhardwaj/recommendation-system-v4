import secrets

from fastapi import HTTPException, status

from config.settings import settings

INTERNAL_API_KEY_HEADER = "X-Internal-Api-Key"


def verify_internal_api_key(api_key: str | None) -> None:
    if not settings.api_internal_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API internal secret is not configured",
        )

    if api_key is None or not secrets.compare_digest(
        api_key, settings.api_internal_secret
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal API key",
        )
