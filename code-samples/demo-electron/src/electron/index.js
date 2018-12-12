/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const {app, BrowserWindow, BrowserView, ipcMain } = require('electron')

const layout = {
  size: {width: 800, height: 600},
  url: 'http://localhost:3000',
  box: {x: 0, y: 100, width: 800, height: 500},
  viewUrl: 'https://hire.surge.sh',
}

const createWindow = () => Window.ensureWindow(layout)
app.on('ready', createWindow)
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', createWindow)

class Window {
  // TODO static static w

  constructor(layout) {
    const {size, url, box, viewUrl} = Object(layout)
    Object.assign(this, {size, url, box, viewUrl})
    ipcMain.on('url', (event, url) => this.navigate(url))
  }

  load() {
    const {size, url, box, viewUrl} = this

    // top part of widow is React
    const w = this.window = new BrowserWindow(size)
    w.loadURL(url)
    w.once('closed', () => this.window = null)

    // view at bottom
    const view = this.view = new BrowserView({webPreferences: {nodeIntegration: false}})
    w.setBrowserView(view)
    view.setBounds(box)
    this.navigate(viewUrl)
  }

  navigate(url) {
    return this.view && this.view.webContents.loadURL(url)
  }

  // TODO static ensureWindow
}
Window.ensureWindow = layout => !Window.w && (Window.w = new Window(layout)).load()
