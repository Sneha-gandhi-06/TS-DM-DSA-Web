import { cities, affected, getCityIndex, bfsShortestPath, showReachableSafeZones, initializeGraph } from './graph.js';

document.addEventListener('DOMContentLoaded', () => {
    // Run initialization when page loads
    initializeGraph();
    updateAffectedList();
});

// Updates the HTML list of affected cities
function updateAffectedList() {
    const list = affected.map((isAffected, index) => 
        isAffected ? `<li>${cities[index]} ⚠️ **AFFECTED**</li>` : `<li>${cities[index]} (Safe)</li>`
    ).join('');
    document.getElementById('affected-list').innerHTML = `<ul>${list}</ul>`;
}

// --- Feature 2: Toggle Affected Status ---
window.toggleAffected = function() {
    const cityName = document.getElementById('city-selector').value;
    const idx = getCityIndex(cityName);
    if (idx !== -1) {
        // Simple toggle logic
        affected[idx] = 1 - affected[idx];
        alert(`${cityName} status toggled to ${affected[idx] === 1 ? 'AFFECTED' : 'SAFE'}`);
        updateAffectedList();
    }
}

// --- Feature 3: Run BFS ---
window.runBFS = function() {
    const start = document.getElementById('bfs-start').value;
    const dest = document.getElementById('bfs-dest').value;
    const resultElement = document.getElementById('bfs-result');

    const result = bfsShortestPath(start, dest);

    if (result.length > 0) {
        resultElement.innerHTML = `✅ **Shortest Rescue Path (BFS):** Length: ${result.length} edges.<br>Route: ${result.path.join(' ➡️ ')}`;
    } else {
        resultElement.textContent = `❌ No available rescue path found from ${start} to ${dest}.`;
    }
}

// --- Feature 4: Run DFS ---
window.runDFS = function() {
    const start = document.getElementById('dfs-start').value;
    const resultElement = document.getElementById('dfs-result');

    const result = showReachableSafeZones(start);

    if (result.safeZones.length > 0) {
        let note = result.startAffected ? 
            '(Note: Starting city is AFFECTED, but the search traced paths to the following connected SAFE zones.)' : 
            '';
        resultElement.innerHTML = `🔥 **Reachable SAFE Zones (DFS):** ${note}<br>Zones: ${result.safeZones.join(', ')}`;
    } else {
        resultElement.textContent = `❌ No reachable safe zones found from ${start}. (Isolated or surrounded by affected areas).`;
    }
}
// Expose functions needed by the HTML 'onclick' attributes
window.initializeGraph = initializeGraph;
window.toggleAffected = toggleAffected;
window.runBFS = runBFS;
window.runDFS = runDFS;