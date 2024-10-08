const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { autoUpdater } = require('electron-updater');

const sqlite3 = require('sqlite3').verbose();
const appDataPath = app.getPath('userData');
const optionsFile = `${appDataPath}\\options.json`;
const db = new sqlite3.Database(`${appDataPath}/database.db`);

let isClockActive = false;

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
    topicID INTEGER,
    subtopicID INTEGER,
    project TEXT,
    previousTime TIMESTAMP,
    UNIQUE(topicID, subtopicID, project)
  )
`);

let mainWindow

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
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

  mainWindow.on('close', (event) => {
    if (isClockActive){
      event.preventDefault();
    } else {
      app.quit();
    }
  });

  if (!fs.existsSync(optionsFile)){
    await saveOptions(false, 'Daily', 1, 0);
  }  

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

ipcMain.handle('toggle-clock-active', () => {
  isClockActive = !isClockActive;
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
                  resolve('duplicate');
              } else {
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
  } else if (request === 'get'){
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, rows) => {
        if (err){
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }
  else {
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
    case 'Edit':
      result = await editTopic(data.topicID, data.newName);
      break;
    case 'Delete':
      result = await deleteTopic(data.topicID);
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

async function editTopic(topicID, newName){
  const sqlStatement = `UPDATE topics SET topic = ? WHERE id = ?`;
  const params = [newName, topicID];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function deleteTopic(topicID){
  let deleteResult;

  const topicDeleteSql = `DELETE FROM topics WHERE id = ?`;
  const params = [topicID];
  deleteResult = databaseHandler('run', topicDeleteSql, params);

  const topicSubSql = `DELETE FROM subtopics WHERE topicID = ?`;
  deleteResult = databaseHandler('run', topicSubSql, params);

  const topicProjSql = `DELETE FROM projects WHERE topicID = ?`;
  deleteResult = databaseHandler('run', topicProjSql, params);

  const topicClockSql = `DELETE FROM clock WHERE topicID = ?`
  deleteResult = databaseHandler('run', topicClockSql, params);

  return deleteResult;
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
    case 'Edit':
      result = await editSubtopic(data.subtopicID, data.newName);
      break;
    case 'Delete':
      result = await deleteSubtopic(data.subtopicID);
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

async function editSubtopic(subtopicID, newName){
  const sqlStatement = `UPDATE subtopics SET subtopic = ? WHERE id = ?`;
  const params = [newName, subtopicID];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function deleteSubtopic(subtopicID){
  let deleteResult;
  const params = [subtopicID];
  const subtopicSubSql = `DELETE FROM subtopics WHERE id = ?`;
  deleteResult = databaseHandler('run', subtopicSubSql, params);

  const subtopicProjSql = `DELETE FROM projects WHERE subtopicID = ?`;
  deleteResult = databaseHandler('run', subtopicProjSql, params);

  const subtopicClockSql = `DELETE FROM clock WHERE subtopicID = ?`
  deleteResult = databaseHandler('run', subtopicClockSql, params);

  return deleteResult;
}


ipcMain.handle('log-time-handler', async (req, data) => {
  if (!data) return;
 
  const sqlStatement = `
    INSERT INTO clock (topicID, subtopicID, project, time, date) 
    VALUES (?, ?, ?, ?, datetime("now", "localtime"))
  `;
  
  const params = [data.topicID, data.subtopicID, data.project, data.time];
  const result = databaseHandler('run', sqlStatement, params);
  const addProjectResult = await addProject(data.topicID, data.subtopicID, data.project);
  if (addProjectResult === 'duplicate') {
    const projectID = await getProjectID(data.topicID, data.subtopicID, data.project);
    updateProjectPreviousClock(projectID);
  }

  updateTopicPreviousClock(data.topicID);
  updateSubtopicPreviousClock(data.subtopicID);
  return result;
});

async function getProjectID(topicID, subtopicID, projectName){
  const sqlStatement = `SELECT id FROM projects WHERE topicID = ? AND subtopicID = ? AND project = ?`;
  const params = [topicID, subtopicID, projectName];
  const result = await databaseHandler('get', sqlStatement, params);
  return result.id;
}

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

function updateProjectPreviousClock(projectID){
  const sqlStatement = `UPDATE projects SET previousTime = CURRENT_TIMESTAMP WHERE id = ?`;
  const params = [projectID];
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
    case 'Project':
      times = await getProjectTime(data.topicID, data.subtopicID, data.project);
      break;
    case 'Topic':
      times = await getTopicTime(data.topicID);
      break;
    case 'Subtopic':
      times = await getSubtopicTime(data.topicID, data.subtopicID);
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
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (dayCount - 1));
  const formattedStartDate = startDate.toISOString().split('T')[0];

  const sqlStatement = `SELECT * FROM clock WHERE date >= ?`;
  const params = [formattedStartDate];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getProjectTime(topic, subtopic, project) {
  const sqlStatement = `SELECT * FROM clock WHERE topicID = ? AND subtopicID = ? AND project = ?`;
  const params = [topic, subtopic, project];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getTopicTime(topic){
  const sqlStatement = `SELECT * FROM clock WHERE topicID = ?`;
  const params = [topic];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getSubtopicTime(topic, subtopic){
  const sqlStatement = `SELECT * FROM clock WHERE topicID = ? AND subtopicID = ?`;
  const params = [topic, subtopic];
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

async function addProject(topic, subtopic, name){
  const sqlStatement = `INSERT INTO projects (topicID, subtopicID, project, previousTime) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
  const params = [topic, subtopic, name];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

