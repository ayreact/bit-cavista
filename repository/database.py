import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Use full DATABASE_URL from env, or construct from password if not provided
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    SUPABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
    if not SUPABASE_PASSWORD:
        raise ValueError("DATABASE_URL or DATABASE_PASSWORD environment variable must be set")
    DATABASE_URL = f"postgresql://postgres:{SUPABASE_PASSWORD}@db.cgmlwqgnaqszhqljzbid.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()