// script.js

// Graph represented as an adjacency list
let graph = {};
let positions = {};
let visited = {};

// Canvas setup
const canvas = document.getElementById("graph-canvas");
const ctx = canvas.getContext("2d");

// Colors for nodes
const colors = {
  unvisited: "#aaa",
  visited: "#4caf50",
  current: "#ff5722",
};

// Add a node to the graph with random positions for simplicity
function addNode() {
  const node = document.getElementById("node").value;
  if (node && !(node in graph)) {
    graph[node] = [];
    visited[node] = false;
    positions[node] = { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 };
    drawGraph();
  }
}

// Add an edge to the graph
function addEdge() {
  const edgeInput = document.getElementById("edge").value;
  const [u, v] = edgeInput.split(" ");
  if (u && v && u in graph && v in graph) {
    graph[u].push(v);
    graph[v].push(u); // For undirected graph
    drawGraph();
  }
}

// Draw graph with nodes and edges
function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  ctx.strokeStyle = "#333";
  for (const u in graph) {
    for (const v of graph[u]) {
      ctx.beginPath();
      ctx.moveTo(positions[u].x, positions[u].y);
      ctx.lineTo(positions[v].x, positions[v].y);
      ctx.stroke();
    }
  }

  // Draw nodes
  for (const node in graph) {
    ctx.fillStyle = visited[node] ? colors.visited : colors.unvisited;
    ctx.beginPath();
    ctx.arc(positions[node].x, positions[node].y, 18, 0, 2 * Math.PI);
    ctx.fill();

    // Draw node label
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(node, positions[node].x, positions[node].y + 5);
  }
}

// BFS animation
async function startBFS() {
  const startNode = prompt("Enter the starting node for BFS:");
  if (startNode in graph) {
    visited = resetVisited();
    await animateBFS(startNode);
  }
}

// Animate BFS traversal
async function animateBFS(startNode) {
  let queue = [startNode];
  visited[startNode] = true;

  while (queue.length > 0) {
    const node = queue.shift();
    highlightNode(node, colors.current);

    for (let neighbor of graph[node]) {
      if (!visited[neighbor]) {
        queue.push(neighbor);
        visited[neighbor] = true;
      }
    }

    await sleep(1000); // Wait for 1 second
    highlightNode(node, colors.visited);
  }
}

// DFS animation
async function startDFS() {
  const startNode = prompt("Enter the starting node for DFS:");
  if (startNode in graph) {
    visited = resetVisited();
    await animateDFS(startNode);
  }
}

// Animate DFS traversal
async function animateDFS(node) {
  visited[node] = true;
  highlightNode(node, colors.current);

  await sleep(1000); // Wait for 1 second
  for (let neighbor of graph[node]) {
    if (!visited[neighbor]) {
      await animateDFS(neighbor);
    }
  }

  highlightNode(node, colors.visited);
}

// Reset visited nodes
function resetVisited() {
  let reset = {};
  for (let node in graph) {
    reset[node] = false;
  }
  return reset;
}

// Highlight a node with a given color
function highlightNode(node, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(positions[node].x, positions[node].y, 18, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "bold 14px Arial";
  ctx.fillText(node, positions[node].x, positions[node].y + 5);
}

// Utility function to pause execution
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
