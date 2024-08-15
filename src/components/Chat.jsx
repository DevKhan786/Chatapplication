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
  const currentUserId = auth.currentUser?.uid;  // Ensure auth might not be ready yet

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    if (!room) return; // Ensure room exists

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

    if (!newMessage.trim()) return; // Prevent empty message submission
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
              message.userId === currentUserId ? "self" : "other"
            }`}
            key={message.id}
          >
            <span className="message-user">{message.user}</span>
            <h1 className="message-text">{message.text}</h1>
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
