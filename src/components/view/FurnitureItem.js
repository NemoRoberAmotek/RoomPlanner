import PropTypes from "prop-types";
import { useRoom } from "../../contexts/RoomProvider";
import { useState, useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../Constants";

const FurnitureItem = ({ furniture }) => {
  const { scale, setSelectedFurniture } = useRoom();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelectedFurniture(furniture);
  }, [furniture, setSelectedFurniture, selected]);

  useEffect(() => {
    const item = document.getElementById(
      `furniture-in-view-${furniture.placement_id}`
    );
    item.addEventListener("focusout", () => setSelected(false));

    return () => item.removeEventListener("focusout", () => setSelected(false));
  }, [furniture]);

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
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      style={{
        width: furniture.x * scale,
        height: furniture.y * scale,
        transform: `translate(${furniture.position.posX * scale}px, ${
          furniture.position.posY * scale
        }px)`,
        opacity: isDragging ? 0.3 : 1,
      }}
      id={`furniture-in-view-${furniture.placement_id}`}
      ref={selected ? drag : null}
      className={`furniture-in-view ${selected && "selected"}`}
      onClick={() => setSelected(true)}
      onKeyPress={() => setSelected(true)}
      role="button"
      tabIndex="0"
    >
      <small>{furniture.name}</small>
    </div>
  );
};

FurnitureItem.propTypes = {
  furniture: PropTypes.object.isRequired,
};

export default FurnitureItem;
