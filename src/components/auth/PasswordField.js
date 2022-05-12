import { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const PasswordField = ({
  passwordProps,
  name = "password",
  form = "login",
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="form-control">
      <label htmlFor={name}>Password</label>
      <div className="input-with-icon">
        <input
          id={name}
          type={passwordVisible ? "test" : "password"}
          {...passwordProps}
          placeholder={
            name === "password"
              ? form === "login"
                ? "Your password"
                : "Choose your password"
              : "Confirm your password"
          }
        />
        <div
          className="input-icon-button"
          role="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          onKeyPress={() => setPasswordVisible(!passwordVisible)}
          tabIndex="0"
        >
          <Icon
            icon={passwordVisible ? "fa6-regular:eye" : "fa6-regular:eye-slash"}
            color={
              passwordVisible ? "var(--color-primary)" : "var(--color-default)"
            }
            height="14"
          />
        </div>
      </div>
    </div>
  );
};

PasswordField.propTypes = {
  passwordProps: PropTypes.object.isRequired,
  name: PropTypes.string,
  form: PropTypes.string,
};

export default PasswordField;
