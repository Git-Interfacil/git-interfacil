function showToast(message, iconSrc) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast";

  const icon = document.createElement("img");
  icon.src = iconSrc;
  icon.alt = "System:";

  const messageSpan = document.createElement("span");
  messageSpan.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(messageSpan);

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");

    setTimeout(() => {
      toast.style.opacity = 0;

      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 500); // 500 milliseconds is the duration of the fade-out animation
    }, 2000);
  }, 0);
}

module.exports = {
  showToast,
};
