const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
const SRC_DIR = 'excalidraw/build'

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  mainWindow.loadURL(url.format({
    pathname: 'index.html',    /* Attention here: origin is path.join(__dirname, 'index.html') */
    protocol: 'file',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', () => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7)    /* all urls start with 'file://' */
    const wholePath = `${__dirname}/${SRC_DIR}/${url}`
    callback({ path: path.normalize(wholePath) })
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})