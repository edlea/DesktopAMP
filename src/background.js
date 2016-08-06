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
      // Check for a blacklisted host
      var link = document.createElement("a");
      link.href = item.url;
      //chrome.storage.load(l.hostname;
      sendResponse({load: true});
    }
  }
);
