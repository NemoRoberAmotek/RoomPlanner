import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/base.css";
import AuthProvider from "./contexts/AuthProvider";
import GlobalSettingsProvider from "./contexts/GlobalSettingsProvider";
import MessageProvider from "./contexts/MessageProvider";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <MessageProvider>
      <GlobalSettingsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GlobalSettingsProvider>
    </MessageProvider>
  </Router>
);
