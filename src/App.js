import "./styles.css";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  Panel,
} from "reactflow";
import SidePanel from "./SidePanel";
import "reactflow/dist/style.css";
import { useState, useCallback, useRef, useEffect } from "react";
import { CustomTextNode } from "./CustomNode";
import EditPanel from "./EditPanel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const initialEdges = [];

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: "Hello",
    type: "customTextNode",
  },
];
const nodeTypes = { customTextNode: CustomTextNode };
function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const numberOfNode = useRef(0);
  const reactFlowWrapper = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const onSelectionChange = ({ nodes, edges }) => {
    if (nodes.length === 0) {
      setSelectedNode(null);
    } else {
      if (nodes[0].id !== selectedNode?.id) setSelectedNode(nodes[0]);
    }
  };

  const handleNodeDeSelect = useCallback(() => {
    setSelectedNode(null);
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, []);
  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            node.data = value;
          }
          return node;
        })
      );
      setSelectedNode((prev) => ({ ...prev, data: value }));
    },
    [selectedNode, nodes, edges]
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const countSourceEdges = (node) => {
    return edges.filter((edge) => edge.source === node).length < 1;
  };
  const onConnect = useCallback(
    (params) => {
      const { source } = params;
      if (countSourceEdges(source)) {
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            },
            eds
          )
        );
      }
    },
    [edges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("nodeType");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: String(numberOfNode.current + 1),
        position,
        data: "",
        type,
      };
      setNodes((nds) => [...nds, newNode]);
      numberOfNode.current += 1;
    },
    [reactFlowInstance]
  );

  const checkAllNodesConnnected = () => {
    const numberOfNodes = nodes.length;
    if (numberOfNodes === 1) return true;
    let targetSet = new Set();
    edges.forEach((edge) => {
      targetSet.add(edge.target);
    });
    return numberOfNodes - 1 === targetSet.size;
  };

  const saveChanegs = () => {
    if (!checkAllNodesConnnected()) {
      toast.error("Cannot save flow", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        // closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    toast.success("Saved", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  useEffect(() => {
    numberOfNode.current = initialNodes.length;
  }, [initialNodes]);

  return (
    <div>
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} style={{ height: "100vh", width: "100vw" }}>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            defaultViewport={{x:0,y:0,zoom:0.1}}
            fitView
          >
            <Background />
            <Controls />
            {selectedNode ? (
              <EditPanel
                title={"Message"}
                handleChange={handleInputChange}
                data={selectedNode?.data}
                deSelect={handleNodeDeSelect}
              />
            ) : (
              <SidePanel />
            )}
            <Panel position="top-left" id="top-panel">
              <button onClick={saveChanegs}>Save Changes</button>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      <ToastContainer />
    </div>
  );
}

export default Flow;
