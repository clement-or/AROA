const electron = require("electron"),
{ app, BrowserWindow, ipcMain } = require('electron'),
// Custom modules
model = require('./models/model.js'),
renderer = require('./render.js');

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
});

/**
* Function called when app is started
*/
function initApp() {
  // Get data
  const data = model.loadOdsToCyto('data-new.ods'),
  // Feed it to renderer
  win = renderer.render('graph.html', data);
  // Open dev tools
  win.webContents.openDevTools();
}

app.whenReady().then(initApp);
