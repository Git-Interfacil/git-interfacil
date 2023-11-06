const execSync = require("child_process").execSync;
const formatStr =
  '{"id":"%h","author":"%an","message":"%s","createdAt":"%aI"},';

class Repository {
  update_repo_path(path) {
    this.path = path;
  }

  constructor(path) {
    this.update_repo_path(path);
  }

  get_repo_head() {
    return this.shell_exec("git rev-parse HEAD");
  }

  get_commit_info() {
    let commits = this.shell_exec(
      `git log --branches --format='format:${formatStr}'`,
    );
    // note that we must remove trailing comma before the closing bracket
    commits = JSON.parse("[" + commits.slice(0, -1) + "]");
    for (let i = 0; i < commits.length; i++) {
      let commitHash = commits[i]["id"];
      let branchName = this.shell_exec(
        `git branch --format="%(refname:short)" --contains ${commitHash}`,
      ).split("\n")[0];
      commits[i]["branchId"] = branchName;
    }
    return commits;
  }

  get_changed_files() {
    let outputLines = this.shell_exec(`git status --porcelain`).split("\n");
    let changedFiles = [];
    for (let i = 0; i < outputLines.length; i++) {
      let fields = outputLines[i].trim().split(" ");
      if (fields[0] == "M") {
        changedFiles.push(fields[1]);
      }
    }
    return changedFiles;
  }

  // receive array with file names
  add_files(files) {
    return this.shell_exec(`git add "${files.join(" ")}"`);
  }

  commit(message) {
    return this.shell_exec(`git commit -m "${message}"`);
  }

  commit_amend(message) {
    return this.shell_exec(`git commit --amend -m "${message}"`);
  }

  create_branch(branch) {
    return this.shell_exec(`git switch -c "${branch}"`);
  }

  switch_branch(branch) {
    return this.shell_exec(`git switch "${branch}"`);
  }

  push(remote, branch) {
    return this.shell_exec(`git push "${remote}" "${branch}"`);
  }

  shell_exec(command) {
    return execSync(command, {
      cwd: this.path,
      encoding: "utf8",
    });
  }
}

module.exports = {
  Repository,
};
