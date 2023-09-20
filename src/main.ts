const electron = require("electron");
const path = require("node:path");
const git_module = require("./git.ts");

const { app, BrowserWindow } = electron;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.ts"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("src/index.html");
};

app.on("ready", () => {
  createWindow();
  console.log(git_module.get_commit_info());

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
