const execSync = require("child_process").execSync;
const formatStr = '{"id":"%h","author":"%an","message":"%s","createdAt":"%aI"}';

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

  // TODO
  // - change shell's current directory to where the user's project is
  // - get branch from commit hash
  get_commit_info() {
    return this.shell_exec(`git log --format='format:${formatStr}'`);
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
