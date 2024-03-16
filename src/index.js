const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

const sqlite3 = require('sqlite3').verbose();
const appDataPath = app.getPath('userData');
const db = new sqlite3.Database(`${appDataPath}/database.db`);

db.run(`
  CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY,
    topic TEXT UNIQUE,
    status TEXT,
    previousTime TIMESTAMP
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS subtopics (
    id INTEGER PRIMARY KEY,
    subtopic TEXT,
    topicID INTEGER,
    status TEXT,
    previousTime TIMESTAMP,
    UNIQUE(subtopic, topicID)
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS clock (
    id INTEGER PRIMARY KEY,
    topicID INTEGER,
    subtopicID INTEGER,
    project TEXT,
    time TEXT,
    date DATE
  )
`);


let mainWindow

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    minWidth: 800,
    minHeight: 700,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.once('ready-to-show', () => {
    if (app.isPackaged) {
      autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'programmingKyle',
        repo: 'clocker',
      });
      autoUpdater.checkForUpdatesAndNotify();
    }
  });  

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('auto-updater-callback', 'Checking for Update');
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('auto-updater-callback', 'Update Available');
});

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('auto-updater-callback', 'No Updates Available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('auto-updater-callback', 'Update Downloaded');
});

ipcMain.handle('restart-and-update', () => {
  ensureSafeQuitAndInstall();
});

function ensureSafeQuitAndInstall() {
  setImmediate(() => {
    app.removeAllListeners("window-all-closed")
    if (mainWindow != null) {
      mainWindow.close()
    }
    autoUpdater.quitAndInstall(false)
  })
}

ipcMain.handle('close-app', () => {
  app.quit();
});

let isMaximized;
ipcMain.handle('frame-handler', (req, data) => {
  if (!data || !data.request) return;
  switch(data.request){
    case 'Minimize':
      mainWindow.minimize();
      break;
    case 'Maximize':
      toggleMaximize();
      break;
    case 'Exit':
      mainWindow.close();
      break;
    }
});

function toggleMaximize(){
  if (isMaximized){
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
  isMaximized = !isMaximized;
}

//
//
//
//

function databaseHandler(request, query, params) {
  if (request === 'run') {
      return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
          if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                  // Handle unique constraint violation error
                  console.error('Error: Duplicate entry');
                  resolve('duplicate');
              } else {
                  // Handle other errors
                  console.error('Error:', err.message);
                  resolve(false); // Or reject(err) if you want to propagate the error
              }
          } else {
              resolve(true); // Operation successful
          }
      });
    });
  } else if (request === 'all') {
      return new Promise((resolve, reject) => {
          db.all(query, params, (err, rows) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(rows);
              }
          });  
      });
  } else {
      console.error('Invalid Database Request');
  }
}

ipcMain.handle('topic-handler', async (req, data) => {
  if (!data || !data.request) return;
  let result;
  switch(data.request) {
    case 'Add':
      result = await addTopicToDatabase(data.topicName);
      break;
    case 'Get':
      result = await getTopicsFromDatabase(data.status);
      break;
  }
  return result;
});

async function addTopicToDatabase(topicName){
  const sqlStatement = `INSERT INTO topics (topic, status, previousTime) VALUES (?, ?, CURRENT_TIMESTAMP)`;
  const params = [topicName, 'active'];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function getTopicsFromDatabase(status){
  const sqlStatement = `SELECT * FROM topics WHERE status = ?`;
  const params = [status];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

ipcMain.handle('subtopic-handler', async (req, data) => {
  if (!data || !data.request) return;
  let result;
  switch(data.request){
    case 'Add':
      result = await addSubtopic(data.subtopicName, data.topicID);
      break;
    case 'Get':
      result = await getSubtopics(data.status);
      break;
  }
  return result;
});

async function addSubtopic(subtopicName, topicID){
  const sqlStatement = `INSERT INTO subtopics (subtopic, topicID, status, previousTime) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
  const params = [subtopicName, topicID, 'active'];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function getSubtopics(status){
  const sqlStatement = `SELECT * FROM subtopics WHERE status = ?`;
  const params = [status];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

ipcMain.handle('log-time-handler', (req, data) => {
  if (!data) return;
  const sqlStatement = `INSERT INTO clock (topicID, subtopicID, project, time, date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
  const params = [data.topicID, data.subtopicID, data.project, data.time];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
});

ipcMain.handle('quick-times-handler', (req, data) => {
  if (!data || !data.request) return;
  let times;
  switch(data.request){
    case 'Total':
      times = getAllQuickTimes();
      break;
    case 'Monthly':
      break;
    case 'Weekly':
      break;
    case 'Today':
      break;
  }
  return times;
});

function getAllQuickTimes(){
  const sqlStatement = `SELECT * FROM clock`;
  const params = [];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

function getQuickTimes(timeFrame){
  console.log('Grab specific times');
}