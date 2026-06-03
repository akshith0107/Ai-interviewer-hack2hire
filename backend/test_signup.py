from app.database.session import SessionLocal
from app.routers.auth import signup
from app.schemas.auth import UserSignup

db = SessionLocal()
try:
    user_in = UserSignup(email="test4@example.com", password="password123", full_name="Test4")
    result = signup(user_in=user_in, db=db)
    print("Success:", result)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
