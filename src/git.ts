const execSync = require("child_process").execSync;

module.exports = {
  // TODO
  // - change shell's current directory to where the user's project is
  get_commit_info: function () {
    const output = execSync("git log --oneline", { encoding: "utf8" })
      .split("\n")
      .filter((s) => s.length > 0);
    return output.map(function (line) {
      const sepIndex = line.indexOf(" ");
      const commitHash = line.substring(0, sepIndex);
      const commitMsg = line.substring(sepIndex + 1, line.length);
      return { commitHash: commitHash, commitMsg: commitMsg };
    });
  },
};
