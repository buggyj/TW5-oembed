/*\
title: $:/plugins/tiddlywiki/oembed/oembed.js
type: application/javascript
module-type: widget

A widget for embeding content
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

	var Widget = require("$:/core/modules/widgets/widget.js").widget;
if($tw.browser) {	
	require("$:/plugins/bj/oembed/jquery.min.js");
	require("$:/plugins/bj/oembed/jquery.oembed.min.js");
}
	
	/*
	try {
	 defaults=$tw.wiki.getTiddlerData("$:/plugins/bj/oembed/options.json");
	} catch(e){
		alert("invalid format: oembed options ");
		defaults={};
	}
*/
 var erroFrame ='<div class="embeddedContent"><iframe allowfullscreen="true"'+
						 'height="349" src='+"'"+ 'data:text/html,<html><body>'+
						 $tw.wiki.getTiddlerText("$:/plugins/bj/oembed/error")+'</html></body>'+"'"+
						 ' style="" width="425"></iframe></div>';
var CloudWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.defaults ={noVimeo:"noVimeo", myError:"error"};
	this.errorframe =
	this.maxWidth ='560';
	this.maxHeight = '315';
	this.responsiveResize = 'responsive';
};

/*
Inherit from the base widget class
*/
CloudWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
CloudWidget.prototype.render = function(parent,nextSibling) {
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Create the object
	this.embedCode(parent,nextSibling);
};


CloudWidget.prototype.embedCode = function(parent,nextSibling) {
	var self=this;
		self.defaults ={noVimeo:"noVimeo", myError:"error"};

	jQuery('body').oembed(self.url, {
		onEmbed: function(e) {
			var div = self.document.createElement("div");

			if (typeof e.code === 'string') {
				div.innerHTML =e.code;
			} else if (typeof e.code[0].outerHTML === 'string') {
				div.innerHTML=e.code[0].outerHTML;
			} else {
				div.innerHTML =erroFrame;
			}
			parent.insertBefore(div,nextSibling);
			self.domNodes.push(div);                      
		},
		onError: function(externalUrl) {
			var div = self.document.createElement("div");
			if (externalUrl.indexOf("vimeo.com") > 0) {
				div.innerHTML =erroFrame;
			} else {
				div.innerHTML =erroFrame;
			}
			parent.insertBefore(div,nextSibling);
			self.domNodes.push(div); 
		},
		maxHeight: self.maxHeight,
		maxWidth: self.maxWidth,
		useResponsiveResize: self.responsiveResize,
		embedMethod: 'editor'
	});
}


/*
Compute the internal state of the widget
*/
CloudWidget.prototype.execute = function() {
	// Get the parameters from the attributes
	this.url = this.getAttribute("url");
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
CloudWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.url)  {
		this.refreshSelf();
		return true;
	}
	return false;
};

exports.oembed = CloudWidget;

})();
