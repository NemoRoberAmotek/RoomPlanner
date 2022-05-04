const useRotateAndZoom = (scale, rotate, setScale, setRotate) => {
  const rotateRoomLeft = () => {
    if (rotate > 0) {
      setRotate(rotate - 90);
    }
  };

  const rotateRoomRight = () => {
    if (rotate < 360) {
      setRotate(rotate + 90);
    }
  };

  const zoomRoomIn = () => {
    setScale(scale + 0.2);
  };

  const zoomRoomOut = () => {
    if (scale > 0) {
      setScale(scale - 0.2);
    }
  };

  return [rotateRoomLeft, rotateRoomRight, zoomRoomIn, zoomRoomOut];
};

export default useRotateAndZoom;
