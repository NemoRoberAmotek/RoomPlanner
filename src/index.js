import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/base.css";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-6s2b6t09.eu.auth0.com"
    clientId="9Se4Wks1PEB9DV8a1x1sCYamp8kUJt5P"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>
);
