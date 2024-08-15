import React, { useState } from "react";
import { auth } from "../firebase-cfg";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Chat from "../components/Chat";

export default function Chatapp({ isAuth, setIsAuth }) {
  const [room, setRoom] = useState(null);
  const [roomValue, setRoomValue] = useState("");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuth(false);
      localStorage.setItem("isAuth", "false");
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const makeRoom = () => {
    if (roomValue.trim() !== "") {
      setRoom(roomValue);
    } else {
      alert("Please enter a room name!");
    }
  };

  return (
    <div className="container">
      {room ? <h1>Room: {roomValue}</h1> : <h1>Welcome to Chat Application</h1>}
      {room ? (
        <Chat room={room} />
      ) : (
        <div className="room-entry">
          <label>Enter Room Name:</label>
          <input
            type="text"
            value={roomValue}
            onChange={(e) => setRoomValue(e.target.value)}
          />
          <button onClick={makeRoom}>Enter Chat</button>
        </div>
      )}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
