import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Chatapp from "./pages/Chatapp";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-cfg";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
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
