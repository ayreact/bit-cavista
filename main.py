from fastapi import FastAPI
from routers import readingsRouter, sessionRouter

app = FastAPI()
app.include_router(readingsRouter.reading_router)
app.include_router(sessionRouter.session_router)