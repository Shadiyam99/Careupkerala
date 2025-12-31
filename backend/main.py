from fastapi import FastAPI
from contextlib import asynccontextmanager
import uvicorn
from middleware.db import init_db
from auth.routers import router as auth_router
from apps.users.routers import router as users_router
from apps.companions.routers import router as companions_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    init_db()
    yield
    # Shutdown: Clean up if needed
    pass

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(companions_router)

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)