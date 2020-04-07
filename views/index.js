const cytoscape = require("cytoscape");

const data = [
  {data: {id: "Weeb anime 1"}},
  {data: {id: "Weeb anime 2"}},
  {data: {id: "Weeb anime 3"}},

  {data: {id: "Weeb anime 1 to Weeb anime 2",
          source: "Weeb anime 1",
          target: "Weeb anime 2"}}
];

const cy = cytoscape({
  container: document.getElementById('cyto'),
  wheelSensitivity: .3,

  elements: data,

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }

});
