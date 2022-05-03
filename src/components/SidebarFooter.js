import PropTypes from "prop-types";

const SidebarFooter = ({ render = (f) => f }) => {
  return <div className="sidebar-footer">{render()}</div>;
};

SidebarFooter.propTypes = {
  render: PropTypes.func.isRequired,
};

export default SidebarFooter;
