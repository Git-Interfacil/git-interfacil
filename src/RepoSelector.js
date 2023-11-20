class RepoSelector {
  #inputElement;
  #loadingElement;
  #dirPath;

  constructor() {
    this.#inputElement = document.getElementById("repoSelector");
    this.#loadingElement = document.getElementById("repoSelectorLoading");
    this.#inputElement.addEventListener("change", () => {
      this.#updateRepoPath();
      this.#setLoading(false);
    });
    this.#inputElement.addEventListener("click", () => this.#setLoading(true));
    // this.#inputElement.addEventListener("focus", () =>
    //     !this.#inputElement.value && this.setLoading(false));
  }

  getDirPath() {
    return this.#dirPath;
  }

  #updateRepoPath() {
    const headFile = Array.from(this.#inputElement.files).find((file) =>
      this.#isGitRepository(file.webkitRelativePath),
    );
    if (!headFile) return this.#handleError();
    console.log(headFile);
    this.#dirPath = headFile.path.replace("/.git/HEAD", "");
  }

  #isGitRepository(path) {
    return path.split("/").length === 3 && path.endsWith("/.git/HEAD");
  }

  #setLoading(loading) {
    this.#loadingElement.style.display = loading ? "flex" : "none";
  }

  #handleError() {
    alert("The directory choosen is not a git repository");
  }
}

module.exports = RepoSelector;
