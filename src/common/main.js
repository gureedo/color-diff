// ==UserScript==
// @name		color-diff
// @include		*.diff
// ==/UserScript==

(function(){
	"use strict";

	var textElem = document.querySelector('pre');
	var text = textElem.innerHTML;
	textElem.innerHTML = text
		.replace(/^\+.*$/gm, '<span style="font-weight: bold; color: green;">$&</span>')
		.replace(/^-.*$/gm, '<span style="font-weight: bold; color: red;">$&</span>')
		.replace(/^@.*$/gm, '<span style="font-weight: bold; color: blue;">$&</span>')
		.replace(/^([iI]ndex:?|diff --git) .*$/gim,
			'<span style="font-weight: bold;">$&</span>');
})();