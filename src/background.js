var lastVisit = {};

chrome.history.onVisited.addListener(function (item) {
  lastVisit[item.url] = Date.now();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Check for a blacklisted host
    var link = document.createElement("a");
    link.href = request.url;
    chrome.storage.local.get(link.hostname, function (blacklist) {
      console.log(link.hostname + ": " + blacklist[link.hostname]);
      if (blacklist[link.hostname]) {
        sendResponse({load: false, blacklist: true});
      }
      else if (lastVisit[request.url]) {
        var now = Date.now();
        sendResponse({load: !(now - lastVisit[request.url] < 5000)});
      }
      else {
        sendResponse({load: true});
      }
    });
    return true; // Keep sendResponse valid;
  }
);
