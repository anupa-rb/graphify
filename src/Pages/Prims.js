import React, { useRef, useState, useEffect } from "react";
import NavBar from "../Components/Navbar";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

const Prim = () => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const [mstEdges, setMstEdges] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState(new Set());
  const [feedback, setFeedback] = useState("");
  const [originalEdgeColors, setOriginalEdgeColors] = useState(new Map());

  // Preserve nodes and edges across re-renders using useState
  const [nodes] = useState(
    () =>
      new DataSet([
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
      ])
  );

  const [edges] = useState(
    () =>
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
    const data = { nodes, edges };
    const options = {
      edges: { font: { align: "top" }, color: { color: "#aaa" } },
      physics: false,
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    setMstEdges(computeMST());

    network.on("selectEdge", (params) => {
      const edgeId = params.edges[0];
      toggleEdgeSelection(edgeId);
    });

    return () => network.destroy();
  }, []);

  // Rest of the code remains the same...
  // [Ensure all other functions (toggleEdgeSelection, updateEdgeColor, etc.) remain unchanged]
  const toggleEdgeSelection = (edgeId) => {
    setSelectedEdges((prev) => {
      const updated = new Set(prev);
      if (updated.has(edgeId)) {
        updated.delete(edgeId);
        updateEdgeColor(edgeId, originalEdgeColors.get(edgeId) || "#aaa"); // reset edge color
      } else {
        if (!originalEdgeColors.has(edgeId)) {
          const edge = edges.get(edgeId);
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
      console.log("here");
      console.log(updated);
      return updated;
    });
  };

  const updateEdgeColor = (edgeId, color) => {
    const edge = edges.get(edgeId);
    if (edge) {
      edges.update({ id: edgeId, color: { color } });
      networkRef.current.redraw();
    }
  };

  const updateNodeColor = (nodeId, color) => {
    nodes.update({ id: nodeId, color: { background: color } });
    networkRef.current.redraw();
  };

  const computeMST = () => {
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

    while (mstNodes.size < nodes.length) {
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

  const handleSubmit = () => {
    const correctSet = new Set(mstEdges);
    const correctNodes = new Set();
    const wrongNodes = new Set();

    console.log(mstEdges);
    console.log(selectedEdges);

    let correctCount = 0;
    selectedEdges.forEach((edgeId) => {
      const edge = edges.get(edgeId);
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

    // For every edge in the MST not selected by the user, ensure it is shown as green.
    mstEdges.forEach((edgeId) => {
      if (!selectedEdges.has(edgeId)) {
        const originalColor = originalEdgeColors.get(edgeId) || "#aaa";
        updateEdgeColor(edgeId, originalColor); // reset edge color
        const edge = edges.get(edgeId);
        if (edge) {
          correctNodes.add(edge.from);
          correctNodes.add(edge.to);
        }
      }
    });

    setFeedback(`You got ${correctCount} out of ${mstEdges.length} correct!`);
  };

  const handleReset = () => {
    setSelectedEdges(new Set());
    setFeedback("");
    setOriginalEdgeColors(new Map()); // Reset original edge colors

    edges.forEach((edge) => {
      const originalColor = "#aaa";
      updateEdgeColor(edge.id, originalColor);
    });

    nodes.forEach((node) => updateNodeColor(node.id, undefined));
    networkRef.current.unselectAll();
  };

  return (
    <div>
      <NavBar />
      <h2>Guess the Minimum Spanning Tree</h2>
      <div
        ref={containerRef}
        style={{ height: "450px", border: "1px solid black" }}
      />
      <button onClick={handleSubmit}>Submit Guess</button>
      <button onClick={handleReset} style={{ marginLeft: "10px" }}>
        Reset
      </button>
      <p>{feedback}</p>
    </div>
  );
};

export default Prim;
