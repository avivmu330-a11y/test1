import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { readFileSync } from 'fs';
import { schemExport, worldExport } from '../common/exporters/worldExporter';
import { Plan } from '../types';

const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('export:schem', async (_event, plan: Plan) => {
  const buffer = schemExport(plan);
  return buffer.toString('base64');
});

ipcMain.handle('export:world', async (_event, plan: Plan, options: { bedrock?: boolean }) => {
  const archive = worldExport(plan, options);
  return archive.toString('base64');
});

ipcMain.handle('load:example', async (_event, name: string) => {
  const examplePath = path.join(app.getAppPath(), 'tests/fixtures', name);
  return readFileSync(examplePath, 'utf-8');
});
