browser.runtime.onMessage.addListener(runSearch);

const highlightClass = 'reg-search-highlighted';
const regSearchResultCss = 'reg-search-results-css';

if (!document.getElementById(regSearchResultCss)) {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.id = regSearchResultCss;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = browser.extension.getURL("../styles/search_results.css");
  link.media = 'all';
  head.appendChild(link);
}

function runSearch(request, sender, sendResponse) {
  var body = document.querySelector('body');
  if (request.regex) {
    reset();
    const regex = new RegExp(request.regex, 'gi');
    replaceText(document.body, regex);
  } else if (request.reset) {
    reset();
  }
}

function replaceText(node, regex) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentNode &&
      node.parentNode.nodeName === 'TEXTAREA') {
      return;
    }

    let content = node.textContent;
    content.replace(regex, function (match) {
      content = content.replace(match, `<span class="${highlightClass}">${match}</span>`);
      node.replaceWith(parseHTML(content));
    });
  }
  else {
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceText(node.childNodes[i], regex);
    }
  }
}

function reset() {
  const highlightedElements = document.getElementsByClassName(highlightClass);
  Array.from(highlightedElements).forEach((highlightedElement) => {
    highlightedElement.replaceWith(highlightedElement.textContent);
  });
}


function parseHTML(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.cloneNode(true);
}