from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

from schemas.env.env import Env

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    env: Env = Env.LOCAL
    langsmith_api_key: str = ""
    langsmith_project: str = ""

    @property
    def is_local(self) -> bool:
        return self.env == Env.LOCAL

    @property
    def is_production(self) -> bool:
        return self.env == Env.PRODUCTION


settings = Settings()
