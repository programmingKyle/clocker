const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    frameHandler: (data) => ipcRenderer.invoke('frame-handler', data),
    topicHandler: (data) => ipcRenderer.invoke('topic-handler', data),
    subtopicHandler: (data) => ipcRenderer.invoke('subtopic-handler', data),
    logTimeHandler: (data) => ipcRenderer.invoke('log-time-handler', data),
    quickTimesHandler: (data) => ipcRenderer.invoke('quick-times-handler', data),
    projectHandler: (data) => ipcRenderer.invoke('project-handler', data),
    specificQuickTimes: (data) => ipcRenderer.invoke('specific-quick-times', data),
    graphHandler: (data) => ipcRenderer.invoke('graph-handler', data),
});

contextBridge.exposeInMainWorld('autoUpdater', {
    autoUpdaterCallback: (callback) => {
        ipcRenderer.on('auto-updater-callback', (_, status) => {
            callback(status);
        });
    },
    restartAndUpdate: () => ipcRenderer.invoke('restart-and-update'),
    closeApp: () => ipcRenderer.invoke('close-app'),
});