var docEl = document.documentElement;
var isAMP = docEl.hasAttribute('amp') || docEl.hasAttribute('⚡️');
var observerConfig = { childList: true, subtree: true };

var documentObserver = observeNode(docEl, inspectDocNodes);
var headObserver;


function observeNode(node, cb){
  var obs = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++)
        cb(mutation.addedNodes[i]);
    });
  });
  obs.observe(node, observerConfig);
  return obs;
}

function inspectDocNodes(node){
  if (node.tagName != "HEAD") return;

  if (isAMP)
    applyMobileCSS(node);
  else {
    queryForMeta(node);
    headObserver = observeNode(node, inspectHeadNodes);
    documentObserver.disconnect();
    // console.log('disconnected from doc')
  }
}

function inspectHeadNodes(node) {
  // node.nodeType == 1 && console.log(node);
  if (node.tagName == "LINK" && node.getAttribute('rel').toLowerCase() == 'amphtml') {
      headObserver.disconnect();
      redirect(node);
  }
  // if no match found, headObserver is not disconnected.
}

function queryForMeta(head) {
  var node = head.querySelector('link[rel="amphtml"]');
  if (node)
    redirect(node);
}

function redirect(node) {
  window.location = node.getAttribute("href");
}

function applyMobileCSS(node) {
  var css = "body > * { max-width: 600px; margin: 0px auto; }";
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  node.appendChild(style);
}
