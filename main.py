from fastapi import FastAPI
from routers import sessionRouter, readingRouter
from repository import database

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="CardioTwin API")
app.include_router(sessionRouter.session_router)
app.include_router(readingRouter.router)