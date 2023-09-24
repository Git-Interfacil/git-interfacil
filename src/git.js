const execSync = require("child_process").execSync;
const formatStr = '{"hash":"%h","author":"%an","message":"%s"}';

class Repository {
  update_repo_path(path) {
    this.path = path;
  }

  constructor(path) {
    this.update_repo_path(path);
  }

  get_repo_head() {
    return execSync("git rev-parse HEAD", {
      cwd: this.path,
      encoding: "utf8",
    });
  }

  // TODO
  // - change shell's current directory to where the user's project is
  // - get branch from commit hash
  get_commit_info() {
    return execSync(`git log --format='format:${formatStr}'`, {
      cwd: this.path,
      encoding: "utf8",
    });
  }
}

module.exports = {
  Repository,
};
