const slideDown = (elem) => (elem.style.height = `${elem.scrollHeight}px`);

const slideUp = (elem) => (elem.style.height = 0);

const slideToggle = (elem) => {
  if (window.getComputedStyle(elem).height === "0px") {
    slideDown(elem);
  } else {
    slideUp(elem);
  }
};

module.exports = {
  slideDown,
  slideUp,
  slideToggle,
};
