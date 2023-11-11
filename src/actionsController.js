const actionButtonsHandlers = {
  undo: () => {
    console.log("Undo button clicked");
    // #TO-DO: Add your code here for the Undo button action
  },
  redo: () => {
    console.log("Redo button clicked");
    // #TO-DO: Add your code here for the Redo button action
  },
  merge: () => {
    console.log("Merge button clicked");
    // #TO-DO: Add your code here for the Merge button action
  },
  pull: () => {
    console.log("Pull button clicked");
    // #TO-DO: Add your code here for the Pull button action
  },
  add: (repo, files) => {
    try {
      const result = repo.add_files(files);
      console.log(result);
    } catch (error) {
      console.error("Error during add: ", error);
    }
  },
  commit: (repo, message) => {
    try {
      repo.commit(message);
    } catch (error) {
      console.error("Error during commit: ", error);
    }
  },
  push: async (repo, remoteBranch) => {
    console.log("Push button clicked");
    if (remoteBranch) {
      const remote = "origin";
      try {
        const changedFiles = await repo.get_changed_files();
        actionButtonsHandlers.add(repo, changedFiles);
        const message = "teste commit";
        actionButtonsHandlers.commit(repo, message);

        const result = await repo.push(remote, remoteBranch);

        if (!result) {
          console.log("No changes to push");
        } else {
          console.log("result", result);
        }
      } catch (error) {
        console.error("Error during push:", error);
      }
    } else {
      console.error("Unable to get the current branch.");
    }
  },
  branch: () => {
    console.log("Branch button clicked");
    // #TO-DO: Add your code here for the Branch button action
  },
  stash: () => {
    console.log("Stash button clicked");
    // #TO-DO: Add your code here for the Stash button action
  },
  pop: () => {
    console.log("Pop button clicked");
    // #TO-DO: Add your code here for the Pop button action
  },
};

module.exports = actionButtonsHandlers;
