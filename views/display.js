const xlsx = require("xlsx");
const cytoscape = require("cytoscape");

var doc = xlsx.readFile('data-new.ods').Sheets.Sheet1;
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
const alreadyCreatedConnexions = [];
for (i = 0; i < 26; i++) {
  const letter = String.fromCharCode(97 + i).toUpperCase();
  const nextLetter = String.fromCharCode(97 + i + 1).toUpperCase();

  for (n = 0; n < 412; n++) {
    // Get this anime and the one to the right
    let anime = doc[letter+n];
    let connectedAnime = doc[nextLetter+n];

    // If they both exist
    if (anime != null && connectedAnime != null) {
      // Create connexion
      let connexion = {data: {id: anime.v + " to " + connectedAnime.v,
                              source: anime.v,
                              target: connectedAnime.v }};
      // Check if connexion has already been made
      if (alreadyCreatedConnexions.indexOf(connexion.data.id) == -1) {
        data.push(connexion);
        alreadyCreatedConnexions.push(connexion.data.id);
      }
    }
  }
}

// Then render shit

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
        'background-image': '../proto-icon.jpg'
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
    animate: false
  }

});
