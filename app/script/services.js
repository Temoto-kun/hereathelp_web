(function(w) {
	w.hereAtHelp = w.hereAtHelp || {};
	w.hereAtHelp.services = w.angular.module('hereathelp.services', []);

	w.hereAtHelp.services
        .service('ApiService', function($http) {
            //var url = 'http://10.237.3.6:8080/Dropbox/Projects/hereathelp_api/public/api/v1/events';
            var url = 'http://hereathelp.cloudapp.net/api/v1';

            this.perform = function(method, which) {
                return $http({
                    url: url + '/' + which,
                    method: method
                });
            }
        })
		.service('ItemService', function($q, $timeout, ApiService) {
            var loaded = [];

			this.get = function(id) {
                return _.findWhere(loaded, { id: id });
			};

			this.getAll = function() {
                return loaded;
			};

            this.loadItems = function() {
                return ApiService.perform('get', 'events')
                    .then(function(response) {
                        loaded = response.data;
                        w.items = loaded;
                    });
            };
		})
	;
})(window);
