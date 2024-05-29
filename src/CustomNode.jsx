import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import WAImg from "./assets/images/wa.png";
import { MessageOutlined } from "@ant-design/icons";

export function CustomTextNode(props) {
  const onChange = useCallback((evt) => {
    setTextNodeValue(evt.target.value);
  }, []);
  const [textNodeValue, setTextNodeValue] = useState("");

  useEffect(() => {
    setTextNodeValue(props.data);
    // console.log("conn: ", props);kj
  }, [props.data]);

  return (
    <div className="text-updater-node">
      <Handle 
        type="source"
        position={Position.Right}
      />
      <div className="text-updater-node-header">
        <div className="text-updater-node-header-text">
          <MessageOutlined className="message-icon" />
          <p>Send Message</p>
        </div>
        <div className="wa-logo">
          <img src={WAImg} alt="whatsapp logo" />
        </div>
      </div>
      <div>
        <input
          id="text"
          name="text"
          onChange={onChange}
          className="node__input"
          value={textNodeValue}
          placeholder="Enter message"
          readOnly
        />
      </div>
      <Handle 
        type="target"
        position={Position.Left}
      />
    </div>
  );
}
