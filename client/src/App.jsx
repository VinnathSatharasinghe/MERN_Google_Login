import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import GoogleLogin from "../Google/testpage.jsx";

import "./App.css";
// import StarsCanvas from "./animation/StarsCanvas";
import Signup from "./pages/Signup/Singup.jsx";
import Home from "./pages/home/Home";
// import Testlogin from "../src/pages/test/tlogin";
// import Testsing from "../src/pages/test/tsing";

function App() {

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="633790086752-nklc5qmasi9fdhmc1ipopf1aci8pg249.apps.googleusercontent.com">
        <Home />
      </GoogleOAuthProvider>
    );
  };

  return (
    <>
      {/* <StarsCanvas className="stars-canvas" /> */}
      <div className="content">
        {/* <div style={{ position: "relative", zIndex: 1 }}> */}
          <Router>
            <Routes>
              <Route path="/" element={<GoogleAuthWrapper />} />
              <Route path="/a" element={<Signup />} />
              {/* <Route path="/aa" element={<Testsing />} />
              <Route path="/tl" element={<Testlogin />} /> */}
            </Routes>
          </Router>
        </div>
      {/* </div> */}
    </>
  );
}

export default App;