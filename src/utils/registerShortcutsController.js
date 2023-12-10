/* eslint-disable no-undef */

const { globalShortcut } = require("electron");
const fs = require("fs");
const path = require("path");
const actionButtonsHandlers = require("../screens/Repository/actionsController");

function registerShortcutsFromJSON(args) {
  const filePath = path.join(
    __dirname,
    "..",
    "screens",
    "Home",
    "Tabs",
    "Shortcuts",
    "shortcutsData.json",
  );

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading shortcuts file:", err);
      return;
    }

    try {
      const shortcuts = JSON.parse(data);

      shortcuts.forEach((shortcut) => {
        const { action, keyCombination } = shortcut;
        let formattedKeyCombination;
        if (keyCombination === "Ctrl +") {
          formattedKeyCombination = "Ctrl+=";
        } else {
          formattedKeyCombination = keyCombination.replace(/\s/g, "+");
        }
        const shortcutRegistered = globalShortcut.register(
          formattedKeyCombination,
          () => {
            executeAction(action, args);
          },
        );

        if (!shortcutRegistered) {
          console.log(`Shortcut registration for ${keyCombination} failed`);
        }
      });
    } catch (parseError) {
      console.error("Error parsing shortcuts JSON:", parseError);
    }
  });
}
function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

// TODO: Add current functions to actions
function executeAction(action, args) {
  switch (action) {
    case "Increase Text Size":
      console.log("Increase text size");
      break;
    case "Decrease Text Size":
      console.log("Decrease text size");
      break;
    case "Undo":
      actionButtonsHandlers.undo();
      console.log("Undo");
      break;
    case "Redo":
      console.log("Redo");
      break;
    case "Merge":
      console.log("Merge");
      break;
    case "Pull":
      console.log("Pull");
      break;
    case "Push":
      console.log("Push");
      actionButtonsHandlers.push(args.repo, args.currentBranchId);
      break;
    case "Branch":
      console.log("Branch");
      break;
    case "Stash":
      console.log("Stash");
      break;
    case "Pop":
      console.log("Pop");
      break;
    case "Add":
      console.log("Add");
      actionButtonsHandlers.add(args.repo);
      break;
    case "Commit":
      console.log("Commit");
      actionButtonsHandlers.commit(args.repo);
      break;
    default:
      console.log("Action not recognized");
      break;
  }
}

module.exports = { registerShortcutsFromJSON, unregisterShortcuts };
