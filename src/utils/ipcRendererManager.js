// ipcRendererManager.js
const { ipcRenderer } = require("electron");

// Define methods for IPC communication
const ipcRendererManager = {
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  listenToMain: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  showScreen: (screenName) => {
    ipcRenderer.send("show-screen", screenName);
  },
  showScreenWithData: (screenName, data) => {
    ipcRenderer.send("show-screen-with-data", { screenName, data });
  },
  listenToArgsForStoreWindow: (handler) => {
    ipcRenderer.on("args-to-store-window", (event, args) => {
      handler(args);
    });
  },
  showMessageBox: (options) => {
    ipcRenderer.invoke("showMessageBox", options);
  },
  showErrorBox: (message) => {
    ipcRenderer.invoke("showErrorBox", message);
  },
  submitInput: (inputValue) => {
    ipcRenderer.send("submit-input", inputValue);
  },
  openFolderDialog: () => {
    ipcRenderer.send("open-folder-dialog");
  },
  openTextInputWindow: () => {
    ipcRenderer.send("open-text-input-window");
  },
  openNewShortcutWindow: () => {
    ipcRenderer.send("open-new-shortcut-window");
  },

  waitForUpdatedInputValue: () => {
    return new Promise((resolve) => {
      ipcRenderer.once("inputValue-updated", (event, inputValue) => {
        resolve(inputValue);
      });
    });
  },
};

module.exports = ipcRendererManager;
