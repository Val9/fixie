var Fixie = (function($) {

	var cap = function(str) {
			return str.substr(0,1).toUpperCase() + str.substr(1);
		},
		matchPropName = function(prop, name) {
			var c = cap(prop);
			return (name == 'style.webkit' + c) || (name == 'style.Moz' + c) || (name == 'style.' + prop);
		},
		getPropValue = function(prop, style) {
			var c = cap(prop);
			return style[prop] || style['-webkit-' + prop] || style['webkit-' + prop] || style['webkit' + c] || style['-moz-' + prop] || style['moz-' + prop]  || style['Moz' + c] || style['moz' + c];
		};

	return {

		callback: function(elem, prop, propValue) {
			console.log(elem, prop, propValue);
		},

		track: function(prop, selector) {

			// TODO: IE9 variant (propertychange with attachEvent or DOMAttrModified with addEventListener)

			// This only works in IE < 9
			$(selector).unbind('propertychange').bind('propertychange', function(e) {
				if(matchPropName(prop, e.originalEvent.propertyName)) {
					Fixie.callback(this, prop, getPropValue(prop, this.style));
				}
			});

		},

		apply: function(prop, selector) {

			$(selector).each(function() {
				var propValue = getPropValue(prop, this.style);
				if(propValue) {
					Fixie.callback(this, prop, propValue);
				}
			});

		},

		//Loop through all stylesheets and apply (or re-apply) initial rules
		parse: function(prop) {	
			for (var i = 0; i < document.styleSheets.length; i++) {

				// if the stylesheet gives us security issues and is readOnly, exit here
				if(document.styleSheets[i].readOnly) continue; 

				for (var j = 0; j < document.styleSheets[i].rules.length; j++) {

					var propValue = getPropValue(prop, document.styleSheets[i].rules[j].style);
					var selector = document.styleSheets[i].rules[j].selectorText;

					if(!propValue)
						continue;

					// TODO: Preprocess callback to only process value once
					$(selector).each(function() {
						Fixie.callback(this, prop, propValue);
					});

				}

			}
			
		}

	};

})(jQuery);
