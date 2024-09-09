import "./Login.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {login} from "../../redux/slices/userAuthSlice.js"

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleLogin = ()=>{
    window.open("http://localhost:5000/auth/google/callback","_self")
}

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login(username, password))
      .then((action) => {
        if (action.success) {
          console.log("Navigating to /uafterlogin with state:", {
            id: action.user.id,
            name: action.user.username,
            _email: action.user.email,
            _address: action.user.address,
          });
        }

        if (action.success) {
          console.log("User is authenticated:", action.user);
          console.log(location.state);

          navigate("/uafterlogin", {
            state: {
              id: action.user.id,
              name: action.user.username,
              _email: action.user.email,
              _address: action.user.address,
            },
          });
        }
      })
      .catch((err) => {
        console.log("Login failed, staying on the login page", err);
      });
  };

  return (
    <div className="login_container">
      <div className="heading">Welcome Back</div>
      <div className="form_container">
        <div className="left">
          <img className="img" src="/google.png" alt="Login Illustration" />
        </div>
        <div className="right">
          <div className="from_heading">Login</div>
          <img className="img" src="/signup.jpg" alt="Profile" />

          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn">Sign In</button>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </form>

          <button onClick={googleLogin} className="google_btn">
            <img src="/google.png" alt="Google Icon" className="google_icon" />
            Sign in with Google
          </button>
          <p className="text">
            Dont have an account? <a href="/s">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;