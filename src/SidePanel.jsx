import { Panel } from "reactflow";
import { MessageOutlined } from "@ant-design/icons";

// side bar item config
const sideBarItems = [
  {
    label: "Message",
    icon: <MessageOutlined className="message-icon" />,
    nodeType: "customTextNode",
    key: "CustomTextNode",
  },
];
const SidePanel = ({ onAddNodeCallback }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("nodeType", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <Panel position="top-right" id="side-panel">
      <div className="sidebar">
        {sideBarItems.map((item) => {
          return (
            <div
              className={`SidebarItem ${item.nodeType}`}
              draggable
              onDragStart={(event) => onDragStart(event, item.nodeType)}
              key={item.key}
            >
              {item.icon}
              <p>{item.label}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default SidePanel;
