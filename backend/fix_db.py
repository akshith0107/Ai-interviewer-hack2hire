from app.database.session import engine
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text("UPDATE users SET email = id || '@dummy.com' WHERE email IS NULL"))
    conn.commit()
    print("Fixed null emails")
