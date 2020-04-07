module.exports.graphStyle = [ // the stylesheet for the graph
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
];
