import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path"

let ctx: CanvasRenderingContext2D;

function doResize(window: BrowserWindow) {
    
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js')
        },
        // frame: false,
        autoHideMenuBar: true,
    })

    win.loadFile('./src/index.html');
    win.webContents.openDevTools();

    // win.on("resize", () => {doResize(win)} );
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });    
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});