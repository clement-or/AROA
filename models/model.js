const xlsx = require("xlsx");

/**
* Load ODS to data and parse it to Cytoscape JS format (JSON)
* @param file File to parse
* @param lineNb Max number of lines in the ODS file
*/
module.exports.loadOdsToCyto = function(file, lineNb=412) {
  const doc = xlsx.readFile(file).Sheets.Sheet1,
  alreadyCreatedAnimes = [],
  data = [];

  // First, create nodes
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

  // Then create connexions between nodes
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

  return data;
}
