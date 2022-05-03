import { Component } from "react";
import ErrorScreen from "./ErrorScreen";
import PropTypes from "prop-types";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    console.log(error);
    return { error };
  }

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error && !fallback) return <ErrorScreen error={error} />;
    if (error) return fallback(error);
    return children;
  }
}

ErrorBoundary.propTypes = {
  error: PropTypes.object,
  children: PropTypes.object,
  fallback: PropTypes.func,
};
