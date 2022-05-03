import PropTypes from "prop-types";

const SidebarHeader = ({ render = (f) => f }) => {
  return <div className="sidebar-header">{render()}</div>;
};

export default SidebarHeader;

SidebarHeader.propTypes = {
  render: PropTypes.func.isRequired,
};
