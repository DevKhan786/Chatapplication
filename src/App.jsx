import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Chatapp from "./pages/Chatapp";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-cfg"; // Import Firebase auth

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Use Firebase's onAuthStateChanged for real-time auth status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
      localStorage.setItem("isAuth", !!user ? "true" : "false");
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login isAuth={isAuth} setIsAuth={setIsAuth} />}
          />
          <Route
            path="/chatapp"
            element={<Chatapp isAuth={isAuth} setIsAuth={setIsAuth} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
