const electron = require("electron"),
{ app, BrowserWindow } = require('electron'),
xlsx = require("xlsx");

function createWindow (w, h, path) {
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

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
});

function initApp() {
  const win = createWindow(800, 800, 'views/display.html');
  win.webContents.openDevTools();
}

app.whenReady().then(initApp);
