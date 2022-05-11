import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const IconLink = ({
  name,
  icon,
  action,
  classNames = "color-primary",
  style = {},
}) => {
  return (
    <div
      className={`${classNames} icon-link`}
      onClick={(e) => action(e)}
      onKeyPress={(e) => action(e)}
      role="button"
      tabIndex="0"
      style={style}
    >
      <Icon icon={icon} height="16" />
      <span>{name}</span>
    </div>
  );
};

export default IconLink;

IconLink.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  classNames: PropTypes.string,
  style: PropTypes.object,
};
