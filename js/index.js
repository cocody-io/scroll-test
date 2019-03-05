import { scrollTo, initSize, attachEvent } from "./functions.js";

document.addEventListener("DOMContentLoaded", function(event) {
  initSize();
  attachEvent();
});

window.onbeforeunload = function() {
  window.scrollTo(0, 0);
};

window.onresize = function() {
  initSize();
  scrollTo(0);
};
