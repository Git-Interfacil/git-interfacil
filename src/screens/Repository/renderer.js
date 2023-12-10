/* eslint-disable no-undef */
const constants = require("./constants.js");
const git_module = require("./git.js");
const RepoSelector = require("./RepoSelector.js");
const CanvasController = require("./controllers/canvasController.js");
const RendererElements = require("./rendererElements.js");
const RendererListeners = require("./rendererListeners.js");
const Commit = require("./commit.js");
const Branch = require("./branch.js");

class RepositoryRenderer {
  #head;
  #commits;
  #branches;
  #activeBranches;
  #activeChangedFiles;
  #rendererElements;
  #canvasController;

  constructor(commits, head, canvasController, rendererElements) {
    this.#head = head;
    this.#commits = this.#formatCommits(commits);
    this.#branches = this.#generateAllBranches();
    this.#activeBranches = this.branches.map(({ id }) => id);
    this.#activeChangedFiles = [];

    this.#rendererElements = rendererElements;
    this.#canvasController = canvasController;

    this.#setCanvasSize();
    this.#calculateCommitsPositionsAndColors();
  }

  get commits() {
    return this.#commits;
  }

  get branches() {
    return this.#branches;
  }

  get rendererElements() {
    return this.#rendererElements;
  }

  #formatCommits(commits) {
    commits.sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    );

    const formattedCommits = [];
    commits.forEach(({ id, message, createdAt, branchId, parents, author }) => {
      const newCommit = new Commit(
        id,
        message,
        createdAt,
        branchId,
        parents,
        author,
      );

      formattedCommits.push(newCommit);
    });
    return formattedCommits;
  }

  #generateAllBranches() {
    const branches = [];
    this.#commits.forEach(({ branchId }, ind) => {
      let branch = branches.find(({ id }) => id === branchId);
      if (!branch) {
        let x_branch = (branches.length + 1) * constants.COLUMN_WIDTH;
        let y_branch = (ind + 1) * constants.LINE_HEIGHT;
        branch = new Branch(
          branchId,
          { x: x_branch, y: y_branch },
          constants.COLORS[branches.length],
        );
        branches.push(branch);
      }
    });
    return branches;
  }

  #setCanvasSize() {
    const filteredCommits = this.#commits.filter(({ branchId }) =>
      this.#activeBranches.includes(branchId),
    );

    const width = constants.COLUMN_WIDTH * (this.#activeBranches.length + 1);
    const height = constants.LINE_HEIGHT * (filteredCommits.length + 1);
    this.#canvasController.setDimensions(width, height);
  }

  #repositionBranches() {
    const filteredCommits = this.#commits.filter(({ branchId }) =>
      this.#activeBranches.includes(branchId),
    );

    filteredCommits.forEach(({ branchId }, ind) => {
      const branch = this.#branches.find((branch) => branch.id === branchId);
      branch.position_y = (ind + 1) * constants.LINE_HEIGHT;
    });

    let ind = 0;
    this.branches.forEach((branch) => {
      if (this.#activeBranches.includes(branch.id)) {
        branch.position_x = (ind + 1) * constants.COLUMN_WIDTH;
        ind++;
      }
    });

    this.#calculateCommitsPositionsAndColors();
    this.#setCanvasSize();
  }

  drawBranches() {
    this.#canvasController.clearCanvas();
    this.#repositionBranches();
    const filteredCommits = this.#commits.filter(({ branchId }) =>
      this.#activeBranches.includes(branchId),
    );

    this.#drawConnections(filteredCommits);
    filteredCommits.forEach((commit) => {
      this.#canvasController.drawCommit(
        commit.position,
        commit.color,
        this.#head == commit.id,
      );
    });
  }

  #calculateCommitsPositionsAndColors() {
    const filteredCommits = this.#commits.filter(({ branchId }) =>
      this.#activeBranches.includes(branchId),
    );

    filteredCommits.forEach((commit, ind) => {
      const parentBranch = this.#branches.find(
        ({ id }) => id === commit.branchId,
      );

      const pos_x = parentBranch.position.x;
      const pos_y = (ind + 1) * constants.LINE_HEIGHT;

      commit.position_x = pos_x;
      commit.position_y = pos_y;
      commit.color = parentBranch.color;
    });
  }

  #drawConnections(commits) {
    commits.forEach((commit) => {
      commit.parents.forEach((parent) => {
        const parentCommit = commits.find(({ id }) => parent.startsWith(id));

        if (parentCommit) {
          const parentBranch = this.#branches.find(
            ({ id }) => id === parentCommit.branchId,
          );

          this.#canvasController.drawBezierCurve(
            commit.position,
            parentCommit.position,
            10,
            parentBranch.color,
          );
        }
      });
    });
  }

  fillMessages() {
    this.#rendererElements.clearMessages();
    const filteredCommits = this.#commits.filter(({ branchId }) =>
      this.#activeBranches.includes(branchId),
    );

    this.#rendererElements.fillMessages(filteredCommits, this.branches);
  }

  fillLocalBranches() {
    this.#rendererElements.clearLocalBranches();
    this.#rendererElements.fillLocalBranches(this.#branches);
  }

  fillChangedFiles(changedFiles) {
    this.#rendererElements.clearChangedFiles();
    this.#rendererElements.fillChangedFiles(changedFiles);
  }

  activateBranch(branchId) {
    this.#activeBranches.push(branchId);
  }

  deactivateBranch(branchId) {
    this.#activeBranches = this.#activeBranches.filter((id) => id !== branchId);
  }

  activateChangedFile(fileId) {
    this.#activeChangedFiles.push(fileId);
  }

  deactivateChangedFile(fileId) {
    this.#activeChangedFiles = this.#activeChangedFiles.filter(
      (f) => f !== fileId,
    );
  }
}

