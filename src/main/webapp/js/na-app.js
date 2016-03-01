var angularModule =
    angular.module('adminApp', ['north.services', 'ngRoute', 'ui.bootstrap', 'ngResource']).constant("appConfigs", {
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
        }).when('/competidores', {
            templateUrl: 'partials/competidores.html',
            controller: 'CompetidoresListCtrl'
        }).when('/competidor/:id', {
            templateUrl: 'partials/competidor.html',
            controller: 'CompetidorDetailsCtrl'
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

        .controller('ConfirmModalCrtl', function ($scope, $uibModalInstance, title, message) {

            $scope.title = title;
            $scope.message = message;
            $scope.ok = function () {
                $uibModalInstance.close(true);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .controller('CompetidoresListCtrl', [

            '$scope', '$timeout', '$window', '$routeParams', 'CompetidorService', '$location',
            function ($scope, $timeout, $window, $routeParams, CompetidorService, $location) {

                $scope.competidores = CompetidorService.query();

                $scope.novo = function () {
                    $location.path("/competidor/-1");
                }
            }])
        .controller('CompetidorDetailsCtrl', [
            '$scope', '$timeout', '$location', '$routeParams', 'CompetidorService', 'CategoriaService', '$rootScope', '$uibModal', 'AlertService', 'EquipesService',
            function ($scope, $timeout, $location, $routeParams, CompetidorService, CategoriaService, $rootScope, $uibModal, AlertService, EquipesService) {

                if ($routeParams.id == -1) {
                    $scope.entity = {}
                } else {
                    $scope.entity = CompetidorService.get({ id: $routeParams.id });
                }
                $scope.equipes = EquipesService.query();
                $scope.saveData = function () {
                    CompetidorService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.entity,

                        function (data) {
                            if ($routeParams.id == -1) {
                                $scope.entity.id = data;
                                $location.path("/competidor/" + data);
                            }
                            AlertService.showSuccess("Salvo com sucesso");

                        }, function (response) {
                            if (response.data.errorMsg && response.data.errorMsg.indexOf("Duplicate entry") > -1) {
                                AlertService.showError("Nome da competidor já existe");
                            } else {
                                AlertService.showError("Houve um erro ao salvar");
                            }
                        });
                }
                $scope.associate = function (equipe) {
                    CompetidorService.associateEquipe({ 
                            id_Trekker: $scope.entity.id, id_Equipe: equipe.id, start: new Date().getTime() 
                            },
                        function (data) {
                            $scope.entity = CompetidorService.get({ id: $routeParams.id });
                        });
                    $('#pickEquipe').modal('hide');
                }
                $scope.removeAssociation = function () {
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
                                return "Você tem certeza que deseja remover esta associação?";
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        CompetidorService.desassociateEquipe({ id_Trekker: $scope.entity.id, id_Equipe: $scope.entity.id_Equipe, end: new Date().getTime() },
                            function (data) {
                                $scope.entity.id_Equipe = null;

                                AlertService.showSuccess("Equipe desassociada");

                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });

                }
                $scope.cancel = function () {
                    $location.path("/competidores");
                }
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
                        CompetidorService.remove({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.equipe,
                            function () {
                                AlertService.showSuccess("Removido com sucesso");
                                $location.path("/competidores");
                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                };
            }])

        .controller('EquipeListCtrl', [
            '$scope', '$timeout', '$window', '$routeParams', 'EquipesService', '$location',
            function ($scope, $timeout, $window, $routeParams, EquipesService, $location) {

                $scope.equipes = EquipesService.query();

                $scope.novo = function () {
                    $location.path("/equipe/-1");
                }
            }])
        .controller('EquipeDetailsCtrl', [
            '$scope', '$timeout', '$location', '$routeParams', 'EquipesService', 'CategoriaService', '$rootScope', '$uibModal', 'AlertService',
            function ($scope, $timeout, $location, $routeParams, EquipesService, CategoriaService, $rootScope, $uibModal, AlertService) {

                if ($routeParams.id == -1) {
                    $scope.equipe = {}
                } else {
                    $scope.equipe = EquipesService.get({ id: $routeParams.id });
                }
                $scope.categorias = CategoriaService.query();
                $scope.saveData = function () {
                    EquipesService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.equipe,

                        function (data) {
                            console.log("data", data);
                            if ($routeParams.id == -1) {
                                $scope.equipe.id = data;
                                $location.path("/equipe/" + data);
                            }
                            AlertService.showSuccess("Salvo com sucesso");

                        }, function (response) {
                            if (response.data.errorMsg && response.data.errorMsg.indexOf("Duplicate entry") > -1) {
                                AlertService.showError("Nome da equipe já existe");
                            } else {
                                AlertService.showError("Houve um erro ao salvar");
                            }


                        });
                }

                $scope.cancel = function () {
                    $location.path("/equipes");
                }
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
                        EquipesService.remove({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.equipe,
                            function () {
                                AlertService.showSuccess("Removido com sucesso");
                                $location.path("/equipes");
                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                };
            }])

        .controller('DestaqueListCtrl', ['$scope', '$timeout', '$window', '$routeParams', 'DestaquesService', '$location', function ($scope, $timeout, $window, $routeParams, DestaquesService, $location) {

            $scope.destaques = DestaquesService.query();

            $scope.novo = function () {
                $location.path("/destaque/-1");
            }
        }])
        .controller('DestaqueDetailsCtrl', [
            '$scope', '$timeout', '$location', '$routeParams', 'DestaquesService', '$uibModal', 'AlertService',
            function ($scope, $timeout, $location, $routeParams, DestaquesService, $uibModal, AlertService) {
                if ($routeParams.id == -1) {
                    $scope.destaque = {}
                } else {
                    $scope.destaque = DestaquesService.get({ id: $routeParams.id });
                }
                $scope.saveData = function () {
                    DestaquesService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.destaque, function (data) {
                        $scope.destaque.id = data;
                        $location.path("/destaque/" + data);
                        AlertService.showSuccess("Salvo com sucesso");

                    }, function (data) {
                        AlertService.showError("Houve um erro ao salvar");

                    });
                }

                $scope.cancel = function () {
                    $location.path("/destaques");
                }

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
                        DestaquesService.remove({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.destaque,
                            function () {
                                AlertService.showSuccess("Removido com sucesso");
                                $location.path("/destaques");
                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                };

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
                    EtapasService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.etapa, function (data) {
                        $scope.etapa.id = data;
                        $location.path("/etapa/" + data);
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
                                AlertService.showSuccess("Removido com sucesso");
                                $location.path("/etapas");
                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
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
        .controller('LocationDetailsCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'LocationService', 'AlertService', '$uibModal',
            function ($scope, $timeout, $location, $routeParams, LocationService, AlertService, $uibModal) {
                if ($routeParams.id == -1) {
                    $scope.location = {}
                } else {
                    $scope.location = LocationService.get({ id: $routeParams.id }, function (data) {
                        data.longitudeDec = data.longitude / 1000000;
                        data.latitudeDec = data.latitude / 1000000;
                    });
                }


                $scope.saveData = function () {
                    $scope.location.longitude = $scope.location.longitudeDec * 1000000;
                    $scope.location.latitude = $scope.location.latitudeDec * 1000000;
                    LocationService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.location,
                        function (data) {
                            $scope.location.id = data;
                            AlertService.showSuccess("Salvo com sucesso");

                        }, function (data) {
                            AlertService.showError("Houve um erro ao salvar");

                        });
                }

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
                        LocationService.remove({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.location,
                            function () {
                                AlertService.showSuccess("Removido com sucesso");
                                $location.path("/localidades");
                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.cancel = function () {
                    $location.path("/localidades");
                }

            }])
    ;
