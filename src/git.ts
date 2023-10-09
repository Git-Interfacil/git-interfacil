const execSync = require("child_process").execSync;
const formatStr = '{"hash":"%h","author":"%an","message":"%s"}';

module.exports = {
  // TODO
  // - change shell's current directory to where the user's project is
  // - get branch from commit hash
  get_commit_info: function () {
    return execSync(`git log --format='format:${formatStr}'`, {
      encoding: "utf8",
    });
  },
};
