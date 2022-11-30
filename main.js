const CHK_EMPTY = 1,
  CHK_REPO = 2,
  INIT = 3,
  CLONE = 4;

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

async function gix(cmd, ...args) {
  switch(cmd) {
    case CHK_EMPTY:
      const dir = fs.opendirSync(args[0]);
      if ((await dir[Symbol.asyncIterator]().next()).done)
        return true;
      else return false;
    case CHK_REPO:
      fs.accessSync(path.join(args[0], '.git'), fs.constants.F_OK);
      return;
    case INIT:
      if (spawnSync('git', ['init', args[0]]).status)
        throw new Error();
      else return true;
    case CLONE:
      if (spawnSync('git', ['clone', '--', args[0], args[1]]).status)
        throw new Error();
      else return true;
      return;
      /*
  case INIT:
    // identifier
    // TODO check path existence & mkdir
    // 0: path
    result = spawnSync('git', ['init', args[0]])
    break
  case 'clone':
    // 0: repo, 1: path
    // TODO check path e & mkdir
    result = spawnSync('git', ['clone', args[0], args[1]])
    break
  case 'sync':
    break
  case 'clean':
    break
  case 'checkout':
    break
  case 'commit':
    break
    */
    default:
      throw new Error();
  }
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('gix', (eve, ...args) => gix(...args));
  createWindow()
  app.on('active', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
