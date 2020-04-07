const cytoscape = require("cytoscape"),
{ ipcRenderer } = require("electron");

ipcRenderer.on('data-received', function(event, data) {

  const cy = cytoscape({
    container: document.getElementById('render'),
    wheelSensitivity: .3,

    elements: data,

    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'width': 50,
          'height': 50,
          'background-color': '#666',
          'label': 'data(id)',
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',

        }
      }
    ],

    layout: {
      name: 'cose',
      animate: false,
      stop: function() {
        document.getElementById('load-overlay').style.display = "none";
        console.log("Layout loading finished");
      }
    }

  });

});
