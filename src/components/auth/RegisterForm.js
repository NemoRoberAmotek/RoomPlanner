import useInput from "../../hooks/useInput";
import { useAuth } from "../../contexts/AuthProvider";
import { useState } from "react";
import PasswordField from "./PasswordField";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [nameProps, resetName] = useInput("");
  const [emailProps, resetEmail] = useInput("");
  const [passwordProps, resetPassword] = useInput("");
  const [passwordConfirmProps, resetPasswordConfirm] = useInput("");
  const [errors, setErrors] = useState([]);

  const { registerUser } = useAuth();

  const navigate = useNavigate();

  const submitRegister = async (e) => {
    e.preventDefault();
    if (passwordProps.value !== passwordConfirmProps.value) {
      return setErrors([{ msg: "Passwords don't match." }]);
    }
    const registerRes = await registerUser({
      name: nameProps.value,
      email: emailProps.value,
      password: passwordProps.value,
    });
    if (registerRes.errors) {
      return setErrors(registerRes.errors);
    }
    resetEmail();
    resetPassword();
    resetName();
    resetPasswordConfirm();
    navigate("/dashboard");
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
      <form onSubmit={submitRegister}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" {...nameProps} placeholder="Your name" />
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...emailProps}
            placeholder="Your email address"
          />
        </div>
        <PasswordField form="register" passwordProps={passwordProps} />
        <PasswordField
          name="confirm_password"
          form="register"
          passwordProps={passwordConfirmProps}
        />
        <div className="form-control">
          <button className="button-primary" type="submit">
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
