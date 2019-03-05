var currentIndex = 0;
var mainContainer = getElementById("mainContainer");
var containerLeft = getElementById("containerLeft");
var containerRight = getElementById("containerRight");
var isTouchDevice = isTouchDeviceFn();
var catchScrolling = true;
var slideItemHeight =0;
const pageTemplate = {
  slides: [getElementById("l1"), getElementById("l2"), getElementById("l3")]
};

export function attachEvent() {
  if (isTouchDevice) {
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", processScroll, false);
  } else if (document.addEventListener) {
    mainContainer.addEventListener(
      "DOMMouseScroll",
      processScroll,
      false
    );
    mainContainer.addEventListener("mousewheel", processScroll, false);
  } else if (document.attachEvent) {
    // pour IE
    mainContainer.attachEvent("onmousewheel", processScroll);
  } else {
    mainContainer.onDOMMouseScroll = processScroll;
    mainContainer.onmousewheel = processScroll;
  }
}

export function initSize() {
  const height =
    pageTemplate.slides.length * pageTemplate.slides[0].scrollHeight;
  mainContainer.style.height = height;

  slideItemHeight =  !isTouchDevice ? pageTemplate.slides[0].getBoundingClientRect().height : window.innerHeight;
}


function processScroll(e) {
  if (!catchScrolling) {
    return;
  }
  catchScrolling = false;

  var direction = getScrollDirection(e);
  scroll(direction);
}
function scroll(direction) {
  updateCurrentIndex(direction);
  scrollTo(currentIndex);
}

function updateCurrentIndex(direction) {
  if (direction === "down") {
    currentIndex++;
  } else {
    currentIndex--;
  }
  currentIndex = checkOverFlowSlides(pageTemplate);
}

export function scrollTo(index) {
  var posYToReach =
    pageTemplate.slides[index].getBoundingClientRect().height * currentIndex;

  containerLeft.style.transform = "translateY(" + -posYToReach + "px)";
  containerRight.style.transform =
    "translateY(" + window.innerHeight * index + "px)";
  //avoid double scroll
  setTimeout(function() {
    catchScrolling = true;
  }, 1100);
}

function checkOverFlowSlides(page) {
  if (currentIndex >= page.slides.length) {
    return page.slides.length - 1;
  } else if (currentIndex < 0) {
    return 0;
  } else return currentIndex;
}

function getScrollDirection(e) {
  if(isTouchDevice)
  {
    return getScrollDirectionMobile(e);
  }
  else
  {
    var event = e || window.event;
    return event.deltaY > 0 ? "down" : "up";
  }
}


// =================== touchscreen =====================

var yDown = null;

function getTouches(e) {
  return e.touches || e.originalEvent.touches;
}

function handleTouchStart(e) {
  const firstTouch = getTouches(e)[0];
  yDown = firstTouch.clientY;
}


function getScrollDirectionMobile(e) {
  var direction;

  if (!yDown) {
    return;
  }
  var yUp = e.touches[0].clientY;
  var yDiff = yDown - yUp;
  if (yDiff > 0) {
    direction=  "down";
  } else {
    direction = "up";
  }
  yDown = null;
  return direction;
}

// =================== end touchscreen =====================

// ===================== utils ========================

function getElementById(id) {
  return document.getElementById(id);
}

function isTouchDeviceFn() {
  var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  var mq = function(query) {
    return window.matchMedia(query).matches;
  };

  if (
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
  return mq(query);
}

// ===================== end utils ========================
