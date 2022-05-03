import PropTypes from "prop-types";

const ErrorScreen = ({ error }) => {
  return (
    <div className="error">
      <h3>We are sorry. Something went wrong.</h3>
      <p>We cannot process your request at this moment.</p>
      {error.message && <p>Error: {error.message}</p>}
    </div>
  );
};

export default ErrorScreen;

ErrorScreen.propTypes = {
  error: PropTypes.object.isRequired,
};
