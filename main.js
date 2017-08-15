const  electron  = require('electron')
const {app, globalShortcut, ipcMain, Menu} = electron
// Module to control application life.
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const appMenu = require('./menu')
const path = require('path')
const url = require('url')
let willQuitApp = false;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  Menu.setApplicationMenu(appMenu);
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 1080,
      height: 660,
      minWidth: 660,
      minHeight: 660,
      webPreferences: {
          preload: path.join(__dirname, 'browser.js'),
          nodeIntegration: false,
          plugins: true
      },
      titleBarStyle: 'hidden',
      // titleBarStyle: 'hiddenInset',
      // titleBarStyle: 'customButtonsOnHover',
      // transparent: true,
      frame: false,
      icon: path.join(__dirname, 'build/icon.icns')
  })

  mainWindow.loadURL('https://douban.fm');

    mainWindow.webContents.on('did-finish-load', ()=>{
        let isFocus = mainWindow.isVisible(),
            json = JSON.stringify({isFocus: isFocus}),
            operateObj = {
                'CommandOrControl+0': 'window.PubSub.publish("next")',
                'CommandOrControl+9': 'window.PubSub.publish("prev")',
                'CommandOrControl+7': `window.PubSub.publish("toggleLike",${json})`,
                'CommandOrControl+8': 'window.PubSub.publish("togglePlay")',
            }

        let shortcut = (key, code) => {
            globalShortcut.register(key, () => {
                mainWindow.webContents.executeJavaScript(code);
            })
        }
        for(let k in operateObj){
            if(operateObj.hasOwnProperty(k)){
                shortcut(k, operateObj[k])
            }
        }

        ipcMain.on('urlchange', function(event){
            event.sender.send('url', {
                canGoback: mainWindow.webContents.canGoBack()
            });

        })
        ipcMain.on('goback', function(event){
            if(mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack();
        })


    });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

      // Emitted when the window is closed.
      mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
         mainWindow = null
      })

    mainWindow.on('close', (e) => {
        if (willQuitApp) {
            /* the user tried to quit the app */
            mainWindow = null;
        } else {
            /* the user only tried to close the window */
            e.preventDefault();
            mainWindow.hide();
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
      // Unregister all shortcuts.
      app.quit()
  }
})

app.on('before-quit', () => willQuitApp = true);

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) {
  //   createWindow()
  // }
    mainWindow.show()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
