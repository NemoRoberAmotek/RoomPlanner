import { useAction } from "../contexts/ActionProvider";
import { useCallback } from "react";

const useRoomTransform = (
  scale,
  rotate,
  setScale,
  setRotate,
  translate,
  setTranslate
) => {
  const { setAction } = useAction();

  const rotateRoomLeft = useCallback(() => {
    setRotate((rotate) => {
      if (rotate > 0) {
        return rotate - 90;
      } else {
        return rotate;
      }
    });
  }, [setRotate]);

  const rotateRoomRight = useCallback(() => {
    setRotate((rotate) => {
      if (rotate < 360) {
        return rotate + 90;
      } else {
        return rotate;
      }
    });
  }, [setRotate]);

  const zoomRoomIn = useCallback(
    (delta = 0.2) => {
      setScale((scale) => scale + delta);
    },
    [setScale]
  );

  const zoomRoomOut = useCallback(
    (delta = 0.2) => {
      setScale((scale) => {
        if (scale >= 0.4) {
          return scale - delta;
        } else {
          return 0.2;
        }
      });
    },
    [setScale]
  );

  const translateX = useCallback(
    (delta) => {
      setTranslate((translate) => ({ ...translate, x: translate.x + delta }));
    },
    [setTranslate]
  );

  const translateY = useCallback(
    (delta) => {
      setTranslate((translate) => ({ ...translate, y: translate.y + delta }));
    },
    [setTranslate]
  );

  const clearTranslate = useCallback(() => {
    setTranslate({ x: 0, y: 0 });
  }, [setTranslate]);

  const clearAll = useCallback(() => {
    setScale(1);
    setRotate(0);
    setTranslate({ x: 0, y: 0 });
    setAction({
      title: "Room view reset",
      message: `Room view was reset to its original values.`,
    });
  }, [setScale, setRotate, setTranslate, setAction]);

  const runProperTranslate = useCallback(
    (delta, dir) => {
      setRotate((rotate) => {
        if (dir === "right") {
          if (rotate === 90) {
            translateY(delta);
          } else if (rotate === 180) {
            translateX(delta);
          } else if (rotate === 270) {
            translateY(-delta);
          } else {
            translateX(-delta);
          }
        } else if (dir === "left") {
          if (rotate === 90) {
            translateY(-delta);
          } else if (rotate === 180) {
            translateX(-delta);
          } else if (rotate === 270) {
            translateY(delta);
          } else {
            translateX(delta);
          }
        } else if (dir === "up") {
          if (rotate === 90) {
            translateX(delta);
          } else if (rotate === 180) {
            translateY(-delta);
          } else if (rotate === 270) {
            translateX(-delta);
          } else {
            translateY(delta);
          }
        } else if (dir === "down") {
          if (rotate === 90) {
            translateX(-delta);
          } else if (rotate === 180) {
            translateY(delta);
          } else if (rotate === 270) {
            translateX(delta);
          } else {
            translateY(-delta);
          }
        }
        return rotate;
      });
    },
    [setRotate, translateX, translateY]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight" && !e.ctrlKey && !e.shiftKey) {
        runProperTranslate(25, "right");
      } else if (e.key === "ArrowLeft" && !e.ctrlKey && !e.shiftKey) {
        runProperTranslate(25, "left");
      } else if (e.key === "ArrowUp" && !e.ctrlKey && !e.shiftKey) {
        runProperTranslate(25, "up");
      } else if (e.key === "ArrowDown" && !e.ctrlKey && !e.shiftKey) {
        runProperTranslate(25, "down");
      } else if (e.key === "+" && !e.ctrlKey && !e.shiftKey) {
        zoomRoomIn(0.05);
      } else if (e.key === "-" && !e.ctrlKey && !e.shiftKey) {
        zoomRoomOut(0.05);
      } else if (e.code === "KeyQ" && !e.ctrlKey && !e.shiftKey) {
        rotateRoomLeft();
      } else if (e.key === "r" && !e.ctrlKey && !e.shiftKey) {
        rotateRoomRight();
      } else if (e.key === "c" && !e.ctrlKey && !e.shiftKey) {
        clearTranslate();
      } else if (e.code === "KeyR" && !e.ctrlKey && e.shiftKey) {
        clearAll();
      }
    },
    [
      zoomRoomIn,
      zoomRoomOut,
      rotateRoomLeft,
      rotateRoomRight,
      clearTranslate,
      clearAll,
      runProperTranslate,
    ]
  );

  return [
    rotateRoomLeft,
    rotateRoomRight,
    zoomRoomIn,
    zoomRoomOut,
    clearTranslate,
    clearAll,
    onKeyDown,
    runProperTranslate,
  ];
};

export default useRoomTransform;
