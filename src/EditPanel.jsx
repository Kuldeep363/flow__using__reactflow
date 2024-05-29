import { Panel } from "reactflow";
import { MessageOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const EditPanel = ({ title, data, handleChange, deSelect }) => {
  return (
    <Panel position="top-right" id="edit-panel">
      <div className="sidebar">
        <div className="setting__bar__heading">
          <span onClick={deSelect}>
            <ArrowLeftOutlined className="icon" />
          </span>
          <p>{title}</p>
        </div>
        <div className="setting__bar__input">
          <small>Text</small>
          <textarea
            value={data}
            onChange={handleChange}
            placeholder="Enter message"
          />
        </div>
      </div>
    </Panel>
  );
};

export default EditPanel;
