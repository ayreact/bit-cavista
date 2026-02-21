from fastapi import FastAPI
from routers import readingsRouter, sessionRouter
from repository import database


database.Base.metadata.create_all(bind=database.engine)


app = FastAPI()
app.include_router(readingsRouter.reading_router)
app.include_router(sessionRouter.session_router)