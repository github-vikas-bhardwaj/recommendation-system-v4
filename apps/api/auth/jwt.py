import jwt
from fastapi import HTTPException, status
from jwt import PyJWKClient

from config.settings import settings

BEARER_SCHEME = "Bearer"
JWT_ALGORITHM = "ES256"
JWT_AUDIENCE = "authenticated"


def _supabase_auth_base_url() -> str:
    if not settings.supabase_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase auth URL is not configured",
        )
    return f"{settings.supabase_url.rstrip('/')}/auth/v1"


def verify_bearer_token(authorization: str | None) -> str:
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authorization header",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme != BEARER_SCHEME or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authorization header",
        )

    issuer = _supabase_auth_base_url()
    jwks_url = f"{issuer}/.well-known/jwks.json"

    try:
        signing_key = PyJWKClient(jwks_url).get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=[JWT_ALGORITHM],
            issuer=issuer,
            audience=JWT_AUDIENCE,
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authorization token",
        ) from None

    sub = payload.get("sub")
    if not isinstance(sub, str) or not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authorization token",
        )

    return sub
