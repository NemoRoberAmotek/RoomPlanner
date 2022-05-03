import PropTypes from "prop-types";
import { useView } from "../../contexts/ViewProvider";
import { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../Constants";

const FurnitureItem = ({ furniture }) => {
  const { setSelectedFurniture } = useView();
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

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.FURNITURE,
      item: furniture,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [furniture]
  );

  return (
    <div
      style={{
        width: furniture.x,
        height: furniture.y,
        transform: `translate(${furniture.position.posX}px, ${furniture.position.posY}px)`,
        opacity: isDragging ? 0.3 : 1,
      }}
      id={`furniture-in-view-${furniture.placement_id}`}
      ref={drag}
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
