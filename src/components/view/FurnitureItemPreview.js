import PropTypes from "prop-types";
import { useRoom } from "../../contexts/RoomProvider";

const FurnitureItemPreview = ({ furniture }) => {
  const { scale } = useRoom();

  return (
    <div
      style={{
        width: furniture.x * scale,
        height: furniture.y * scale,
      }}
      id={`furniture-in-view-${furniture.placement_id}`}
      className={`furniture-in-view selected`}
      role="button"
      tabIndex="0"
    >
      <small>{furniture.name}</small>
    </div>
  );
};

FurnitureItemPreview.propTypes = {
  furniture: PropTypes.object.isRequired,
};

export default FurnitureItemPreview;
