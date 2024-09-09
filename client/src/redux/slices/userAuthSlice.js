import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  token: localStorage.getItem("token"),
  tokenExpiration: localStorage.getItem("tokenExpiration"),
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: "userauth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.tokenExpiration = action.payload.expiresAt;
      state.test = action.payload.test;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Store the values in local storage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("tokenExpiration", action.payload.expiresAt);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.token = null;
      state.tokenExpiration = null;
      state.test = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:5000/api/login", {
      username,
      password,
    });

    const result = response.data;

    if (result.message === "loginok") {
      const { token, expiresAt, expiresAt12HourFormat, test, ...user } = result;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expiresAt);
      localStorage.setItem("time", expiresAt12HourFormat);
      sessionStorage.setItem("test", test);

      dispatch(
        loginSuccess({ token, expiresAt, expiresAt12HourFormat, test, user })
      );

      toast.success("Login successful!");

      // Return a resolved promise to indicate success
      return Promise.resolve({ success: true, user });
    } else {
      let errorMsg = "Login Failed. No record existed.";
      if (result.message === "nousername") errorMsg = "Login Failed. No user.";
      else if (result.message === "caseusername")
        errorMsg = "Login Failed. No user existed.";
      else if (result.message === "nopassword")
        errorMsg = "Login Failed. No Password";
      else if (result.message === "casepassword")
        errorMsg = "Login Failed. Incorrect Password";

      toast.error(errorMsg);

      // Return a rejected promise to indicate failure
      return Promise.reject({ success: false });
    }
  } catch (err) {
    console.error(err);
    toast.error("Login Failed due to a server error.");

    // Return a rejected promise to indicate a server error
    return Promise.reject({ success: false, error: err });
  }
};

export default authSlice.reducer;