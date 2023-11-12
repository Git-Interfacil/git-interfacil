/* eslint-disable no-undef */
const electron = require("electron");
const path = require("node:path");
const { ipcMain, dialog, screen } = require("electron");

const { app, BrowserWindow } = electron;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      // DEV:
      devTools: true,
    },
  });

  // DEV:
  win.webContents.openDevTools();

  // options format:
  //
  //   const options = {
  //     type: "question",
  //     buttons: ["Cancel", "Yes, please", "No, thanks"],
  //     defaultId: 2,
  //     title: "Question",
  //     message: "Do you want to do this?",
  //     detail: "It does not really matter",
  //     checkboxLabel: "Remember my answer",
  //     checkboxChecked: true,
  //   };

  ipcMain.handle("showMessageBox", (e, options) => {
    dialog.showMessageBox(null, options);
  });

  ipcMain.handle("showErrorBox", (e, message) => {
    dialog.showErrorBox("Oops! Something went wrong!", message);
  });

  win.loadFile("src/index.html");

  ipcMain.on("submit-input", (event, inputValue) => {
    win.webContents.send("inputValue-updated", inputValue);
  });
};

function createTextInputWindow() {
  textInputWindow = new BrowserWindow({
    width: 300,
    height: 120,
    devTools: true,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  textInputWindow.loadFile("src/components/InputWindow/index.html");

  textInputWindow.on("closed", () => {
    textInputWindow = null;
  });
}

ipcMain.on("open-text-input-window", () => {
  createTextInputWindow();
});

app.on("ready", () => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (textInputWindow === null) {
    createTextInputWindow();
  }
});

const env = process.env.NODE_ENV || "development";
if (env === "development") {
  try {
    require("electron-reloader")(module);
    // eslint-disable-next-line no-empty
  } catch (_) {}
}
