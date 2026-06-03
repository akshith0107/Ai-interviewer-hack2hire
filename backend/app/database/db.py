import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("WARNING: DATABASE_URL is not set in the environment variables.")
    # Do not raise an exception here so that FastAPI can still start and display the error cleanly during the verification step.
    DATABASE_URL = ""

if DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )
else:
    engine = None

def verify_db_connection():
    if not engine:
        print("❌ Database Connection Failed: DATABASE_URL not set.")
        return
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✅ Database Connected Successfully")
    except Exception as e:
        print(f"❌ Database Connection Failed: {str(e)}")
