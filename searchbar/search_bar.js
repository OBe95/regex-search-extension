var regexInput = document.querySelector('#reg-search input');
var searchButton = document.querySelector('#actions button.search');
var resetButton = document.querySelector('#actions button.reset');

function getActiveTab() {
  return browser.tabs.query({ active: true, currentWindow: true });
}

searchButton.onclick = function (e) {
  getActiveTab().then((tabs) => {
    var searchRegex = regexInput.value;
    browser.tabs.sendMessage(tabs[0].id, { regex: searchRegex });
  });
}

resetButton.onclick = function (e) {
  getActiveTab().then((tabs) => {
    regexInput.value = '';
    browser.tabs.sendMessage(tabs[0].id, { reset: true });
  });
}
