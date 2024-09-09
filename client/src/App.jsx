import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";


import "./App.css";

import Signup from "./pages/Signup/Singup.jsx";
import Home from "./pages/home/Home";


function App() {

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="633790086752-75e4bnbj542qth24d10q8prq1gtmqhb5.apps.googleusercontent.com">
        <Home />
      </GoogleOAuthProvider>
    );
  };

  return (
    <>
    
      <div className="content">

          <Router>
            <Routes>
              <Route path="/" element={<GoogleAuthWrapper />} />
              <Route path="/a" element={<Signup />} />
            </Routes>
          </Router>
        </div>
    </>
  );
}

export default App;