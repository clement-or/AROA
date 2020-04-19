const { ipcRenderer } = require("electron"),
fs = require("fs"),
path = require("path"),

layoutOptions = require("./graph-layout-options.js"),

cytoscape = require("cytoscape"),
lay = require('cytoscape-dagre');

// Use the custom layout
cytoscape.use(lay);

// Load the graph CSS as a string
const graphStyle = fs.readFileSync(path.resolve(__dirname, 'graph-style.css'), 'utf8');

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
      rankDir: 'TB',
      stop: onGraphReady()
    }
  });

  // Register double click event because dblclick doesn't work
  let tappedBefore, tappedTimeout;
  cy.on('tap', function(event) {
    var tappedNow = event.target;
    if (tappedTimeout && tappedBefore) {
      clearTimeout(tappedTimeout);
    }
    if(tappedBefore === tappedNow) {
      tappedNow.trigger('dblclick');
      tappedBefore = null;
    } else {
      tappedTimeout = setTimeout(function(){ tappedBefore = null; }, 300);
      tappedBefore = tappedNow;
    }
  });

  // On click (TODO : dblclick)
  cy.nodes().on("dblclick", e => editNode(e.target));
  cy.nodes().on("dblclick", e => console.log("Double click !"));
});

/** Handlers **/

function editNode(node) {
  // Get DOM elements
  const editModal = document.getElementById("edit-modal"),
  nodeNameInput = document.getElementById("edit-modal--node-title"),
  nodeIdInput = document.getElementById("edit-modal--node-id"),
  saveButton = editModal.querySelector('.button.is-success');

  // Show title in input field
  nodeNameInput.value = node.data("title");
  nodeIdInput.value = node.id();
  // Open modal
  openModal(editModal);

  // On save, save value and quit modal
  saveButton.addEventListener("click", function _listener(evt) {
    node.data("title", nodeNameInput.value);

    saveButton.removeEventListener("click", _listener);
    closeModal(editModal);
  });
}


/** UTILS **/

function onGraphReady() {
  // Hide loading and show UI
  document.getElementById('load-overlay').style.display = "none";
  document.querySelectorAll('.is-hidden').forEach(elt => {
    elt.classList.remove('is-hidden');
  });
}

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

function openModal(modal) {
  modal.classList.add('is-active');
}

function closeModal(modal) {
  modal.classList.remove('is-active');
}
