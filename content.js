function keywordsHighlighter(options, remove) {
	// Based on "highlight: JavaScript text higlighting jQuery plugin" by Johann Burkard.
	// http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
	// MIT license.
	function highlight(node, pos, keyword, options) {
		var span = document.createElement("span");
		span.className = "highlighted";
		span.style.color = options.foreground;
		span.style.backgroundColor = options.background;

		var highlighted = node.splitText(pos);
		/*var afterHighlighted = */highlighted.splitText(keyword.length);
		var highlightedClone = highlighted.cloneNode(true);

		span.appendChild(highlightedClone);
		highlighted.parentNode.replaceChild(span, highlighted);

	}

	function addHighlights(node, keywords, options) {
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

	function removeHighlights(node) {
		var span;
		while (span = node.querySelector("span.highlighted")) {
			span.outerHTML = span.innerHTML;
		}

	}

	if (remove) {
		removeHighlights(document.body);
	}

	var keywords = options.keywords.split(",");
	delete options.keywords;
	addHighlights(document.body, keywords, options);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if ("searchText" == request.type) {
		keywordsHighlighter({
				"keywords": "set, get",
				"foreground": "#000000",
				"background": "#fcfecc"
        }, false
        );
	}
});