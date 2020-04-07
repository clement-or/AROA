const cytoscape = require("cytoscape"),
{ ipcRenderer } = require("electron"),
{ graphStyle } = require("./graph-style.js");

ipcRenderer.on('data-received', function(event, data) {


  const cy = cytoscape({
    container: document.getElementById('render'),
    wheelSensitivity: .3,

    elements: data,

    style: graphStyle,

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
