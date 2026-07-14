from typing import Annotated

from fastapi import Header

from auth.internal import verify_internal_api_key
from auth.jwt import verify_bearer_token


def require_authenticated_bff(
    x_internal_api_key: Annotated[
        str | None,
        Header(alias="X-Internal-Api-Key"),
    ] = None,
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    verify_internal_api_key(x_internal_api_key)
    return verify_bearer_token(authorization)
