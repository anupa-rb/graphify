import React, { useRef, useState, useEffect } from "react";
import NavBar from "../Components/Navbar";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import "../styles/algorithm.css";
import Button from "react-bootstrap/Button";

const Dijkstra = () => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const [shortestPathEdges, setShortestPathEdges] = useState([]);
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

    // Set the shortest path edges from start node (1) to end node (5)
    setShortestPathEdges(computeDijkstra(1, 5, edges.current));

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

  const computeDijkstra = (start, end, edges) => {
    const distances = {};
    const previous = {};
    const edgeQueue = [];

    // Initialize distances
    edges.forEach((edge) => {
      distances[edge.from] = Infinity;
      distances[edge.to] = Infinity;
    });

    distances[start] = 0;
    edgeQueue.push({ node: start, distance: 0 });

    while (edgeQueue.length > 0) {
      edgeQueue.sort((a, b) => a.distance - b.distance);
      const { node, distance } = edgeQueue.shift();

      edges.forEach((edge) => {
        if (edge.from === node || edge.to === node) {
          const neighbor = edge.from === node ? edge.to : edge.from;
          const newDist = distance + edge.weight;
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            previous[neighbor] = edge.id;
            edgeQueue.push({ node: neighbor, distance: newDist });
          }
        }
      });
    }

    // Reconstruct the shortest path
    const path = [];
    let current = end;
    while (previous[current]) {
      path.push(previous[current]);
      current = edges.get(previous[current]).from;
    }
    return path.reverse(); // Return the path from start to end
  };

  const generateRandomGraph = () => {
    const numNodes = Math.floor(Math.random() * 5) + 5; // 5–9 nodes
    const newNodes = [];
    const radius = 100;
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

    // Generate a spanning tree (connected with n-1 edges)
    const newEdges = [];
    const inTree = new Set([1]); // Start with node 1

    // Connect each node to the tree
    for (let i = 2; i <= numNodes; i++) {
      const possibleTargets = Array.from(inTree);
      const target =
        possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
      const weight = Math.floor(Math.random() * 10) + 1;
      newEdges.push({
        id: `${i}-${target}`,
        from: i,
        to: target,
        label: `${weight}`,
        weight,
      });
      inTree.add(i);
    }

    // Add additional edges up to 7 total
    const existingEdges = new Set(newEdges.map((e) => e.id));
    let edgeCount = newEdges.length;

    // Collect all possible non-tree edges
    const possibleEdges = [];
    for (let i = 1; i <= numNodes; i++) {
      for (let j = i + 1; j <= numNodes; j++) {
        const edgeId = `${i}-${j}`;
        if (!existingEdges.has(edgeId)) {
          possibleEdges.push({ from: i, to: j });
        }
      }
    }

    // Shuffle and add edges until we reach 7 or run out
    possibleEdges.sort(() => Math.random() - 0.5);
    for (const edge of possibleEdges) {
      if (edgeCount >= 7) break;
      const weight = Math.floor(Math.random() * 10) + 1;
      const edgeId = `${edge.from}-${edge.to}`;
      newEdges.push({
        id: edgeId,
        from: edge.from,
        to: edge.to,
        label: `${weight}`,
        weight,
      });
      existingEdges.add(edgeId);
      edgeCount++;
    }

    return { newNodes, newEdges };
  };

  const handleSubmit = () => {
    const correctSet = new Set(shortestPathEdges);
    let correctCount = 0;

    selectedEdges.forEach((edgeId) => {
      if (correctSet.has(edgeId)) {
        updateEdgeColor(edgeId, "#0f0"); // green - correct edge
        correctCount++;
      } else {
        updateEdgeColor(edgeId, "#f00"); // red - wrong edge
      }
    });

    setFeedback(`You got ${correctCount} out of ${shortestPathEdges.length} correct!`);

    // Move to another graph if all answers are correct
    if (correctCount === shortestPathEdges.length) {
      setTimeout(() => {
        alert("All answers are correct!");
        // Generate new graph data as arrays
        const { newNodes, newEdges } = generateRandomGraph();
        // Clear existing data and add new nodes/edges
        nodes.current.clear();
        edges.current.clear();
        nodes.current.add(newNodes);
        edges.current.add(newEdges);
        // Recalculate shortest path with the updated edges DataSet
        setShortestPathEdges(computeDijkstra(1, newNodes.length, edges.current));
        // Reset UI elements
        handleReset();
      }, 1000);
    }
  };

  const handleSkip = () => {
    setTimeout(() => {
      const { newNodes, newEdges } = generateRandomGraph();
      nodes.current.clear();
      edges.current.clear();
      nodes.current.add(newNodes);
      edges.current.add(newEdges);
      setShortestPathEdges(computeDijkstra(1, newNodes.length, edges.current));
      handleReset();
    }, 1000);
  };

  const handleReset = () => {
    setSelectedEdges(new Set());
    setFeedback("");
    setOriginalEdgeColors(new Map());

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
        <h2>Guess the Shortest Path (Dijkstra's Algorithm)</h2>
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
      <Button className="btn" variant="primary" onClick={handleSkip}>
        Skip
      </Button>

      <p className="feedback">{feedback}</p>
    </div>
  );
};

export default Dijkstra;