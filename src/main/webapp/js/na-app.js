var jsonTransformQuery = function (data, headers) {
    data = angular.fromJson(data);
    var mainObj;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            mainObj = data[key];
            break;
        }
    }
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
    angular.module('adminApp', [, 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngResource']).constant("appConfigs", {
        "context": "//cumeqetrekking.appspot.com/rest"
    }).config(['$routeProvider', function ($routeProvider, $rootScope) {
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
        }).when('/equipes', {
            templateUrl: 'partials/equipes.html',
            controller: 'EquipeListCtrl'
        }).when('/equipe/:id', {
            templateUrl: 'partials/equipe.html',
            controller: 'EquipeDetailsCtrl'
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
            };
        };
    })
        .service('AlertService', ['$rootScope', function ($rootScope) {
            $rootScope.alerts = [];
            $rootScope.closeAlert = function (index) {
                $rootScope.alerts.splice(index, 1);
            };
            return {
                alert: function (text, timeout, type) {
                    $rootScope.alerts.push({ type: type, msg: text });
                },
                showInfo: function (text, timeout) {
                    this.alert(text, timeout, 'info');
                },
                showSuccess: function (text, timeout) {
                    this.alert(text, timeout, 'success');
                },
                showError: function (text, timeout) {
                    this.alert(text, timeout, 'dange');
                }
            }
        }])
        .service('EtapasService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {

            return $resource(appConfigs.context + '/Etapa/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                }
            })
        }])
        .service('LocationService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource(appConfigs.context + '/Local/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                }
            });

        }])
        .service('CategoriaService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource(appConfigs.context + '/Categoria/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                }
            });

        }])
        .service('EquipesService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource(appConfigs.context + '/Equipe/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                }
            });

        }]).controller('ConfirmModalCrtl', function ($scope, $uibModalInstance, title, message) {

            $scope.title = title;
            $scope.message = message;
            $scope.ok = function () {
                $uibModalInstance.close(true);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .controller('EquipeListCtrl', [
            '$scope', '$timeout', '$window', '$routeParams', 'EquipesService', '$location',
            function ($scope, $timeout, $window, $routeParams, EquipesService, $location) {

                $scope.equipes = EquipesService.query();

                $scope.novo = function () {
                    $location.path("/equipe/-1");
                }
            }])
        .controller('EquipeDetailsCtrl', [
            '$scope', '$timeout', '$location', '$routeParams', 'EquipesService', 'CategoriaService', '$rootScope', 'modalService',
            function ($scope, $timeout, $location, $routeParams, EquipesService, CategoriaService, $rootScope, modalService) {





                if ($routeParams.id == -1) {
                    $scope.destaque = {}
                } else {
                    $scope.equipe = EquipesService.get({ id: $routeParams.id });
                }
                $scope.categorias = CategoriaService.query();
                $scope.saveData = function () {
                    EquipesService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.equipe);
                }

                $scope.cancel = function () {
                    $location.path("/equipes");
                }

            }])
        .service('DestaquesService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource(appConfigs.context + '/Destaque/:id', {}, {
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
            '$scope', '$filter', '$timeout', '$location', '$routeParams', 'EtapasService', 'LocationService', '$uibModal', 'AlertService', function (
                $scope, $filter, $timeout, $location, $routeParams, EtapasService, LocationService, $uibModal, AlertService) {
                $("[data-mask]").inputmask();
                if ($routeParams.id == -1) {
                    $scope.etapa = {}
                } else {
                    $scope.etapa = EtapasService.get({ id: $routeParams.id },
                        function (data) {

                            if (data.id_Local != null && data.id_Local != -1) {
                                $scope.location = LocationService.get({ id: data.id_Local });
                            }

                            var datevar = new Date(parseInt($scope.etapa.data));
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
                    EtapasService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.etapa, function () {
                        AlertService.showSuccess("Salvo com sucesso");
                    });
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

                $scope.remove = function () {
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'partials/modal.html',
                        controller: 'ConfirmModalCrtl',
                        size: 'sm',
                        resolve: {
                            title: function () {
                                return "Apagar";
                            },
                            message: function () {
                                return "Você tem certeza que deseja apagar?";
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        EtapasService.remove({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.etapa,
                            function () {
                                $location.path("/etapas");
                            }, function (data) {

                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                };





            }])
        .controller('LocationListCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'LocationService', function ($scope, $timeout, $location, $routeParams, LocationService) {
            $scope.locations = LocationService.query();
            $scope.novaLocalidade = function () {
                $location.path("/localidade/-1");
            }


        }])
        .controller('LocationDetailsCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'LocationService', 'toaster', function ($scope, $timeout, $location, $routeParams, LocationService, toaster) {
            if ($routeParams.id == -1) {
                $scope.location = {}
            } else {
                $scope.location = LocationService.get({ id: $routeParams.id });
            }
            $scope.saveData = function () {
                LocationService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.location, function (data) {
                    $scope.location.id = data;
                    toaster.pop({
                        type: 'success',
                        title: 'Salvo com sucesso',
                        showCloseButton: false
                    });
                }, function (data) {
                    toaster.pop({
                        type: 'error',
                        title: 'Houve um erro ao salvar.',
                        showCloseButton: false
                    });
                });
            }
            $scope.remove = function () {
                LocationService.remove({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.location,
                    function () {
                        toaster.pop({
                            type: 'success',
                            title: 'Apagado com sucesso',
                            showCloseButton: false
                        });
                        $location.path("/localidades");
                    }, function (data) {
                        toaster.pop({
                            type: 'error',
                            title: 'Houve um erro ao remover.',
                            showCloseButton: false
                        });
                    });
            }

            $scope.cancel = function () {
                $location.path("/localidades");
            }

        }])
    ;
