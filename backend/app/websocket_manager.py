from fastapi import WebSocket

class ConnectionManager:

    def __init__(self):
        self.rooms = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()

        if room not in self.rooms:
            self.rooms[room] = []

        self.rooms[room].append(websocket)

    def disconnect(self, websocket: WebSocket, room: str):
        self.rooms[room].remove(websocket)

    async def broadcast(self, message: str, room: str):
        for connection in self.rooms[room]:
            await connection.send_text(message)


manager = ConnectionManager()