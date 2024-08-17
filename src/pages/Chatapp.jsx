import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-cfg";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Chat from "../components/Chat";
import { useNavigate } from "react-router-dom";

export default function Chatapp({ isAuth, setIsAuth }) {
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [roomValue, setRoomValue] = useState("");
  const [userJoined, setUserJoined] = useState(false);

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    if (room && !userJoined) {
      const handleUserJoined = async () => {
        try {
          await addDoc(messagesRef, {
            text: `${auth.currentUser.displayName} has joined the chat.`,
            createdAt: serverTimestamp(),
            user: "System",
            userId: null,
            room,
          });
          setUserJoined(true);
        } catch (error) {
          console.error("Error sending 'user has joined' message: ", error);
        }
      };

      handleUserJoined();
    }
  }, [room, userJoined]);

  const makeRoom = () => {
    if (roomValue.trim() !== "") {
      setRoom(roomValue);
    } else {
      alert("Please enter a room name!");
    }
  };

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
