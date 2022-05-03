import FurnitureList from "./furniture/FurnitureList";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import RoomName from "./RoomName";
import IconLink from "./IconLink";
import { useRoom } from "../contexts/RoomProvider";

const categories = [
  {
    id: 0,
    name: "Tables",
    icon: "ic:baseline-table-restaurant",
    furniture: [
      {
        id: 0,
        name: "Table For 2",
        x: 90,
        y: 90,
      },
      {
        id: 1,
        name: "Table For 4",
        x: 180,
        y: 90,
      },
      {
        id: 2,
        name: "Table For 6",
        x: 360,
        y: 90,
      },
    ],
  },
  {
    id: 1,
    name: "Chairs",
    icon: "bx:chair",
    furniture: [
      {
        id: 3,
        name: "Chair 1",
        x: 90,
        y: 90,
      },
      {
        id: 4,
        name: "Chair 2",
        x: 180,
        y: 90,
      },
      {
        id: 5,
        name: "Chair 3",
        x: 360,
        y: 90,
      },
    ],
  },
];

const ObjectsPanel = () => {
  const { room } = useRoom();

  return (
    <div className="sidebar">
      <SidebarHeader render={() => <RoomName name={room.name} />} />
      <div className="sidebar-content">
        <h4>Furniture</h4>
        <FurnitureList categories={categories} />
      </div>
      <SidebarFooter
        render={() => (
          <IconLink
            classNames="color-default"
            name="Settings"
            action={() => console.log("TO DO")}
            icon="ic:baseline-settings"
          />
        )}
      />
    </div>
  );
};

export default ObjectsPanel;
