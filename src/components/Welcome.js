import PropTypes from "prop-types";

const Welcome = ({ login }) => {
  return (
    <div className="welcome-screen">
      <h1 className="color-primary">Welcome!</h1>
      <p>Please log in to continue to the application</p>
      <div className="button-box">
        <button onClick={login} className="button-primary">
          Log in
        </button>
        <button onClick={login} className="button-default">
          Continue as guest
        </button>
      </div>
      <small>Please keep in mind that guests cannot save rooms.</small>
    </div>
  );
};

export default Welcome;

Welcome.propTypes = {
  login: PropTypes.func.isRequired,
};
