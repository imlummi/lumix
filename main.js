const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#1e1e1e',
    titleBarStyle: 'hiddenInset', // Better for macOS
    frame: false,
    trafficLightPosition: { x: 20, y: 20 }, // Position the native buttons
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');

  // Handle window controls using channel 'window-control'
  ipcMain.on('window-control', (event, action) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    switch (action) {
      case 'minimize':
        window.minimize();
        break;
      case 'maximize':
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
        break;
      case 'close':
        window.close();
        break;
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
