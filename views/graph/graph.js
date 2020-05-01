const { ipcRenderer } = require("electron"),
fs = require("fs"),
path = require("path"),
uuid = require("uuid").v4,

layoutOptions = require("./graph-layout-options.js"),

cytoscape = require("cytoscape"),
lay = require('cytoscape-dagre');

// Use the custom layout
cytoscape.use(lay);

// Load the graph CSS as a string
const graphStyle = fs.readFileSync(path.resolve(__dirname, 'graph-style.css'), 'utf8');

let mode = "default";

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

  // Set listeners
  updateListeners(cy);

  // Change mode (action bar)
  document.querySelectorAll("#action-bar > a").forEach(elt => {
    elt.addEventListener("click", e => {
      if (e.target.classList.contains("selected")) return;

      document.querySelector("#action-bar > .selected")
      .classList.remove("selected");

      e.target.classList.add("selected");
      mode = e.target.dataset.mode;

      updateListeners(cy);
    });
  });

  // Delete node
  document.addEventListener("keydown", e => deleteNode(e, cy));
});

function updateListeners(cy) {
  cy.removeAllListeners();

  // Register double click event because dblclick doesn't work
  let tappedBefore, tappedTimeout;
  cy.on('tap', function(event) {
    var tappedNow = event.target;
    if (tappedTimeout && tappedBefore) {
      clearTimeout(tappedTimeout);
    }
    if(tappedBefore === tappedNow) {
      tappedBefore = null;
      tappedNow.trigger('dblclick', [
        event.renderedPosition
      ]);
    } else {
      tappedTimeout = setTimeout(function(){ tappedBefore = null; }, 300);
      tappedBefore = tappedNow;
    }
  });

  if (mode == "default") {
    // Edit node
    cy.nodes().on("dblclick", e => editNode(e.target));

    // Create node
    cy.on("dblclick", (e, rpos) => {
      e.renderedPosition = rpos;
      return e.target == cy ? createNode(e) : 0;
    });
  }
}

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
    updateListeners(node.cy());
  });

}

function createNode(event) {
  // Get DOM elements
  const createModal = document.getElementById("create-modal"),
  nodeNameInput = document.getElementById("create-modal--node-title"),
  saveButton = createModal.querySelector('.button.is-success'),
  cy = event.target;

  openModal(createModal);

  // On save, create node and quite
  saveButton.addEventListener("click", function _listener(evt) {
    // Just close if title is empty
    if (!nodeNameInput.value) return closeModal(createModal);

    console.log(event);

    cy.add({
      group: 'nodes',
      data: {
        id: uuid(),
        title: nodeNameInput.value
      },
      renderedPosition: {
        x: event.renderedPosition.x,
        y: event.renderedPosition.y,
      }
    });

    nodeNameInput.value = "";
    saveButton.removeEventListener("click", _listener);
    closeModal(createModal);
    updateListeners(cy);
  });

}

function deleteNode(e, cy) {
  if (e.code == "Delete") {
    cy.remove(cy.$("*:selected"));
  }
  updateListeners(cy);
}

/** UTILS **/

function onGraphReady() {
  // Hide loading and show UI
  document.getElementById('load-overlay').style.display = "none";
  document.querySelectorAll('.is-hidden').forEach(elt => {
    elt.classList.remove('is-hidden');
  });
}

/*
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
*/

function openModal(modal) {
  modal.classList.add('is-active');
}

function closeModal(modal) {
  modal.classList.remove('is-active');
}