function loadRepoClient(repo) {
  const commits = repo.get_commit_info();
  const changedFiles = repo.get_changed_and_untracked_files();
  const head = repo.get_repo_head();

  const headCommit = commits.find((commit) => head.startsWith(commit.id));
  const currentBranchId = headCommit ? headCommit.branchId : null;

  const canvas = document.querySelector("canvas");
  const canvasController = new CanvasController(canvas);

  const sidebar = document.getElementById("sidebar");
  const actionsbar = document.getElementById("actions");

  const messages = document.getElementById("messages");
  const localBranches = document.getElementById("localList");
  const localBranchesCount = document.getElementById("localCount");
  const changedFilesList = document.getElementById("changedList");
  const changedFilesCount = document.getElementById("changedCount");
  const rendererElements = new RendererElements(
    messages,
    localBranches,
    localBranchesCount,
    changedFilesList,
    changedFilesCount,
  );

  const repositoryRenderer = new RepositoryRenderer(
    commits,
    head,
    canvasController,
    rendererElements,
  );

  repositoryRenderer.fillLocalBranches();
  repositoryRenderer.fillChangedFiles(changedFiles);
  repositoryRenderer.fillMessages(messages);
  repositoryRenderer.drawBranches();

  const sidebarDropdowns = sidebar.querySelectorAll(".dropdown");
  const actionsbarButtons = actionsbar.querySelectorAll(".button");

  const listener = new RendererListeners(
    repositoryRenderer,
    sidebarDropdowns,
    actionsbarButtons,
  );

  listener.addListenersToSidebar();
  listener.addListenersToActionsBar(repo, currentBranchId);
  listener.addListenersToLocalBranchesCheckboxes();
  listener.addListenersToChangedFilesCheckboxes();
}

function handleStoreWindowArgs(path) {
  const initialRepo = new git_module.Repository(path);
  loadRepoClient(initialRepo);
  const commits = initialRepo.get_commit_info();
  const head = initialRepo.get_repo_head();
  const headCommit = commits.find((commit) => head.startsWith(commit.id));
  const currentBranchId = headCommit ? headCommit.branchId : null;
  main();
  return { repo: initialRepo, currentBranchId: currentBranchId };
}

function main() {
  const repoSelector = new RepoSelector();

  document.getElementById("repoSelector").addEventListener("change", () => {
    const repo = new git_module.Repository(repoSelector.getDirPath());
    loadRepoClient(repo);
  });
}

module.exports = { main, handleStoreWindowArgs };
