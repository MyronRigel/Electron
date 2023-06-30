import { app, BrowserWindow, BrowserView, ipcMain, IpcMainEvent } from 'electron'
import path from 'path'


process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const dataFromView: Array<IDataFromView> = []

interface IDataFromView {
   selectedText: string,
   header: string,
   url: string
}

function createWindow() {
   const mainWindow = new BrowserWindow({
      webPreferences: {
         contextIsolation: true,
         preload: path.join(__dirname, 'preload.js'),
         nodeIntegration: true,
      },
   })

   mainWindow.setBounds({width: 1200, height: 800})

   // mainWindow.webContents.openDevTools()

   mainWindow.webContents.on('did-finish-load', () => {
      win?.webContents.send('main-process-message', (new Date).toLocaleString())
   })

   if (VITE_DEV_SERVER_URL) {
      mainWindow.webContents.loadURL(VITE_DEV_SERVER_URL)
   } else {
      mainWindow.webContents.loadFile(path.join(process.env.DIST, 'index.html'))
   }

   ipcMain.on('open-link', (event: IpcMainEvent, url) => {
      const newBrowserView = new BrowserView({
         webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'additionalPreload.js'),
            nodeIntegration: true,
         }
      })
      mainWindow.addBrowserView(newBrowserView)

      const windowBounds = mainWindow.getBounds()
      const viewWidth = 400
      const viewHeight = windowBounds.height - 100
      const viewX = windowBounds.width - viewWidth
      const viewY = 50
      newBrowserView.setBounds({x: viewX, y: viewY, width: viewWidth, height: viewHeight})

      // newBrowserView.webContents.openDevTools()
      newBrowserView.webContents.loadURL(url)
   })

   ipcMain.on('selected-text-from-view', (event: IpcMainEvent, info: IDataFromView) => {
      dataFromView.push(info)

      console.log(dataFromView)
   })

   ipcMain.handle('info-from-view', () => {
      return dataFromView
   })
}

app.on('window-all-closed', () => {
   win = null
})

app.whenReady().then(createWindow)
