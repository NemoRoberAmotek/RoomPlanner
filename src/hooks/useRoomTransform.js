import { useAction } from "../contexts/ActionProvider";

const useRoomTransform = (
  scale,
  rotate,
  setScale,
  setRotate,
  translate,
  setTranslate
) => {
  const { setAction } = useAction();

  const rotateRoomLeft = () => {
    if (rotate > 0) {
      const newRotate = rotate - 90;
      setRotate(newRotate);
    }
  };

  const rotateRoomRight = () => {
    if (rotate < 360) {
      const newRotate = rotate + 90;
      setRotate(newRotate);
    }
  };

  const zoomRoomIn = () => {
    const newScale = scale + 0.2;
    setScale(newScale);
  };

  const zoomRoomOut = () => {
    if (scale >= 0.4) {
      const newScale = scale - 0.2;
      setScale(newScale);
    } else {
      setScale(0.2);
    }
  };

  const translateX = (delta) => {
    const originalX = translate.x;
    setTranslate({ ...translate, x: originalX + delta });
  };

  const translateY = (delta) => {
    const originalY = translate.y;
    setTranslate({ ...translate, y: originalY + delta });
  };

  const clearTranslate = () => {
    setTranslate({ x: 0, y: 0 });
  };

  const clearAll = () => {
    setScale(1);
    setRotate(0);
    setTranslate({ x: 0, y: 0 });
    setAction({
      title: "Room view reset",
      message: `Room view was reset to its original values.`,
    });
  };

  return [
    rotateRoomLeft,
    rotateRoomRight,
    zoomRoomIn,
    zoomRoomOut,
    translateX,
    translateY,
    clearTranslate,
    clearAll,
  ];
};

export default useRoomTransform;
