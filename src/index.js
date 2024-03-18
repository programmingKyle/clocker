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

db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    project TEXT UNIQUE,
    previousTime TIMESTAMP
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

ipcMain.handle('log-time-handler', async (req, data) => {
  if (!data) return;
  const sqlStatement = `INSERT INTO clock (topicID, subtopicID, project, time, date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
  const params = [data.topicID, data.subtopicID, data.project, data.time];
  const result = databaseHandler('run', sqlStatement, params);

  const addTopic = await addProject(data.project);
  if (addTopic === 'duplicate'){
    updateProjectPreviousClock(data.project);
  }

  updateTopicPreviousClock(data.topicID);
  updateSubtopicPreviousClock(data.subtopicID);
  return result;
});

// This is used to change the previousClock variable in topic and subtopic tables
// This will update the order in which topics and subtopics are displayed
function updateTopicPreviousClock(id){
  const sqlStatement = `UPDATE topics SET previousTime = CURRENT_TIMESTAMP WHERE id = ?`;
  const params = [id];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

function updateSubtopicPreviousClock(id){
  const sqlStatement = `UPDATE subtopics SET previousTime = CURRENT_TIMESTAMP WHERE id = ?`;
  const params = [id];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

function updateProjectPreviousClock(name){
  const sqlStatement = `UPDATE projects SET previousTime = CURRENT_TIMESTAMP WHERE project = ?`;
  const params = [name];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

ipcMain.handle('quick-times-handler', async (req, data) => {
  if (!data || !data.request) return;
  let times;
  switch(data.request){
    case 'Total':
      times = await getAllQuickTimes();
      break;
    case 'Specific':
      times = await getSpecificTimes(data.timeFrame);
      break;
  }
  if (times){
    const calcTime = await calculateTotalTime(times);
    return calcTime;  
  } else {
    return;
  }
});

async function getAllQuickTimes(){
  const sqlStatement = `SELECT * FROM clock`;
  const params = [];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

async function getSpecificTimes(dayCount) {
  // Calculate the start date based on the dayCount
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (dayCount - 1));
  const formattedStartDate = startDate.toISOString().split('T')[0];

  // Construct the SQL statement to fetch entries within the specified timeframe
  const sqlStatement = `SELECT * FROM clock WHERE date >= ?`;
  const params = [formattedStartDate];
  
  // Execute the query
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}


async function calculateTotalTime(entries) {
  let totalTime = 0;

  entries.forEach(element => {
      const timeComponents = element.time.split(':');

      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);
      const seconds = parseInt(timeComponents[2], 10);
      const milliseconds = parseInt(timeComponents[3], 10);

      totalTime += hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  });
  totalTime /= 3600000;
  return totalTime.toFixed(1);
}


async function addProject(name){
  const sqlStatement = `INSERT INTO projects (project, previousTime) VALUES (?, CURRENT_TIMESTAMP)`;
  const params = [name];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}
