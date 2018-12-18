/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import { BrowserWindow, ipcMain } from 'electron'

export default class Parent {
  constructor(layout) {
    const {url} = Object(layout)
    Object.assign(this, {url})
    ipcMain.on('url', (event, o) => console.log(`Elc receive url`, o) + this.navigate(this.parseO(o)))
    ipcMain.on('open', (event, o) => console.log(`Elc receive open`, o) + this.open(Object(o)))
    ipcMain.on('sessions', (event, o) => console.log(`Elc receive sessions`) +
      (event.returnValue = Object.keys(this.children).map(id => ({id}))))
    this.children = {}
    this.nextChild = 0

  }

  load() {
    const { url } = this
    const parent = this.parent = new BrowserWindow()
      .once('closed', () => this.parent = null)
    parent.loadURL(url) // ReactJS
  }

  open({url}) {
    const {parent, nextChild: id} = this
    if (!parent || !url || typeof url !== 'string') return
    const child = new BrowserWindow({ parent })
      .once('closed', () => this.removeChild(id))
    this.addChild(child)
    child.loadURL(url)
  }

  navigate({child, url}) {
    if (!child) return
    child.loadURL(url)
  }

  addChild(child) {
    const {parent} = this
    const id = this.nextChild++
    this.children[id] = child
    parent && parent.send('new', {id})
  }

  removeChild(id) {
    const {parent} = this
    delete this.children[id]
    parent && parent.send('remove', {id})
  }

  parseO = o => ({...o, child: this.getChild(Object(o).id)})

  getChild = id => this.children[id]

  static ensureWindow = layout => !Parent.w && (Parent.w = new Parent(layout)).load()
}
