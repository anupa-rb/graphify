import React, { useRef, useState, useEffect } from "react";
import NavBar from "../Components/Navbar";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import "../styles/algorithm.css";
import Button from "react-bootstrap/Button";

const Prim = () => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const [mstEdges, setMstEdges] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState(new Set());
  const [feedback, setFeedback] = useState("");
  const [originalEdgeColors, setOriginalEdgeColors] = useState(new Map());

  const nodes = useRef(
    new DataSet([
      { id: 1, label: "A" },
      { id: 2, label: "B" },
      { id: 3, label: "C" },
      { id: 4, label: "D" },
      { id: 5, label: "E" },
    ])
  );

  const edges = useRef(
    new DataSet([
      { id: "1-2", from: 1, to: 2, label: "3", weight: 3 },
      { id: "1-3", from: 1, to: 3, label: "1", weight: 1 },
      { id: "2-3", from: 2, to: 3, label: "2", weight: 2 },
      { id: "2-4", from: 2, to: 4, label: "4", weight: 4 },
      { id: "3-4", from: 3, to: 4, label: "5", weight: 5 },
      { id: "4-5", from: 4, to: 5, label: "7", weight: 7 },
      { id: "3-5", from: 3, to: 5, label: "6", weight: 6 },
    ])
  );

  useEffect(() => {
    const data = { nodes: nodes.current, edges: edges.current };
    const options = {
      edges: { font: { align: "top" }, color: { color: "#aaa" } },
      physics: false,
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    setMstEdges(computeMST(edges.current));

    const handleSelectEdge = (params) => {
      const edgeId = params.edges[0];
      toggleEdgeSelection(edgeId);
    };

    network.on("selectEdge", handleSelectEdge);

    return () => {
      network.off("selectEdge", handleSelectEdge);
      network.destroy();
    };
  }, []);

  const toggleEdgeSelection = (edgeId) => {
    setSelectedEdges((prev) => {
      const updated = new Set(prev);
      if (updated.has(edgeId)) {
        updated.delete(edgeId);
        updateEdgeColor(edgeId, originalEdgeColors.get(edgeId) || "#aaa"); // reset edge color
      } else {
        if (!originalEdgeColors.has(edgeId)) {
          const edge = edges.current.get(edgeId);
          if (edge) {
            const edgeColor = edge.color?.color || "#aaa"; // Default to the normal gray if undefined
            setOriginalEdgeColors((prevColors) =>
              new Map(prevColors).set(edgeId, edgeColor)
            );
          }
        }
        updated.add(edgeId);
        updateEdgeColor(edgeId, "#00f"); // blue - selected edge
      }
      return updated;
    });
  };

  const updateEdgeColor = (edgeId, color) => {
    const edge = edges.current.get(edgeId);
    if (edge) {
      edges.current.update({ id: edgeId, color: { color } });
      networkRef.current.redraw();
    }
  };

  const updateNodeColor = (nodeId, color) => {
    nodes.current.update({ id: nodeId, color: { background: color } });
    networkRef.current.redraw();
  };

  const computeMST = (edges) => {
    const mst = [];
    const mstNodes = new Set();
    const edgeQueue = [];

    const addEdges = (node) => {
      edges.forEach((edge) => {
        if (
          (edge.from === node && !mstNodes.has(edge.to)) ||
          (edge.to === node && !mstNodes.has(edge.from))
        ) {
          edgeQueue.push(edge);
        }
      });
    };

    mstNodes.add(1);
    addEdges(1);

    while (mstNodes.size < nodes.current.length) {
      edgeQueue.sort((a, b) => a.weight - b.weight);
      const minEdge = edgeQueue.shift();

      if (minEdge) {
        const { from, to } = minEdge;
        if (mstNodes.has(from) && mstNodes.has(to)) continue;

        mst.push(minEdge.id);
        mstNodes.add(from);
        mstNodes.add(to);
        addEdges(from);
        addEdges(to);
      }
    }
    console.log(mst);
    return mst;
  };

  const generateRandomGraph = () => {
    const numNodes = Math.floor(Math.random() * 5) + 5; // 5–9 nodes
    const newNodes = [];
    const radius = 100; // Radius of the circular layout
    const center = { x: 0, y: 0 };

    // Assign positions in a circle
    for (let i = 1; i <= numNodes; i++) {
      const angle = (2 * Math.PI * i) / numNodes;
      newNodes.push({
        id: i,
        label: `Node ${i}`,
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      });
    }

    // Generate random edges (limit to 7 edges)
    const newEdges = [];
    let edgeCount = 0;
    for (let i = 1; i <= numNodes && edgeCount < 7; i++) {
      for (let j = i + 1; j <= numNodes && edgeCount < 7; j++) {
        if (Math.random() > 0.5) {
          const weight = Math.floor(Math.random() * 10) + 1;
          newEdges.push({
            id: `${i}-${j}`,
            from: i,
            to: j,
            label: `${weight}`,
            weight,
          });
          edgeCount++;
        }
      }
    }

    return { newNodes, newEdges };
  };

  const handleSubmit = () => {
    const correctSet = new Set(mstEdges);
    const correctNodes = new Set();
    const wrongNodes = new Set();

    console.log(mstEdges);
    console.log(selectedEdges);

    let correctCount = 0;
    selectedEdges.forEach((edgeId) => {
      const edge = edges.current.get(edgeId);
      if (!edge) return; // Skip if edge doesn't exist

      if (correctSet.has(edgeId)) {
        updateEdgeColor(edgeId, "#0f0"); // green - correct edge
        correctNodes.add(edge.from);
        correctNodes.add(edge.to);
        correctCount++;
      } else {
        updateEdgeColor(edgeId, "#f00"); // red - wrong edge
        wrongNodes.add(edge.from);
        wrongNodes.add(edge.to);
      }
    });

    // For every edge in the MST not selected by the user, ensure it retains its original color.
    mstEdges.forEach((edgeId) => {
      if (!selectedEdges.has(edgeId)) {
        const originalColor = originalEdgeColors.get(edgeId) || "#aaa";
        updateEdgeColor(edgeId, originalColor); // reset edge color
        const edge = edges.current.get(edgeId);
        if (edge) {
          correctNodes.add(edge.from);
          correctNodes.add(edge.to);
        }
      }
    });

    setFeedback(`You got ${correctCount} out of ${mstEdges.length} correct!`);

    // Move to another graph if all answers are correct
    if (correctCount === mstEdges.length) {
      setTimeout(() => {
        alert("All answers are correct!");
        // Generate new graph data as arrays
        const { newNodes, newEdges } = generateRandomGraph();
        // Clear existing data and add new nodes/edges
        nodes.current.clear();
        edges.current.clear();
        nodes.current.add(newNodes);
        edges.current.add(newEdges);
        // Recalculate MST with the updated edges DataSet
        setMstEdges(computeMST(edges.current));
        // Reset UI elements
        handleReset();
      }, 1000);
    }
  };

  const handleReset = () => {
    setSelectedEdges(new Set());
    setFeedback("");
    setOriginalEdgeColors(new Map()); // Reset original edge colors

    edges.current.forEach((edge) => {
      const originalColor = "#aaa";
      updateEdgeColor(edge.id, originalColor);
    });

    nodes.current.forEach((node) => updateNodeColor(node.id, undefined));
    networkRef.current.unselectAll();
  };

  return (
    <div className="algoContainer">
      <NavBar />
      <div className="title">
        <h2>Guess the Minimum Spanning Tree</h2>
      </div>

      <div className="graph-container">
        <div className="graph" ref={containerRef} />
      </div>
      <Button className="btn" variant="success" onClick={handleSubmit}>
        Submit
      </Button>
      <Button className="btn" variant="danger" onClick={handleReset}>
        Reset
      </Button>
      <Button className="btn" variant="primary" onClick={generateRandomGraph}>
        Skip
      </Button>

      <p className="feedback">{feedback}</p>
    </div>
  );
};

export default Prim;
