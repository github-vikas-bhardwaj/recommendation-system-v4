from pgvector.psycopg import register_vector_async
from psycopg import AsyncConnection
from psycopg_pool import AsyncConnectionPool

from config.settings import settings

pool: AsyncConnectionPool | None = None


async def _configure(conn: AsyncConnection) -> None:
    # vector lives in schema "extensions" (see supabase migration)
    await conn.execute("SET search_path TO public, extensions")
    # Fail hung queries instead of occupying a pool slot forever
    await conn.execute("SET statement_timeout TO '15000'")
    await register_vector_async(conn)


async def open_pool() -> AsyncConnectionPool:
    global pool
    if not settings.database_url:
        raise RuntimeError("DATABASE_URL is not set")
    pool = AsyncConnectionPool(
        conninfo=settings.database_url,
        min_size=1,
        max_size=5,
        # How long a request waits for a free connection
        timeout=10.0,
        open=False,
        # Transaction poolers (Supabase :6543) break prepared statements.
        kwargs={
            "autocommit": True,
            "prepare_threshold": None,
        },
        configure=_configure,
    )
    await pool.open()
    return pool


async def close_pool() -> None:
    global pool
    if pool is not None:
        await pool.close()
        pool = None
