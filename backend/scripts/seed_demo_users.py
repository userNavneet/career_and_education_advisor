from datetime import datetime

from database.db import get_db
from utils.password import hash_password


USERS = [
    {
        "email": "student@example.com",
        "password": "student123",
        "role": "student",
        "full_name": "Student Demo",
    },
    {
        "email": "counselor@example.com",
        "password": "counselor123",
        "role": "counselor",
        "full_name": "Counselor Demo",
    },
    {
        "email": "admin@example.com",
        "password": "admin123",
        "role": "admin",
        "full_name": "Admin Demo",
    },
]


def main():
    db = get_db()
    now = datetime.utcnow()
    for user in USERS:
        if db.users.find_one({"email": user["email"]}):
            continue
        db.users.insert_one(
            {
                "email": user["email"],
                "password_hash": hash_password(user["password"]),
                "role": user["role"],
                "full_name": user["full_name"],
                "is_active": True,
                "created_at": now,
                "updated_at": now,
            }
        )
    print("Seeded demo users")


if __name__ == "__main__":
    main()
