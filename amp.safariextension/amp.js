if (window.top === window) {
  loadAMP();
}

function loadAMP() {
  var amp = document.head.querySelector("link[rel=amphtml]");
  if (amp && amp.getAttribute('href')) {
      window.location = amp.getAttribute('href');
  }
}
