(function(w) {
	w.hereAtHelp = w.hereAtHelp || {};
	w.hereAtHelp.controllers = w.angular.module('hereathelp.controllers', []);

	w.hereAtHelp.controllers
		.controller('ItemCtrl', function($scope, $stateParams, ItemService) {
			$scope.item = ItemService.get(parseInt($stateParams.id));
		})
	;
})(window);