ipcMain.handle('project-handler', async (req, data) => {
  if (!data || !data.request) return;
  switch (data.request){
    case 'Get':
      const projects = await getProjects();
      return projects;
    case 'Edit':
      await editProject(data.projectID, data.newName);
      break;
    case 'Delete':
      await deleteProject(data.topicID, data.subtopicID, data.projectName);
      break;
  }
});

async function getProjects(){
  const sqlStatement = `SELECT * FROM projects`;
  const params = [];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

async function deleteProject(topicID, subtopicID, projectName){
  const clockSqlStatement = `DELETE FROM clock WHERE topicID = ? AND subtopicID = ? AND project = ?`;
  const params = [topicID, subtopicID, projectName];
  const clockResult = databaseHandler('run', clockSqlStatement, params);

  const projectSqlStatement = `DELETE FROM projects WHERE topicID = ? AND subtopicID = ? AND project = ?`
  const projectResult = databaseHandler('run', projectSqlStatement, params);

  return projectResult, clockResult;

}

async function editProject(projectID, newName){
  const sqlStatement = `UPDATE projects SET project = ? WHERE id = ?`;
  const clockSqlStatement = `UPDATE clock SET project WHERE id = ?`; // not sure why i made the table like this...i'm too deep now. I hope someone finds this.
  const params = [newName, projectID];
  const result = databaseHandler('run', sqlStatement, params);
  const clockResult = databaseHandler('run', clockSqlStatement, params);

  return result, clockResult;
}

ipcMain.handle('specific-quick-times', async (req, data) => {
  if (!data || !data.request) return;
  let times;
  switch (data.request){
    case 'Total':
      times = await getSpecificQTTotal(data.subject, data.id);
      break;
    case 'Specific':
      times = await getSpecificQTTime(data.subject, data.id, data.timeFrame);
      break;
  }
  if (times){
    const calcTime = await calculateTotalTime(times);
    return calcTime;  
  } else {
    return;
  }
});

async function getSpecificQTTotal(subject, id){
  const sqlStatement = `SELECT * FROM clock WHERE ${subject+'ID'} = ?`;
  const params = [id];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getSpecificQTTime(subject, id, dayCount){
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (dayCount - 1));
  const formattedStartDate = startDate.toISOString().split('T')[0];

  const sqlStatement = `SELECT * FROM clock WHERE ${subject+'ID'} = ? AND date >= ?`;
  const params = [id, formattedStartDate];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

ipcMain.handle('graph-month-handler', async (req, data) => {
  if (!data || !data.request) return;
  let values;
  switch(data.request){
    case 'GetMonth':
      values = await getSubjectTimes(30);
      break;
    case 'GetTopicMonth':
      values = getSpecificSubjectTimes('topic', 30, data.id);
      break;
    case 'GetSubtopicMonth':
      values = getSpecificSubjectTimes('subtopic', 30, data.id);
      break;
  }
  return values;
});

async function getSubjectTimes(dayCount) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (dayCount - 1));
  const formattedStartDate = startDate.toISOString().split('T')[0];

  const sqlStatement = `SELECT * FROM clock WHERE date >= ?`;
  const params = [formattedStartDate];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getSpecificSubjectTimes(scope, dayCount, id){
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (dayCount - 1));
  const formattedStartDate = startDate.toISOString().split('T')[0];

  const sqlStatement = `SELECT * FROM clock WHERE date >= ? AND ${scope}ID = ?`;
  const params = [formattedStartDate, id];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
};

