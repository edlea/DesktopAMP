var docEl = document.documentElement;
var isAMP = docEl.hasAttribute('amp') || docEl.hasAttribute('⚡');
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
  if (node.tagName !== "LINK") return;

  var rel = node.getAttribute('rel');
  if (!rel) return;

  if (rel.toLowerCase() == 'amphtml') {
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
  if (typeof chrome !== 'undefined') {
    chrome.runtime.sendMessage({url: node.getAttribute("href")}, function(response) {
      if (response.load) {
        window.location = node.getAttribute("href");
      }
    });
  }
  else {
    window.location = node.getAttribute("href");
  }
}

function applyMobileCSS(node) {
  var css = "body > * { max-width: 600px; margin: 0px auto !important; }";
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  node.appendChild(style);
}
