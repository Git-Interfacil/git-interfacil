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
  showMessageBox: async (options) => {
    ipcRenderer.send("showMessageBox", options);

    const response = await new Promise((resolve) => {
      ipcRenderer.once("message-response", (_, response) => {
        resolve(response);
      });
    });
    return response;
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

  sendCurrentTab: (currentTab, repo) => {
    ipcRenderer.send("current-tab", currentTab, repo);
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
