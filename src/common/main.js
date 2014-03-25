// ==UserScript==
// @name		color-diff
// @include		*.diff
// ==/UserScript==

(function () {
	"use strict";

	(function setCss() {
		var styleElement = document.createElement('style');
		styleElement.innerHTML = '.diff-view { width:100%; } ' +
			'.diff { border: 1px solid #ccc; margin-bottom: 15px; } ' +
			'.diff-meta { padding: 5px 10px; background-image: linear-gradient(#fafafa, #eaeaea); border-bottom: 1px solid #d8d8d8; }' +
			'.diff-code-view { border-spacing: 0; width: 100% }' +
			'.diff-line-num { width: 1%; padding-left: 8px; padding-right: 8px; text-align: right; color: rgba(0,0,0,0.3); border-right: 1px solid #e5e5e5; }' +
			'.diff-line-num.meta { background-color: #f8f8ff; border-right: 1px solid #e5e5e5; }' +
			'.diff-line-num.add { background-color: #ddffdd; border-right: 1px solid #b4e2b4; }' +
			'.diff-line-num.del { background-color: #f7c8c8; border-right: 1px solid #e9aeae; }' +
			'.diff-code-line { width: 100%; }' +
			'.diff-code-line.meta { color: #999; background-color: #f8f8ff; }' +
			'.diff-code-line.add { background-color: #dfd; }' +
			'.diff-code-line.del { background-color: #fdd; }';

		document.head.appendChild(styleElement);
	})();

	function parseDiff(text) {
		var fileIndex = 0,
			result = '',
			currentLine = {left: 0, rigth: 0},
			lines = text.split("\n");

		result = '<div class="diff-view">';

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];

			// file diff start
			if (line.indexOf('diff --git') === 0) {
				if (fileIndex > 0) {
					result += '</table></div>';
				}

				var fileName = line.split(' ').pop().substring(2);
				result += '<div class="diff">';
				result += '<div class="diff-meta">' + fileName + '</div>';
				result += '<table class="diff-code-view">';

				// skip lines
				while (i < lines.length ) {
					i++;
					if (lines[i].indexOf('@@') === 0) {
						i--;
						break;
					}
				}
				fileIndex++;
			}

			else if (line.indexOf('@@') === 0) {
				var re = /@@.+?(\d+),(\d+).+?(\d+),(\d+)/,
					found = line.match(re);

				currentLine.left = currentLine.rigth = found[1];
				result += '<tr>' +
					'<td class="diff-line-num meta">...</td>' +
					'<td class="diff-line-num meta">...</td>' +
					'<td class="diff-code-line meta"><pre>' + line + '</pre></td>' +
					'</tr>';
			}

			else if (line.indexOf('-') === 0) {
				result += '<tr>' +
					'<td class="diff-line-num del">' + currentLine.left + '</td>' +
					'<td class="diff-line-num del"></td>' +
					'<td class="diff-code-line del"><pre>' + line + '</pre></td>' +
					'</tr>';
				currentLine.left++;
			}

			else if (line.indexOf('+') === 0) {
				result += '<tr>' +
					'<td class="diff-line-num add"></td>' +
					'<td class="diff-line-num add">' + currentLine.rigth + '</td>' +
					'<td class="diff-code-line add"><pre>' + line + '</pre></td>' +
					'</tr>';
				currentLine.rigth++;
			}

			else {
				result += '<tr>' +
					'<td class="diff-line-num">' + currentLine.left + '</td>' +
					'<td class="diff-line-num">' + currentLine.rigth + '</td>' +
					'<td class="diff-code-line"><pre>' + line + '</pre></td>' +
					'</tr>';
				currentLine.left++;
				currentLine.rigth++;
			}
		}

		result += '</table></div></div>';

		return result;
	}

	var textElem = document.querySelector('pre');
	textElem.innerHTML = parseDiff(textElem.innerHTML);
})();