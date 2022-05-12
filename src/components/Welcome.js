import { useState } from "react";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import { useAuth } from "../contexts/AuthProvider";

const Welcome = () => {
  const [loginActive, setLoginActive] = useState(true);
  const { loginGuest } = useAuth();

  return (
    <div className="welcome-screen">
      <h1 className="color-primary">Welcome!</h1>
      <p>Please log in to continue to the application</p>
      {loginActive ? <LoginForm /> : <RegisterForm />}
      <div className="button-box">
        {loginActive ? (
          <button
            onClick={() => setLoginActive(false)}
            className="button-secondary"
          >
            Create account
          </button>
        ) : (
          <button
            onClick={() => setLoginActive(true)}
            className="button-secondary"
          >
            Log in
          </button>
        )}

        <button onClick={loginGuest} className="button-default">
          Continue as guest
        </button>
      </div>
      <small>Please keep in mind that guests cannot save rooms.</small>
    </div>
  );
};

export default Welcome;
