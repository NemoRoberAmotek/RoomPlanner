import PropTypes from "prop-types";
import { useRoom } from "../../contexts/RoomProvider";
import useComputation from "../../hooks/useComputation";
import getTextures from "../../helpers/getTextures";

const FurnitureItemPreview = ({ furniture }) => {
  const { room } = useRoom();
  const { dataToComputed } = useComputation(room);
  const { width, height } = dataToComputed(furniture);
  const { textures } = getTextures();

  return (
    <div
      style={{
        width: width,
        height: height,
        transform: `rotate(${furniture.rotate}deg)`,
        backgroundColor: furniture.color,
        backgroundImage: `url(${textures[furniture.texture]})`,
        backgroundSize: `${width / 5}px`,
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
