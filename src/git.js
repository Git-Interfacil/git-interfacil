const execSync = require("child_process").execSync;
// id, author, message, createdAt
const formatStr = "%h%x00%an%x00%s%x00%aI%x00%x00";

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
    let output = this.shell_exec(
      `git log --branches --format='format:${formatStr}'`,
    )
      .split("\x00\x00\n")
      .filter((s) => s.length != 0);
    let commits = [];
    for (let i = 0; i < output.length; i++) {
      const fields = output[i].split("\x00");

      const commitHash = fields[0];
      let cur_commit = {};
      cur_commit["id"] = fields[0];
      cur_commit["author"] = fields[1];
      cur_commit["message"] = fields[2];
      cur_commit["createdAt"] = fields[3];
      cur_commit["parents"] = this.get_commit_parents(commitHash);
      cur_commit["branchId"] = this.select_commit_branch(
        commitHash,
        cur_commit["parents"].length,
      );

      commits.push(cur_commit);
    }
    return commits;
  }

  get_changed_and_untracked_files() {
    const outputLines = this.shell_exec(`git status --porcelain -z`).split(
      "\0",
    );
    let files = [];
    for (let i = 0; i < outputLines.length; i++) {
      // Each line has two single-character fields, a space, and filename.
      // See <https://git-scm.com/docs/git-status#_porcelain_format_version_1>
      // for a better explanation of the output format.
      const status_field1 = outputLines[i][0];
      const status_field2 = outputLines[i][1];
      const filename = outputLines[i].substring(3);

      if (
        status_field1 == "M" ||
        status_field1 == "?" ||
        status_field2 == "M"
      ) {
        files.push(filename);
      }
    }
    return files;
  }

  get_commit_parents(commitHash) {
    let output = this.shell_exec(`git rev-list --parents -n 1 "${commitHash}"`)
      .split(" ")
      .slice(1) // first element is commitHash itself
      .map((s) => s.trim());
    return output;
  }

  select_commit_branch(commitHash, numberOfParents) {
    const commitBranches = this.shell_exec(
      `git branch --format="%(refname:short)" --sort=committerdate --contains "${commitHash}"`,
    )
      .split("\n")
      .filter((s) => s.length != 0);

    if (numberOfParents > 1 && commitBranches.includes("master")) {
      return "master";
    } else if (numberOfParents > 1 && commitBranches.includes("main")) {
      return "main";
    } else {
      const graphBranches = this.shell_exec(
        `git log --graph --format='format:%h' --branches | grep "${commitHash}"`,
      )
        .trim()
        .split(" ")
        .filter((s) => s.length != 0);

      const firstStarIndex = graphBranches.indexOf("*");

      if (firstStarIndex == 0) {
        return commitBranches.pop();
      } else {
        return commitBranches[0];
      }
    }
  }

  // receive array with file names
  add_files(files) {
    return this.shell_exec(`git add ${files.join(" ")}`);
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
