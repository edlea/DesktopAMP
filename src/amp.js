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

function inspectDocNodes(node) {
  if (node.tagName == "BODY") addAMPToggle(node, true);
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
  if (typeof chrome !== 'undefined') {
    chrome.runtime.sendMessage({url: node.getAttribute("href")}, function (response) {
      if (response.load) {
        window.location = node.getAttribute("href");
      }
      if (response.blacklist) {
        document.addEventListener("DOMContentLoaded", function () {
          addAMPToggle(document.body, false);
        });
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

function addAMPToggle(node, isAMP) {
  var css = ".DA_amp_toggle { top: 0; right: 0; position: absolute; display:table; z-index: 9999999999 }";
  css += ".DA_amp_toggle > #DA_label { display: none; }";
  css += ".DA_amp_toggle > span { font-variant: small-caps; color: #666; -webkit-filter: grayscale(" + (isAMP ? "1" : "0") + "); cursor: pointer; display:table-cell; vertical-align:middle;}"
  css += ".DA_amp_toggle > span:hover { -webkit-filter: grayscale(0); }";
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // nodes
  var toggle = document.createElement('div');
  toggle.className = "DA_amp_toggle";
  var label = document.createElement('span');
  label.id = "DA_label";
  label.innerHTML = "blacklist " + location.host;
  var amp = document.createElement('span');
  amp.innerHTML = " ⚡";
  amp.onclick = blacklistPage;
  amp.setAttribute("data-isamp", isAMP ? 1 : 0);
  toggle.appendChild(label);
  toggle.appendChild(amp);
  node.appendChild(toggle);
}

function blacklistPage () {
  var setBlacklisted = this.getAttribute('data-isamp') === "1";
  chrome.storage.local.set(blacklistHosts(setBlacklisted), function () {
    var node = document.head.querySelector('link[rel="canonical"]');
    window.location = node.href;
  });
}

function blacklistHosts (blacklist) {
  var hosts = {}
  hosts[location.hostname] = blacklist;
  document.head.querySelectorAll('link[rel="canonical"],link[rel="amphtml"]').forEach(function (link) {
    var a = document.createElement('a');
    a.href = link.href;
    hosts[a.hostname] = blacklist;
  });
  return hosts;
}
