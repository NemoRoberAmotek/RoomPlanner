import FurnitureList from "./objectspanel/FurnitureList";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import RoomName from "./RoomName";
import IconLink from "./IconLink";
import Modal from "./Modal";
import GlobalSettingsForm from "./GlobalSettingsForm";
import { useRoom } from "../contexts/RoomProvider";
import { useState } from "react";

const categories = [
  {
    id: 0,
    name: "Tables",
    icon: "ic:baseline-table-restaurant",
    furniture: [
      {
        id: 0,
        name: "Table For 2",
        width: 100,
        length: 100,
      },
      {
        id: 1,
        name: "Table For 4",
        width: 180,
        length: 90,
      },
      {
        id: 2,
        name: "Table For 6",
        width: 360,
        length: 90,
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
        width: 90,
        length: 90,
      },
      {
        id: 4,
        name: "Chair 2",
        width: 180,
        length: 90,
      },
      {
        id: 5,
        name: "Chair 3",
        width: 360,
        length: 90,
      },
    ],
  },
];

const ObjectsPanel = () => {
  const { room } = useRoom();
  const [globalSettingsModalOpen, setGlobalSettingsModalOpen] = useState(false);

  return (
    <>
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
              action={() => setGlobalSettingsModalOpen(true)}
              icon="ic:baseline-settings"
            />
          )}
        />
      </div>
      {globalSettingsModalOpen && (
        <Modal
          render={() => (
            <GlobalSettingsForm
              closeModal={() => setGlobalSettingsModalOpen(false)}
            />
          )}
          onClose={() => setGlobalSettingsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ObjectsPanel;
