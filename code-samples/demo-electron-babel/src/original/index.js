/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { app, BrowserWindow } from 'electron'
import path from 'path'

/*
files without a path are resolved agains app root
app root is where package.json is or the current directory
We need __dirname to determine the location of index.html
*/
if (typeof __dirname === undefined || !__dirname) throw new Error('__dirname not defined')

const layout = {
  file: path.join(__dirname, 'index.html'),
}

const createWindow = () => Window.ensureWindow(layout)
app.on('ready', createWindow)
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', createWindow)

class Window {
  constructor(layout) {
    const {file} = Object(layout)
    Object.assign(this, {file})
  }

  load() {
    const { file } = this

    const w = this.window = new BrowserWindow() // default size 800wx600h
      .once('closed', () => this.window = null)
    w.loadFile(file) // return value: true
  }

  static ensureWindow = layout => !Window.w && (Window.w = new Window(layout)).load()
}
