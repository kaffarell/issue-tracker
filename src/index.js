const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {connectToDatabase, outputEverything} = require('./database.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-line global-require
if (require('electron-squirrel-startup')) { 
    app.quit();
}

let mainWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            //devTools: false,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools automatically on startup
    //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Initialize database
connectToDatabase();
// Print everything
outputEverything();


let addWindow;

ipcMain.on('addWindow', (event, args) => {
    if (args === 'close') {
        addWindow.close();
    } else if (args === 'create') {
        addWindow = new BrowserWindow({
            width: 500,
            height: 400,
            title: 'Add Card',
            webPreferences: {
                nodeIntegration: true,
            },
        });
        addWindow.loadFile('./src/addWindow/addWindow.html');
    }
});


ipcMain.on('addWindowInfo', (event, args) => {
    mainWindow.webContents.send("addWindowInfoMain", args);
});
