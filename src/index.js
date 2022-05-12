import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/base.css";
import AuthProvider from "./contexts/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
