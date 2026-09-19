// ==UserScript==
// @name        Reddit - Disable expando buttons for link posts
// @version     1.0
// @description For Reddit posts that are external links or title-only text posts, gray out the expando button and revert the not-allowed cursor to standard.
// @author      MapleGingerOatmeal
// @namespace   https://github.com/maplegingeroatmeal
// @homepageURL https://github.com/maplegingeroatmeal/scripts
// @supportURL  https://github.com/maplegingeroatmeal/scripts/issues
// @match       *://*.reddit.com/*
// @run-at      document-start
// @grant       none
// @icon        https://www.redditstatic.com/shreddit/assets/favicon/192x192.png
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_SELECTOR = 'shreddit-post[post-type="link"], shreddit-post[post-type="text"]:not(:has([slot="text-body"]))';

  const STYLE_CONTENT = `
    .toggle__expando-button {
      opacity: 0.2 !important;
      cursor: default !important;
    }
  `;

  function injectStyle(post) {
    if (post.dataset.vmProcessed) return;

    const shadow = post.shadowRoot;

    if (!shadow) {
      setTimeout(() => injectStyle(post), 50);
      return;
    }

    const style = document.createElement('style');
    style.textContent = STYLE_CONTENT;
    shadow.appendChild(style);

    const button = shadow.querySelector('.toggle__expando-button');

    if (button) {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from propagating up to the button from the parent post
          e.stopImmediatePropagation();
      });
    }

    post.dataset.vmProcessed = 'true';
  }

  function handleMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches(TARGET_SELECTOR)) {
          injectStyle(node);
        }
        else if (node.querySelectorAll) {
          const nestedPosts = node.querySelectorAll(TARGET_SELECTOR);
          nestedPosts.forEach(injectStyle);
        }
      }
    }
  }

  const observer = new MutationObserver(handleMutations);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

})();
