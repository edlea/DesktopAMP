var isAMP = (document.documentElement.getAttribute('amp') === "" || document.documentElement.getAttribute('⚡️') === "");
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var length = mutation.addedNodes.length;
    for (var i = 0; i < length; i++) {
      var node = mutation.addedNodes[i];
      if (node.tagName == "LINK") {
        if (node.getAttribute('rel').toLowerCase() == 'amphtml') {
            window.location = node.getAttribute("href");
        }
      }
      else if (isAMP && node.tagName == "HEAD") {
        var css = "body > * { max-width: 600px; margin: 0px auto; }";
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        node.appendChild(style);
      }
    }
  });
});

var config = { attributes: true, childList: true, subtree: true };
observer.observe(document.documentElement, config);