ipcMain.handle('graph-annual-handler', async (req, data) => {
  if (!data || !data.request) return;
  let values;
  switch(data.request){
    case 'GetAnnual':
      values = await getAnnualSubjectTime();
      break;
    case 'GetTopicAnnual':
      values = getSpecificAnnualTimes('topic', data.id);
      break;
    case 'GetSubtopicAnnual':
      values = getSpecificAnnualTimes('subtopic', data.id);
      break;
  }
  return values;
});

async function getAnnualSubjectTime(){
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const formatedDate = startDate.toISOString().split('T')[0];
  const sqlStatement = 
  `SELECT *
  FROM clock
  WHERE date >= ?`;
  const params = [formatedDate];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getSpecificAnnualTimes(scope, id){
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const formatedDate = startDate.toISOString().split('T')[0];

  const sqlStatement = 
  `SELECT *
  FROM clock
  WHERE date >= ?
  AND ${scope}ID = ?`;
  const params = [formatedDate, id];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

ipcMain.handle('graph-compare-handler', async (req, data) => {
  if (!data || !data.request) return;
  let values;
  switch(data.request){
    case 'All':
      values = await getWeeklyCompareTimes();
      break;
    case 'Topic':
      values = getSpecificCompareTimes('topic', data.id);
      break;
    case 'Subtopic':
      values = getSpecificCompareTimes('subtopic', data.id);
      break;
  }
  return values;
});

async function getSpecificCompareTimes(scope, id){
  const today = new Date();
  const thisWeek = [];
  const lastWeek = [];

  for (let i = 0; i < 14; i++){
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    let formatedDate = date.toISOString().split('T')[0];
    let timeData = await getSpecificCompareData(formatedDate, scope, id);
    let time = timeData.length > 0 ? timeData[0].total : 0;
    if (i < 7){
      thisWeek.push({ date: formatedDate, time: time });
    } else {
      lastWeek.push({ date: formatedDate, time: time });
    }
  }
  return {thisWeek, lastWeek}
}

async function getSpecificCompareData(formatedDate, scope, id){
  const sqlStatement = 
  `SELECT
    SUM(time) AS total
  FROM clock
  WHERE DATE(date) = ?
  AND ${scope}ID = ?
  GROUP BY DATE(date)`;
  const params = [formatedDate, id];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getWeeklyCompareTimes(){
  const sqlStatement = 
  `SELECT *
  FROM clock
  WHERE DATE(date) >= DATE('now', '-14 days')`;
  const params = [];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

ipcMain.handle('options-handler', async (req, data) => {
  if (!data || !data.request) return;
  switch(data.request){
    case 'Save':
      await saveOptions(data.isEnabled, data.interval, data.hour, data.minute);
      break;
    case 'View':
      const results = await viewOptions();
      return results;
  }
});

async function viewOptions(){
  return new Promise((resolve, reject) => {
    fs.readFile(optionsFile, 'utf-8', (err,data) => {
      if (err){
        reject(err);
      } else {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      }
    });
  });
}

async function saveOptions(isEnabled, interval, hour, minute){
  const settings = {
    progressBarSettings: {
      isEnabled: isEnabled,
      interval: interval,
      hour: hour,
      minute: minute
    }
  };

  const jsonSettings = JSON.stringify(settings, null, 2);

  fs.writeFile(optionsFile, jsonSettings, (err) => {
    if (err){
      console.error(err);
    }
  })
}

ipcMain.handle('progress-bar-handler', async (req, data) => {
  if (!data) return;
  const timeFrame = () => {
    let number;
    switch (data.interval){
      case 'Daily':
        number = 1;
        break;
      case 'Weekly':
        number = 7;
        break;
      case 'Monthly':
        number = 30;
        break;
      case 'Annual':
        number = 365;
        break;
    }
    return number;
  }

  const timeFrameNumber = timeFrame();

  let times;
  times = await getSpecificTimes(timeFrameNumber);
  if (times){
    const calcTime = await calculateTotalTime(times);
    return calcTime;  
  } else {
    return;
  }
});