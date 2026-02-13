from fastapi import WebSocket, Query, File, UploadFile, Depends, HTTPException
from datetime import datetime
from .message_models import Message
from .websocket_manager import manager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os

from .database import engine, Base, get_db
from .models import User
from .auth import hash_password, verify_password, create_token

app = FastAPI()

# -----------------------
# CREATE TABLES
# -----------------------
Base.metadata.create_all(bind=engine)

# -----------------------
# CORS
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# TEST ROUTE
# -----------------------
@app.get("/")
def read_root():
    return {"message": "Backend running with DB!"}

# -----------------------
# REGISTER
# -----------------------
@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.username == username).first()
    if existing:
        raise HTTPException(400, "User already exists")

    hashed = hash_password(password)
    user = User(username=username, password=hashed)

    db.add(user)
    db.commit()

    return {"message": "User created"}

# -----------------------
# LOGIN
# -----------------------
@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == username).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({"sub": username})

    return {"token": token}

# -----------------------
# GET MESSAGES BY ROOM
# -----------------------
@app.get("/messages")
def get_messages(room: str = Query(...), db: Session = Depends(get_db)):
    msgs = db.query(Message).filter(Message.room == room).all()
    return [
        {"username": m.username, "content": m.content, "timestamp": m.timestamp}
        for m in msgs
    ]

# -----------------------
# WEBSOCKET CHAT
# -----------------------
@app.websocket("/ws/{room}/{username}")
async def websocket_chat(websocket: WebSocket, room: str, username: str):

    await manager.connect(websocket, room)

    db = next(get_db())

    try:
        while True:
            data = await websocket.receive_text()

            timestamp = datetime.now().strftime("%H:%M")

            # Save message
            msg = Message(
                room=room,
                username=username,
                content=data,
                timestamp=timestamp
            )

            db.add(msg)
            db.commit()

            formatted = f"{timestamp} | {username}: {data}"

            await manager.broadcast(formatted, room)

    except:
        manager.disconnect(websocket, room)

# -----------------------
# FILE UPLOAD ROUTE
# -----------------------
UPLOAD_DIR = "./app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "url": f"/uploads/{file.filename}"}