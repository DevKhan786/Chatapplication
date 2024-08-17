import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase-cfg";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function Chat({ room }) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserId = auth.currentUser?.uid;
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    if (!room) return;

    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        userId: currentUserId,
        room,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="chat-app">
      <div className="message-list">
        {messages.map((message) => (
          <div
            className={`message ${
              message.user === "System" && message.text.includes("has joined")
                ? "user-joined"
                : message.userId === currentUserId
                ? "self"
                : "other"
            }`}
            key={message.id}
          >
            <span className="message-user">{message.user}</span>
            <p className="message-text">{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          className="message-input"
          placeholder="Enter Message"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}
