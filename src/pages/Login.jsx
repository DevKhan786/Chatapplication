import React from "react";
import { auth, provider } from "../firebase-cfg";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

export default function Login({ isAuth, setIsAuth }) {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
      localStorage.setItem("isAuth", "true");
      navigate("/chatapp");
    } catch (error) {
      console.error("Sign-in error: ", error);
    }
  };

  return (
    <div className="container">
      <h1>Chat Application</h1>
      {!isAuth ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <button onClick={() => navigate("/chatapp")}>Enter Chat</button>
      )}
    </div>
  );
}
