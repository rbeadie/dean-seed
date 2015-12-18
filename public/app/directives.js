'use strict';

/* Directives */

angular.module('myApp.directives', []).
  	directive('appVersion', function (version) {
	    return function(scope, elm, attrs) {
	      elm.text(version);
	    };
	}).
	directive('ngAutoExpand', function($window, $timeout) {
		return {
				restrict: 'A',
				link: function(scope, element, attr) {
						element.on('input propertychange', update);
						element.on('click', update);
						
						function update() {
							var scrollTop = $window.pageYOffset,
								scrollLeft = $window.pageXOffset;
							element.css({
								height: 'auto',
								overflow: 'hidden'
							});
							var height = element[0].scrollHeight;
							if (height > 0) {
								element.css('height', height + 'px');
							}
							$window.scrollTo(scrollLeft, scrollTop);
						}
						$timeout(update);
					}
		};
	})
;
