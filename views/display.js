const xlsx = require("xlsx");
const cytoscape = require("cytoscape");

var doc = xlsx.readFile('data.ods').Sheets.Sheet1;
//document.getElementById("content").innerHTML = JSON.stringify(workbook.Sheets.Sheet1, null, 4);

// Let's construct data for nodes

// First, create a unique node for every anime
const alreadyCreatedAnimes = [];
const data = [];

for (i = 0; i < 26; i++) {
  const letter = String.fromCharCode(97 + i).toUpperCase();

  for (n = 0; n < 412; n++) {
    // Get anime and check if it has already been created
    let anime = doc[letter+n];
    if (anime != null)
      if (alreadyCreatedAnimes.indexOf(anime.v) == -1) {
        data.push({data: {id: anime.v}});
        alreadyCreatedAnimes.push(anime.v)
      }
  }
}

// Then create connexions

// Then render shit

const cy = cytoscape({
  container: document.getElementById('render'),
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

document.getElementById("render").style.background = "whitesmoke";
