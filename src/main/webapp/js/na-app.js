var jsonTransformQuery = function (data, headers) {
    data = angular.fromJson(data);
    var mainObj;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            mainObj = data[key];
            break;
        }
    }
    console.log("Table ", mainObj)
    var resp = [];
    var cols = mainObj.columns;
    var records = mainObj.records;
    for (var i = 0; i < records.length; i++) {
        var recordsEntry = records[i];
        var entry = {};
        for (var j = 0; j < cols.length; j++) {
            var col = cols[j];
            var val = recordsEntry[j];
            entry[col] = val;
        }
        resp.push(entry);

    }


    return resp;
}

var angularModule =
    angular.module('adminApp', [, 'ngRoute', 'ui.bootstrap', 'ngResource']).constant("appConfigs", {
        "context": "/northServer/api.php"
    }).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main.html'

        }).when('/etapas/', {
            templateUrl: 'partials/etapas.html',
            controller: 'EtapasCtrl'
        }).when('/etapa/:id', {
            templateUrl: 'partials/etapa.html',
            controller: 'EtapaDetailsCtrl'
        }).when('/localidades', {
            templateUrl: 'partials/locations.html',
            controller: 'LocationListCtrl'
        }).when('/localidade/:id', {
            templateUrl: 'partials/location.html',
            controller: 'LocationDetailsCtrl'
        }).when('/destaques', {
            templateUrl: 'partials/destaques.html',
            controller: 'DestaqueListCtrl'
        }).when('/destaque/:id', {
            templateUrl: 'partials/destaque.html',
            controller: 'DestaqueDetailsCtrl'
        }).otherwise({
            redirectTo: '/'
        });
    }]).filter("sanitize", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }]).filter('textOrNumber', function ($filter) {
        return function (input, fractionSize) {
            if (isNaN(input)) {
                return "-";
            } else {
                return $filter('number')(input, fractionSize);
            }
            ;
        };
    })
        .service('EtapasService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource('http://localhost/northServer/api.php/Etapa/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                }
            })
        }])
        .service('LocationService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource('http://localhost/northServer/api.php/Local/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                }
            });

        }])
          .service('DestaquesService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource('http://localhost/northServer/api.php/Destaque/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                }
            });

        }])
        .controller('DestaqueListCtrl', ['$scope', '$timeout', '$window', '$routeParams', 'DestaquesService', '$location', function ($scope, $timeout, $window, $routeParams, DestaquesService, $location) {
            
            $scope.destaques = DestaquesService.query();

            $scope.novo = function () {
                $location.path("/destaque/-1");
            }
        }])
        .controller('DestaqueDetailsCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'DestaquesService', function ($scope, $timeout, $location, $routeParams, DestaquesService) {
            if ($routeParams.id == -1) {
                $scope.destaque = {}
            } else {
                $scope.destaque = DestaquesService.get({ id: $routeParams.id });
            }
            $scope.saveData = function () {
                DestaquesService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.destaque);
            }

            $scope.cancel = function () {
                $location.path("/destaques");
            }

        }])
        .controller('EtapasCtrl', ['$scope', '$timeout', '$window', '$routeParams', 'EtapasService', '$location', function ($scope, $timeout, $window, $routeParams, EtapasService, $location) {
            $('[data-toggle="tooltip"]').tooltip();
            $scope.etapas = EtapasService.query();

            $scope.nova = function () {
                $location.path("/etapa/-1");
            }
        }])
        .controller('EtapaDetailsCtrl', [
            '$scope', '$filter', '$timeout', '$location', '$routeParams', 'EtapasService', 'LocationService', function (
                $scope, $filter, $timeout, $location, $routeParams, EtapasService, LocationService) {
                $("[data-mask]").inputmask();
                if ($routeParams.id == -1) {
                    $scope.etapa = {}
                } else {
                    $scope.etapa = EtapasService.get({ id: $routeParams.id },
                        function (data) {
                            
                            if (data.id_Local != null && data.id_Local != -1) {
                                $scope.location = LocationService.get({ id: data.id_Local });
                            }
                            
                            var datevar = new Date(parseInt( $scope.etapa.data));
                            $scope.formData = datevar;
                        });
                }
                $scope.$watch('formData', function (newValue) {
                    
                    try {
                        
                        $scope.etapa.data = newValue.getTime();                        
                    } catch (e) {
                    }
                });

                // $scope.$watch('etapa.data', function (newValue) {
                //     console.log('valor etapa',newValue)
                    
                // });
                $scope.saveData = function () {
                    EtapasService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.etapa);
                }


                $scope.associateLocal = function (location) {
                    $scope.etapa.id_Local = location.id;
                    $scope.location = location;
                    $('#pickLocal').modal('hide');
                }

                $scope.cancel = function () {
                    $location.path("/etapas");
                }

                $scope.removeLocal = function () {
                    $scope.etapa.id_Local = null;
                    $scope.location = null;
                    $('#pickLocal').modal('hide');
                }
                $('#pickLocal').modal({ show: false });
                $('#pickLocal').on('shown.bs.modal', function () {
                    $scope.locations = LocationService.query();
                })
            }])
        .controller('LocationListCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'LocationService', function ($scope, $timeout, $location, $routeParams, LocationService) {
            $scope.locations = LocationService.query();
            $scope.novaLocalidade = function () {
                $location.path("/localidade/-1");
            }


        }])
        .controller('LocationDetailsCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'LocationService', function ($scope, $timeout, $location, $routeParams, LocationService) {
            if ($routeParams.id == -1) {
                $scope.location = {}
            } else {
                $scope.location = LocationService.get({ id: $routeParams.id });
            }
            $scope.saveData = function () {
                LocationService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.location);
            }

            $scope.cancel = function () {
                $location.path("/localidades");
            }

        }])
    ;
