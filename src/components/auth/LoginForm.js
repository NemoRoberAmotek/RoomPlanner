import useInput from "../../hooks/useInput";
import { useAuth } from "../../contexts/AuthProvider";
import { useState } from "react";
import PasswordField from "./PasswordField";

const LoginForm = () => {
  const [emailProps, resetEmail] = useInput("");
  const [passwordProps, resetPassword] = useInput("");
  const [errors, setErrors] = useState([]);

  const { loginUser } = useAuth();

  const submitLogin = async (e) => {
    e.preventDefault();
    const loginRes = await loginUser({
      email: emailProps.value,
      password: passwordProps.value,
    });

    if (loginRes.errors) {
      return setErrors(loginRes.errors);
    }
    resetEmail();
    resetPassword();
  };

  return (
    <>
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, i) => (
            <span key={i}>{error.msg}</span>
          ))}
        </div>
      )}
      <form onSubmit={submitLogin}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...emailProps}
            placeholder="Your email address"
          />
        </div>
        <PasswordField passwordProps={passwordProps} />
        <div className="form-control">
          <button className="button-primary" type="submit">
            Log in
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
