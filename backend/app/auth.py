from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "supersecretkey"  # later we move to env
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"])

# Hash password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password
def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

# Create JWT token
def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=10)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
