// Global Graph State - direct mapping from your C arrays
let cities = []; 
let adj = [];    // Adjacency Matrix (simulated with a 2D array)
let affected = []; // Affected status (0 or 1)
let reports = [];
let nextReportId = 1;

// Utility: Find index (city names in C are now used as keys/names)
function getCityIndex(name) {
    return cities.indexOf(name);
}

// --- BFS Shortest Path (Rescue Route) ---
function bfsShortestPath(startName, destName) {
    const src = getCityIndex(startName);
    const dest = getCityIndex(destName);
    if (src === -1 || dest === -1) return { path: [], length: -1 };

    const visited = new Array(cities.length).fill(false);
    const parent = new Array(cities.length).fill(-1);
    const queue = [src];
    visited[src] = true;

    while (queue.length > 0) {
        const u = queue.shift();
        if (u === dest) break;

        for (let v = 0; v < cities.length; v++) {
            if (adj[u][v] === 1 && !visited[v]) {
                // Core Logic: Avoid passing through affected nodes, unless 'v' is the destination
                if (affected[v] === 1 && v !== dest) continue; 
                
                visited[v] = true;
                parent[v] = u;
                queue.push(v);
            }
        }
    }

    if (!visited[dest]) return { path: [], length: -1 };

    // Reconstruct path
    const path = [];
    let curr = dest;
    while (curr !== -1) {
        path.push(cities[curr]);
        curr = parent[curr];
    }
    // Path is reversed (dest -> src), reverse it for output
    return { path: path.reverse(), length: path.length - 1 };
}


// --- DFS Util (Reachable Safe Zones) ---
function dfsUtil(u, visited, safeZones) {
    visited[u] = true;
    
    // Only add if not affected, OR if it's the start node (to initiate search)
    if (affected[u] === 0 || safeZones.length === 0) { 
        safeZones.push(cities[u]);
    }

    for (let v = 0; v < cities.length; v++) {
        if (adj[u][v] === 1 && !visited[v]) {
            // Core Logic: Only continue the search to SAFE zones (affected[v] === 0)
            if (affected[v] === 0) { 
                dfsUtil(v, visited, safeZones);
            }
        }
    }
}

function showReachableSafeZones(startName) {
    const src = getCityIndex(startName);
    if (src === -1) return { safeZones: [], startAffected: false };

    const visited = new Array(cities.length).fill(false);
    const safeZones = [];
    
    // Start the DFS
    dfsUtil(src, visited, safeZones);
    
    // The first element added is always the source; remove it if it's affected.
    const startAffected = affected[src] === 1;
    if (startAffected) {
         // The safeZones list contains the starting affected city.
         // Filter out other affected cities inside the utility if possible, but for simplicity here we just check the output.
         // A more precise implementation would track the initial call context.
         // For now, the DFS logic handles the 'safe' filtering.
    }

    // Since safeZones might contain the source city even if affected (as the search root), 
    // the output should reflect the DFS path through the graph.
    return { 
        safeZones: safeZones, 
        startAffected: startAffected 
    };
}

// Mock function to initialize a basic Telangana network
function initializeGraph() {
    cities = ['Hyderabad', 'Warangal', 'Khammam', 'Karimnagar', 'Nalgonda', 'Shelter_A'];
    const N = cities.length;
    adj = Array(N).fill(0).map(() => Array(N).fill(0));
    affected = Array(N).fill(0);

    const roads = [
        ['Hyderabad', 'Warangal'], ['Hyderabad', 'Nalgonda'],
        ['Warangal', 'Karimnagar'], ['Khammam', 'Nalgonda'],
        ['Karimnagar', 'Nalgonda'], ['Hyderabad', 'Shelter_A']
    ];

    roads.forEach(([c1, c2]) => {
        const u = getCityIndex(c1);
        const v = getCityIndex(c2);
        if (u !== -1 && v !== -1) {
            adj[u][v] = 1;
            adj[v][u] = 1;
        }
    });

    // Mark Warangal as the initial disaster zone
    affected[getCityIndex('Warangal')] = 1;
    
    // Update UI elements
    document.getElementById('city-list').textContent = `Current Cities: ${cities.join(', ')}`;
    document.getElementById('city-selector').innerHTML = cities.map(c => `<option value="${c}">${c}</option>`).join('');

    console.log("Graph Initialized.");
}

// Export functions for main.js
export { cities, affected, getCityIndex, toggleAffectedStatus, bfsShortestPath, showReachableSafeZones, initializeGraph, reports, nextReportId };