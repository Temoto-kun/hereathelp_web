(function(w) {
	w.hereAtHelp = w.hereAtHelp || {};
	w.hereAtHelp.controllers = w.angular.module('hereathelp.controllers', []);

	w.hereAtHelp.controllers
		.controller('ItemCtrl', function($rootScope, $stateParams, ItemService) {
			$rootScope.item = ItemService.get(parseInt($stateParams.id));
		})
	;
})(window);
