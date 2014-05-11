(function(w) {
	w.hereAtHelp = w.hereAtHelp || {};
	w.hereAtHelp.app = w.angular.module('hereathelp', [
		'hereathelp.services',
		'hereathelp.controllers',
		'pascalprecht.translate',

		'ui.bootstrap',
		'ui.router'
	]);

	w.hereAtHelp.app
		.config(function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('items', {
					url: '/items'
				})
				.state('items.view', {
					url: '/:id',
                    parent: 'items'
				})
                .state('dashboard', {
                    url: '/dashboard'
                })
			// TODO more states here...
			;

			$urlRouterProvider
				.otherwise('/items');
		})
		.config(function($translateProvider) {
			$translateProvider
				.translations('en-PH', {
					APP_ID: 'Here@Help',
					LANG_ID: 'en-PH',
					LANG_NAME_LONG: 'English (Philippines)',
					LANG_NAME_SHORT: 'English',
					LANG_VARIANT: 'Philippines',

					LANG_NAME_LONG_LOCAL: 'English (Philippines)',
					LANG_NAME_SHORT_LOCAL: 'English',
					LANG_VARIANT_LOCAL: 'Philippines'
					// TODO more translation strings here...
				})
				.translations('tl-PH', {
					APP_ID: 'Here@Help',
					LANG_ID: 'tl-PH',
					LANG_NAME_LONG: 'Tagalog (Philippines)',
					LANG_NAME_SHORT: 'Tagalog',
					LANG_VARIANT: 'Philippines',

					LANG_NAME_LONG_LOCAL: 'Tagalog (Pilipinas)',
					LANG_NAME_SHORT_LOCAL: 'Tagalog',
					LANG_VARIANT_LOCAL: 'Pilipinas'
					// TODO more translation strings here...
				})
				// TODO more languages here ...
				.preferredLanguage('en-PH')
			;
		})
		.run(function($translate, $rootScope, $state, ItemService) {
			$rootScope.setLanguage = function(lang) {
				$translate.use(lang);
			};

            $rootScope.filter = {};
			$rootScope.title = "Here@Help";

            $rootScope.isState = function(state) {
                return $state.includes(state);
            };

            $rootScope.dashboardMap = null;
            $rootScope.areaMap = null;
            $rootScope.currentItem = null;

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            });

            function parseJson(obj) {
                obj = JSON.parse(obj);
            }

            $rootScope.showItem = function(id) {
                $rootScope.currentItem = ItemService.get(parseInt(id));

                console.log($rootScope.currentItem);
                $rootScope.areaMap.setView($rootScope.currentItem.location.coords.split(','), 14);
                $rootScope.areaMapMarker = $rootScope.areaMapMarker || w.L.marker($rootScope.currentItem.location.coords.split(',')).addTo($rootScope.areaMap);
                $rootScope.areaMapMarker.setLatLng($rootScope.currentItem.location.coords.split(','));

            };

            $rootScope.hideItem = function() {
                $rootScope.currentItem = null;
            };

            ItemService.loadItems()
                .then(function() {
                    $rootScope.items = ItemService.getAll();

                    _.each($rootScope.items, function(x, i) {
                        var location = {
                            coords: '',
                            name: {},
                            nameString : ''
                        };

                        location.coords = $rootScope.items[i]['location'];
                        location.name = JSON.parse($rootScope.items[i]['parse_location_name']);
                        location.nameString = [
                            location.name.properties.county,
                            location.name.properties.region,
                            location.name.properties.country
                        ].join(', ');

                        $rootScope.items[i].id = parseInt($rootScope.items[i].id);

                        _.each($rootScope.items[i]['needs'], function(y, j) {
                            var json = y['provision']['content'].trim();
                            console.log(json);
                            var provision = JSON.parse(json);
                            $rootScope.items[i]['needs'][j]['provision'] = provision;
                        });

                        w.angular.element(document).ready(function() {
                            if($rootScope.dashboardMap == null) {
                                $rootScope.dashboardMap = w.L.map('dashboard-map').setView([0, 0], 2);

                                w.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                }).addTo($rootScope.dashboardMap);
                            }

                            if($rootScope.areaMap == null) {
                                $rootScope.areaMap = w.L.map('area-map').setView([0, 0], 2);

                                w.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                }).addTo($rootScope.areaMap);
                            }

                            $rootScope.items[i]['marker'] = w.L.marker($rootScope.items[i]['location'].coords.split(','))
                                .addTo($rootScope.dashboardMap)
                                .bindPopup(
                                    "<strong>" + $rootScope.items[i]['location'].nameString + "</strong><br>" +
                                        "Affected: " + (parseInt($rootScope.items[i]['est_alive']) + parseInt($rootScope.items[i]['est_dead'])) + "<br>" +
                                        '<a href="#/items" ng-click="showItem(' + $rootScope.items[i]['id'] + ')">View</a>');
                        });
                    });
                });
		})
	;
})(window);
