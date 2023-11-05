const {BrowserWindow, app, Menu, shell} = require('electron');
const path = require('path');
const { aborted } = require('util');

const menuItems = [
    {
        label : "Menu",
        submenu: [
            { label: "About"},
        ],
    },

    {
        label : "File",
        submenu: [
            { 
                label: "Learn More",
                click: () => {
                    shell.openExternal("https://facebook.com")
                }
            },
            { type: "separator"},
            { 
                label: "Exit",
                click: () => {
                    app.quit();
                }
            },
            { 
                role: "close",
            },
            { 
                label: "Load Window",
                click: () => {
                    const win2 = new BrowserWindow({
                        height: 300,
                        width: 400,
                        show: false,
                    });
                    
                    win2.loadURL("https://twynndyllyngs.netlify.app/")
                    win2.once('ready-to-show', () => win2.show())
                }
            },
    
        ],
    },
]

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu)

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1620,
        height: 920,
        webPreferences: {
            preload: path.join(__dirname, './main/preload.js')
        }
    })

    win.webContents.openDevTools()
    win.loadFile("./main/index.html")
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
    })
}) 

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') 
        app.quit()
})