import PropTypes from "prop-types";
import { useRoom } from "../../contexts/RoomProvider";
import { useState, useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import useComputation from "../../hooks/useComputation";
import { ItemTypes } from "../../Constants";

const FurnitureItem = ({ furniture }) => {
  const [selected, setSelected] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const {
    room,
    rotate,
    rotateFurniture,
    selectedFurniture,
    setSelectedFurniture,
  } = useRoom();

  const { dataToComputed } = useComputation(room, rotate);

  const { width, height, posX, posY } = dataToComputed(furniture);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.FURNITURE,
      item: furniture,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [furniture]
  );

  useEffect(() => {
    if (!selectedFurniture) return setSelected(false);

    if (selectedFurniture.placement_id === furniture.placement_id) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedFurniture, furniture]);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    document
      .getElementById(furniture.placement_id)
      .addEventListener("transitionstart", (e) => {
        if (e.propertyName !== "background-color") {
          setShowControls(false);
        }
      });
    document
      .getElementById(furniture.placement_id)
      .addEventListener("transitionend", () => setShowControls(true));
  }, [furniture]);

  return (
    <div
      style={{
        width: width,
        height: height,
        top: posY,
        left: posX,
        opacity: isDragging ? 0.3 : 1,
        transform: `rotate(${furniture.rotate}deg)`,
      }}
      id={`${furniture.placement_id}`}
      ref={selected ? drag : null}
      className={`furniture-in-view ${selected && "selected"}`}
      onClick={() => setSelectedFurniture(furniture)}
      onKeyPress={() => setSelectedFurniture(furniture)}
      role="button"
      tabIndex="0"
    >
      {showControls && <small>{furniture.name}</small>}
      {selected && showControls && furniture.length !== furniture.width && (
        <button className="" onClick={() => rotateFurniture(furniture)}>
          Rotate
        </button>
      )}
    </div>
  );
};

FurnitureItem.propTypes = {
  furniture: PropTypes.object.isRequired,
};

export default FurnitureItem;
