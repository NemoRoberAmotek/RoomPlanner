import PropTypes from "prop-types";
import { useRoom } from "../../contexts/RoomProvider";
import useComputeItemSizeAndPosition from "../../hooks/useComputeItemSizeAndPosition";

const FurnitureItemPreview = ({ furniture }) => {
  const { room } = useRoom();
  const { dataToComputed } = useComputeItemSizeAndPosition(room);
  const { width, height } = dataToComputed(furniture);

  return (
    <div
      style={{
        width: width,
        height: height,
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
