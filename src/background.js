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