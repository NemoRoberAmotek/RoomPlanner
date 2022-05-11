import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";

const Welcome = ({ guestLogin }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="welcome-screen">
      <h1 className="color-primary">Welcome!</h1>
      <p>Please log in to continue to the application</p>
      <div className="button-box">
        <button onClick={() => loginWithRedirect()} className="button-primary">
          Log in
        </button>
        <button onClick={guestLogin} className="button-default">
          Continue as guest
        </button>
      </div>
      <small>Please keep in mind that guests cannot save rooms.</small>
    </div>
  );
};

Welcome.propTypes = {
  guestLogin: PropTypes.func.isRequired,
};

export default Welcome;
