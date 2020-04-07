const { BrowserWindow } = require('electron');

/**
* Creates a window and returns it
* @param w Width
* @param h Height
* @param path Path the the HTML file to render
* @return The BrowserWindow object
*/
module.exports.createWindow = function (w, h, path) {
  // Cree la fenetre du navigateur.
  const win = new BrowserWindow({
    width: w,
    height: h,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // et charger le fichier index.html de l'application.
  win.loadFile(path)
  return win;
}

function replaceText(selector, text) {
  const elt = document.querySelector(selector);
}

/**
* Renders the specified file using Mustache
* @param viewName Name of the view, will automatically resolve file path
* @param data Data to put in the renderer
* @param win The window in which to render. If not specified, creates a new window
* @param width Width (default 800px)
* @param height Height (default 800px)
* @return The BrowserWindow object
*/
module.exports.render = function(viewName, data, win=null, width=800, height=800) {
  // Auto locate in views folder
  file = `./views/${viewName}/${viewName}.html`;

  // If win has been specified, just load, instead create a new window
  if (win == null)
    win = exports.createWindow(width, height, file);
  else
    win.loadFile(file);

  // Send the data to renderer process when window is ready
  win.webContents.once('dom-ready', () => {
    // Send data to the window and let it use it
    win.webContents.send('data-received', data);
  });

  return win;
}
