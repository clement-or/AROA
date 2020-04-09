const cytoscape = require("cytoscape"),
{ ipcRenderer } = require("electron"),
{ graphStyle, layoutOptions } = require("./graph-style.js"),
lay = require('cytoscape-dagre');

cytoscape.use(lay);

ipcRenderer.on('data-received', function(event, data) {

  // Create null layout
  const cy = cytoscape({
    container: document.getElementById('graph-render'),
    wheelSensitivity: .3,

    elements: data,

    style: graphStyle,

    layout: {
      name: 'dagre',
      animate: false,
      rankDir: 'TB'
    }
  });

  /*
  // Snap to grid
  snapToGrid(cy.nodes(), 100, 100);

  // Setup event listeners
  cy.nodes().on('dragfree', (e) => {
    snapToGrid(new Array(e.target), 100, 100);
  });
  */
  document.getElementById('load-overlay').style.display = "none";
  document.querySelectorAll('.is-hidden').forEach(elt => {
    elt.classList.remove('is-hidden');
  });
  console.log("Layout loading finished");
});

function snapToGrid(nodes, gridX, gridY) {
  // Snap nodes to grid
  nodes.forEach(node => {
    let pos = node.position();

    if (pos.x % 100 != 0)
      pos.x -= pos.x % 100;
    if (pos.y % 100 != 0)
      pos.y -= pos.y % 100;

    node.position(pos);
  });
}
