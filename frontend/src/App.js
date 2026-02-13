import React, { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";

function App() {
  const [room, setRoom] = useState("general");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [ws, setWs] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Notification permission
  useEffect(() => {
    if ("Notification" in window) Notification.requestPermission();
  }, []);

  // Browser notifications for new messages
  useEffect(() => {
    if (
      chat.length > 0 &&
      document.hidden &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("New Message", { body: chat[chat.length - 1] });
    }
  }, [chat]);

  // Connect to WebSocket & load history
  const connect = () => {
    if (!username.trim()) return alert("Enter username");

    fetch(`http://127.0.0.1:8000/messages?room=${room}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(
          m => `${m.timestamp} | ${m.username}: ${m.content}`
        );
        setChat(formatted);
      });

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${room}/${username}`);
    socket.onmessage = event => setChat(prev => [...prev, event.data]);
    setWs(socket);
  };

  const sendMessage = () => {
    if (!message.trim() || !ws) return;
    ws.send(message);
    setMessage("");
    setShowEmoji(false);
  };

  const sendFile = () => {
    if (!file || !ws) return;
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:8000/upload", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        ws.send(`Sent a file: ${data.filename} - ${data.url}`);
        setFile(null);
      })
      .catch(err => console.log(err));
  };

  const onEmojiClick = emojiData => setMessage(prev => prev + emojiData.emoji);

  return (
    <div style={{
      padding: "40px",
      maxWidth: "600px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #f6d365, #fda085)",
      minHeight: "100vh",
      color: "#333"
    }}>
      <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}>🌟 Real-Time Chat 🌟</h2>

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", marginRight: "10px", border: "none" }}
        />
        <input
          placeholder="Room"
          value={room}
          onChange={e => setRoom(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", marginRight: "10px", border: "none" }}
        />
        <button
          onClick={connect}
          style={{ padding: "8px 15px", borderRadius: "5px", border: "none", background: "#4caf50", color: "white", cursor: "pointer" }}
        >
          Join
        </button>
      </div>

      <div style={{
        height: "300px",
        overflow: "auto",
        borderRadius: "10px",
        border: "2px solid #fff",
        padding: "10px",
        marginBottom: "10px",
        background: "rgba(255,255,255,0.8)"
      }}>
        {chat.map((msg, i) => {
          const [time, userMsg] = msg.split(" | ");
          return (
            <div key={i} style={{ marginBottom: "5px" }}>
              <small style={{ color: "#555" }}>{time}</small> <b>{userMsg}</b>
            </div>
          );
        })}
        <div ref={chatEndRef}></div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          value={message}
          placeholder="Type a message..."
          onChange={e => setMessage(e.target.value)}
          style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "none" }}
        />
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          style={{ padding: "8px", borderRadius: "5px", border: "none", background: "#ff9800", color: "white", cursor: "pointer" }}
        >
          😀
        </button>
        <button
          onClick={sendMessage}
          style={{ padding: "8px 12px", borderRadius: "5px", border: "none", background: "#2196f3", color: "white", cursor: "pointer" }}
        >
          Send
        </button>
      </div>

      {showEmoji && <div style={{ marginTop: "10px" }}><Picker onEmojiClick={onEmojiClick} /></div>}

      <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button
          onClick={sendFile}
          style={{ padding: "6px 10px", borderRadius: "5px", border: "none", background: "#9c27b0", color: "white", cursor: "pointer" }}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default App;