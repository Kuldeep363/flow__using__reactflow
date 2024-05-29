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

  // detect select change
  const onSelectionChange = ({ nodes, edges }) => {
    if (nodes.length === 0) { //if no node selected
      setSelectedNode(null);
    } else {
      if (nodes[0].id !== selectedNode?.id) setSelectedNode(nodes[0]); // if different node selected than already selected node
    }
  };

  // to handle back interaction of node's setting 
  const handleNodeDeSelect = useCallback(() => {
    setSelectedNode(null);
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, []);
  
  // handle change in the input of node from it's setting panel
  const handleInputChange = useCallback(
    (event) => {
      const { value } = event.target;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) { // update value of selected node only
            node.data = value;
          }
          return node;
        })
      );
      setSelectedNode((prev) => ({ ...prev, data: value })); // also update the selected node's value for setting panel
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

  // count the number of edges from a node's source
  const countSourceEdges = (node) => {
    return edges.filter((edge) => edge.source === node).length < 1;
  };
  const onConnect = useCallback(
    (params) => {
      const { source } = params;
      if (countSourceEdges(source)) { // if there is 0 edges from the source of a node then add edge else not
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              markerEnd: {
                type: MarkerType.ArrowClosed,  // give the edge's end an arrowHead
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

      const type = event.dataTransfer.getData("nodeType"); //get the node type of the droped node from side panel

      // check if the dropped element is valid or not, if not don't do anything
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({ // get the position where teh new node dropped
        x: event.clientX,
        y: event.clientY,
      });

      // define new node
      const newNode = {
        id: String(numberOfNode.current + 1), // increment the number of node and assign it as id to new node
        position,
        data: "",
        type,
      };
      setNodes((nds) => [...nds, newNode]); // set new node
      numberOfNode.current += 1;
    },
    [reactFlowInstance]
  );

  // to check whether all the nodes are connected to save flow or not
  const checkAllNodesConnnected = () => {
    const numberOfNodes = nodes.length;
    if (numberOfNodes === 1) return true;
    let targetSet = new Set();
    // get the target node of all the edges and find if more than 1 node has empty target or not
    edges.forEach((edge) => {
      targetSet.add(edge.target);
    });
    return numberOfNodes - 1 === targetSet.size;
  };

  const saveChanegs = () => {
    if (!checkAllNodesConnnected()) { // check connection of all the nodes

      // show error if not connected
      toast.error("Cannot save flow", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    // show succes when saved
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
    // initialize the number of node from default nodes list
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

              // if any node selected, show it's setting panel
              <EditPanel
                title={"Message"}
                handleChange={handleInputChange}
                data={selectedNode?.data}
                deSelect={handleNodeDeSelect}
              />
            ) : (
              // else side panel
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
