import PropTypes from "prop-types";
import { useRoom } from "../../contexts/RoomProvider";
import { useState, useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import useComputation from "../../hooks/useComputation";
import { ItemTypes } from "../../Constants";
import { Icon } from "@iconify/react";

const FurnitureItem = ({ furniture }) => {
  const [selected, setSelected] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const {
    room,
    rotate,
    rotateFurniture,
    selectedFurniture,
    setSelectedFurniture,
    removeFurniture,
    setFurnitureZIndex,
    duplicateFurniture,
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

  const onClick = (e) => {
    if (
      !e.target.classList.contains("furniture-control-btn") &&
      !e.target.closest(".furniture-control-btn")
    ) {
      setSelectedFurniture(furniture);
    }
  };

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
        if (
          e.propertyName !== "background-color" &&
          e.propertyName !== "box-shadow" &&
          e.propertyName !== "opacity"
        ) {
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
        opacity: isDragging && 0.3,
        transform: `rotate(${furniture.rotate}deg)`,
        backgroundColor: furniture.color,
        "--color-box-shadow": `${furniture.color}80`,
        zIndex: selected ? 10 : furniture.zIndex,
      }}
      id={`${furniture.placement_id}`}
      ref={selected ? drag : null}
      className={`furniture-in-view ${selected && "selected"}`}
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex="0"
    >
      <div className="furniture-inner">
        {showControls && <small>{furniture.name}</small>}
        {showControls && selected && (
          <div
            className={`furniture-item-controls__wrap ${
              width < 140 && height < 218 && "hidden"
            }`}
          >
            <div
              className={`furniture-item-controls ${width < 140 && "column"}`}
            >
              <>
                <div
                  className={`furniture-item-controls-group ${
                    width < 140 && "column"
                  }`}
                >
                  {furniture.length !== furniture.width && (
                    <button
                      className="button-icon primary furniture-control-btn"
                      onClick={() => rotateFurniture(furniture)}
                      style={{
                        borderColor: furniture.color,
                        color: furniture.color,
                      }}
                    >
                      <Icon
                        icon="fa6-solid:arrow-rotate-right"
                        color={furniture.color}
                        height="16"
                      />
                      <div className="tooltip">
                        <small>Rotate</small>
                      </div>
                    </button>
                  )}
                  <button
                    className="button-icon furniture-control-btn"
                    onClick={() => setFurnitureZIndex(furniture, "front")}
                    style={{
                      borderColor: furniture.color,
                      color: furniture.Color,
                    }}
                  >
                    <Icon
                      icon="fa6-solid:circle-arrow-up"
                      color={furniture.color}
                      height="16"
                    />
                    <div className="tooltip">
                      <small>To front</small>
                    </div>
                  </button>
                  <button
                    className="button-icon furniture-control-btn"
                    onClick={() => setFurnitureZIndex(furniture, "back")}
                    style={{
                      borderColor: furniture.color,
                      color: furniture.Color,
                    }}
                  >
                    <Icon
                      icon="fa6-solid:circle-arrow-down"
                      color={furniture.color}
                      height="16"
                    />
                    <div className="tooltip">
                      <small>To back</small>
                    </div>
                  </button>
                  <button
                    className="button-icon furniture-control-btn"
                    onClick={() => duplicateFurniture(furniture)}
                    style={{
                      borderColor: furniture.color,
                      color: furniture.Color,
                    }}
                  >
                    <Icon
                      icon="heroicons-solid:document-duplicate"
                      color={furniture.color}
                      height="16"
                    />
                    <div className="tooltip">
                      <small>Duplicate</small>
                    </div>
                  </button>
                </div>
                <button
                  className="button-icon danger furniture-control-btn"
                  onClick={() => removeFurniture(furniture)}
                >
                  <Icon
                    icon="ic:round-delete-forever"
                    height="16"
                    color="var(--color-danger)"
                  />
                  <div className="tooltip">
                    <small>Delete</small>
                  </div>
                </button>
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FurnitureItem.propTypes = {
  furniture: PropTypes.object.isRequired,
};

export default FurnitureItem;
