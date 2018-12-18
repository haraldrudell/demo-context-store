/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { app } from 'electron'
import Parent from './Parent'

const layout = {
  url: 'http://localhost:3000',
  box: {x: 0, y: 100, width: 800, height: 500},
  viewUrl: 'https://hire.surge.sh',
}

const createWindow = () => Parent.ensureWindow(layout)
app.on('ready', createWindow)
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', createWindow)
