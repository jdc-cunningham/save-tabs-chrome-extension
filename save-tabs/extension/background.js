'use strict';

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  const { action } = request;

  console.log(request);

  if (action === 'get-tabs') {
    // get tabs
    chrome.tabs.query({}, function(tabs){
      chrome.runtime.sendMessage({
        response: {
          tabs
        }
      });
    });
  }

});
