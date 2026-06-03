import os
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

def test_connection():
    # Load environment variables
    load_dotenv()
    
    # Get DATABASE_URL
    database_url = os.environ.get("DATABASE_URL")
    
    if not database_url:
        print("❌ Database Connection Failed: DATABASE_URL not found in .env file.")
        sys.exit(1)
        
    try:
        # Create an engine to test connection
        engine = create_engine(database_url)
        with engine.connect() as connection:
            # Try a simple query
            connection.execute(text("SELECT 1"))
            
        print("✅ Database Connected Successfully")
        print(f"Host: {engine.url.host}")
        
    except SQLAlchemyError as e:
        print(f"❌ Database Connection Failed\nError details: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    test_connection()
