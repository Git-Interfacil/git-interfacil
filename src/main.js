/* eslint-disable no-undef */
const electron = require("electron");
const path = require("node:path");
const git_module = require("./git.js");

const { app, BrowserWindow } = electron;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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

  win.loadFile("src/index.html");
};

app.on("ready", () => {
  createWindow();
  const repo = new git_module.Repository("."); // TODO let user choose path
  console.log(`HEAD = ${repo.get_repo_head()}`);
  console.log(repo.get_commit_info());

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const env = process.env.NODE_ENV || "development";
if (env === "development") {
  try {
    require("electron-reloader")(module);
    // eslint-disable-next-line no-empty
  } catch (_) {}
}
