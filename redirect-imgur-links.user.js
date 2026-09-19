// ==UserScript==
// @name        Redirect imgur links to image source
// @version     1.0
// @description Script for imgur.com.
// @author      MapleGingerOatmeal
// @namespace   https://github.com/maplegingeroatmeal
// @homepageURL https://github.com/maplegingeroatmeal/scripts
// @supportURL  https://github.com/maplegingeroatmeal/scripts/issues
// @match       https://imgur.com/*
// @run-at      document-start
// @grant       none
// @icon        https://s.imgur.com/images/favicon.png
// ==/UserScript==

const m = location.pathname.match(/^\/([a-zA-Z0-9]{5,10})$/);
if (m) {
  window.stop();
  fetch(location.href)
    .then(r => r.text())
    .then(html => {
      const tag = html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i);
      const url = tag && tag[0].match(/content=["']([^"']+)["']/i);
      if (url) location.replace(url[1].split('?')[0]);
  });
}
