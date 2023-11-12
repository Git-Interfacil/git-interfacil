class RepoSelector {
  constructor(document) {
    this.document = document;
    this.inputElement = this.document.getElementById("repoSelector");
    this.loadingElement = this.document.getElementById("repoSelectorLoading");
    this.inputElement.addEventListener("change", () => {
      this.updateRepoPath();
      this.setLoading(false);
    });
    this.inputElement.addEventListener("click", () => this.setLoading(true));
    // this.inputElement.addEventListener("focus", () =>
    //     !this.inputElement.value && this.setLoading(false));
  }

  updateRepoPath() {
    const headFile = Array.from(this.inputElement.files).find((file) =>
      this.isGitRepository(file.webkitRelativePath),
    );
    if (!headFile) return this.handleError();
    this.dirPath = headFile.path.replace("/.git/HEAD", "");
  }

  isGitRepository(path) {
    return path.split("/").length === 3 && path.endsWith("/.git/HEAD");
  }

  getDirPath() {
    return this.dirPath;
  }

  setLoading(loading) {
    this.loadingElement.style.display = loading ? "flex" : "none";
  }

  handleError() {
    alert("The directory choosen is not a git repository");
  }
}

module.exports = RepoSelector;
