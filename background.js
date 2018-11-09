'use strict';

// chrome.runtime.onInstalled.addListener(function () {
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: { hostEquals: '*' },
//       })
//       ],
//       actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });

document.addEventListener('DOMContentLoaded', () => new App());

class App {
  constructor() {
    this.keywords = ['funding', 'merger', 'acquired'];
    this.renderKeywords();
    this.setEventListeners();
    this.highlighter = new Highlighter();
  }

  addItem() {
    const item = document.querySelector('#add-item-input');

    if (item.value && item.value.trim()) {
      this.keywords.push(item.value);
    }

    item.value = '';
    this.render();
  }

  handleKeyPress(event) {
    alert('keypress event works');
    console.log(event);
    if (event.key === 'Enter') {
      this.addItem();
    }
  }

  setEventListeners() {
    const addButton = document.querySelector('#add-button');
    if (addButton) {
      addButton.addEventListener('keydown', this.handleKeyPress.bind(this));
      addButton.addEventListener('click', this.addItem.bind(this));
    }
  }

  render() {
    this.renderKeywords();
    this.highlighter.addHighlights(document.body, this.keywords, {
      foreground: 'black',
      background: 'lime',
    });
  }

  renderKeywords() {
    const listElement = document.querySelector('#keyword-listing');
    const fragment = document.createDocumentFragment();

    this.keywords.forEach(keyword => {
      const div = document.createElement('div');
      div.textContent = keyword;
      fragment.appendChild(div);
    });

    if (listElement) {
      listElement.innerHTML = '';
      listElement.appendChild(fragment);
    }
  }
}


// Based on https://github.com/wrzlbrmft/chrome-keywords-highlighter/blob/master/src/content.js
class Highlighter {
  highlight(node, pos, keyword, options) {
    var span = document.createElement("span");
    span.className = "highlighted";
    span.style.color = options.foreground;
    span.style.backgroundColor = options.background;

    var highlighted = node.splitText(pos);
		highlighted.splitText(keyword.length);
    var highlightedClone = highlighted.cloneNode(true);

    span.appendChild(highlightedClone);
    highlighted.parentNode.replaceChild(span, highlighted);

    occurrences++;
  }

  addHighlights(node, keywords, options) {
    var skip = 0;

    var i;
    if (3 == node.nodeType) {
      for (i = 0; i < keywords.length; i++) {
        var keyword = keywords[i].toLowerCase();
        var pos = node.data.toLowerCase().indexOf(keyword);
        if (0 <= pos) {
          highlight(node, pos, keyword, options);
          skip = 1;
        }
      }
    }
    else if (1 == node.nodeType && !/(script|style|textarea)/i.test(node.tagName) && node.childNodes) {
      for (i = 0; i < node.childNodes.length; i++) {
        i += addHighlights(node.childNodes[i], keywords, options);
      }
    }

    return skip;
  }

  removeHighlights(node) {
    var span;
    while (span = node.querySelector("span.highlighted")) {
      span.outerHTML = span.innerHTML;
    }

    occurrences = 0;
  }

  // if (remove) {
  //   removeHighlights(document.body);
  // }
}
