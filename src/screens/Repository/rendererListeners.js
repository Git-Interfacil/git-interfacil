const animationsController = require("./controllers/animationsController");
const localBranchesController = require("./controllers/localBranchesController");
const actionButtonHandlers = require("./controllers/actionsController");
const changedFilesController = require("./controllers/changedFilesController");

class RendererListeners {
  #repositoryRenderer;
  #dropdownsElements;
  #buttonsElements;

  constructor(repositoryRenderer, dropdownsElements, buttonsElements) {
    this.#repositoryRenderer = repositoryRenderer;
    this.#dropdownsElements = dropdownsElements;
    this.#buttonsElements = buttonsElements;
  }

  addListenersToSidebar() {
    this.#dropdownsElements.forEach((dropdown) => {
      const header = dropdown.querySelector(".header");
      const submenu = dropdown.querySelector(".items");
      animationsController.slideDown(submenu);
      header.addEventListener("click", () => {
        animationsController.slideToggle(submenu);

        if (submenu.classList.contains("opened")) {
          setTimeout(() => {
            header.classList.toggle("opened");
          }, 300);
        } else {
          header.classList.toggle("opened");
        }

        submenu.classList.toggle("opened");
      });
    });
  }

  addListenersToLocalBranchesCheckboxes() {
    const listElement =
      this.#repositoryRenderer.rendererElements.getLocalBranchesElement();
    const counterElement =
      this.#repositoryRenderer.rendererElements.getCountLocalBranchesElement();

    const list = listElement.querySelectorAll("li");
    list.forEach((item) => {
      const checkbox = item.querySelector("input");
      const branchId = item.dataset.branchId;

      checkbox.addEventListener("change", () => {
        if (!checkbox.checked) {
          localBranchesController.deactivateBranch(item);
          localBranchesController.decreaseCount(counterElement);

          this.#repositoryRenderer.deactivateBranch(branchId);
          this.#repositoryRenderer.drawBranches();
          this.#repositoryRenderer.fillMessages();
        } else {
          localBranchesController.activateBranch(item);
          localBranchesController.increaseCount(counterElement);

          this.#repositoryRenderer.activateBranch(branchId);
          this.#repositoryRenderer.drawBranches();
          this.#repositoryRenderer.fillMessages();
        }
      });
    });
  }

  addListenersToChangedFilesCheckboxes() {
    const listElement =
      this.#repositoryRenderer.rendererElements.getChangedFilesElement();
    const counterElement =
      this.#repositoryRenderer.rendererElements.getCountChangedFilesElement();

    const list = listElement.querySelectorAll("li");
    list.forEach((item) => {
      const checkbox = item.querySelector("input");
      const changedId = item.dataset.changedId;

      checkbox.addEventListener("change", () => {
        if (!checkbox.checked) {
          changedFilesController.deactivateChangedFile(item);
          changedFilesController.decreaseCount(counterElement);
          this.#repositoryRenderer.deactivateChangedFile(changedId);
        } else {
          changedFilesController.activateChangedFile(item);
          changedFilesController.increaseCount(counterElement);
          this.#repositoryRenderer.activateChangedFile(changedId);
        }
      });
    });
  }

  addListenersToActionsBar(repository, currentBranchId) {
    const buttonParams = {
      /*       add: { repository }, */
      commit: { repository },
      push: { repository, currentBranchId },
      stash: { repository },
      pop: { repository },
      pull: { repository },
      /*       undo: {},
      redo: {}, */
    };
    this.#buttonsElements.forEach((button) => {
      button.addEventListener("click", () => {
        console.log("Clicked");
        const action = button.dataset.action;

        if (action in actionButtonHandlers) {
          actionButtonHandlers[action](...Object.values(buttonParams[action]));
        } else {
          console.log("Button not found");
        }
      });
    });
  }
}

module.exports = RendererListeners;
