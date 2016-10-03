var lastVisit = {};

chrome.history.onVisited.addListener(function (item) {
  lastVisit[item.url] = Date.now();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.url && lastVisit[request.url]) {
      var now = Date.now();
      sendResponse({load: !(now - lastVisit[item.url] < 5000)});
    }
    else {
      sendResponse({load: true});
    }
  }
);
var toggle = false;
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: "on.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {file:"SCRIPT.user.js"});
  }
  else{
    chrome.browserAction.setIcon({path: "off.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {code:"alert()"});
  }
});
