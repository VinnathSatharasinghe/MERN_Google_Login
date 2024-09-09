import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "../../redux/slices/userAuthSlice"

const store = configureStore({
  reducer: {
    userauth: userAuthReducer,
  },
});

export default store;
