import App from './App.jsx'
import './index.css'

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store/Reduxstore.js";


ReactDOM.createRoot(document.getElementById("root")).render(

  <Provider store={store}>
    <App />
  </Provider>
);