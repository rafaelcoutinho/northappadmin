var angularModule =
    angular.module('registroApp', ['ngRoute', 'north.services', 'ui.bootstrap', 'ngResource']).constant("appConfigs", {
        "context": "//cumeqetrekking.appspot.com/rest"
        // "context": "//localhost/northServer/api.php"
    }).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/:id', {
            controller: 'RegistroCtrl',
            templateUrl: 'partials/inscricaoForm.html',
        }).when('/inscricao/:idEtapa/:idTrekker', {
            controller: 'InscricaoCtrl',
            templateUrl: 'partials/inscricao.html',
        }).otherwise({
            redirectTo: '/1'
        });

    }])
        .run(['$rootScope', '$window',
            function ($rootScope, $window, $routeProvider) { }])
        .factory('facebookService', function ($q) {
            this.fbAsyncInit = function () {                
                // Executed when the SDK is loaded

                FB.init({
                    appId: '228398097493749',
                    channelUrl: 'partials/channel.html',
                    status: true,
                    cookie: true,
                    version: 'v2.5',
                    xfbml: true
                });
            };
            this.fbAsyncInit();
            var service = {
                meApi: function (fields) {
                    var deferred = $q.defer();

                    FB.api('/me', { fields: fields }, function (response) {

                        if (!response || response.error) {
                            console.log("error", response)
                            deferred.reject('Error occured ' + response.error);
                        } else {
                            deferred.resolve(response);
                        }

                    });
                    return deferred.promise;
                },
                logout: function () {
                    var deferred = $q.defer();
                    FB.logout(function (response) {

                        if (!response || response.error) {
                            deferred.reject('Error occured');
                        } else {
                            deferred.resolve(response);
                        }

                    });
                    return deferred.promise;
                },
                login: function () {
                    var deferred = $q.defer();
                    FB.login(function (response) {
                        if (response.authResponse) {
                            deferred.resolve(response);
                        } else {
                            //User cancelled login or did not fully authorize.
                            deferred.reject('Error occured');
                        }
                    });
                    return deferred.promise;
                },
                loginStatus: function () {
                    var deferred = $q.defer();
                    FB.getLoginStatus(function (response) {
                        console.log(response)
                        if (response.status === 'connected') {
                            deferred.resolve(response);
                        } else if (response.status === 'unknown') {
                            console.log('must redirect user to have login properly done');
                            deferred.reject('Error occured');
                        } else {
                            deferred.reject('Error occured');
                        }


                    });
                    return deferred.promise;
                }
            }
            return service;
        }).controller('InscricaoCtrl', [
            '$scope', '$timeout', '$window', 'facebookService', '$location', '$routeParams', 'EtapasService', 'CompetidorService', 'EquipesService', 'CategoriaService', 'InscricaoService', 'AlertService', '$rootScope',
            function ($scope, $timeout, $window, facebookService, $location, $routeParams, EtapasService, CompetidorService, EquipesService, CategoriaService, InscricaoService, AlertService, $rootScope) {
                $scope.inscricao = InscricaoService.get({ idTrekker: $routeParams.idTrekker, idEtapa: $routeParams.idEtapa }, function (data) {
                    $scope.inscricao.trekker = {
                        nome: data.nome,
                        id: data.id_Trekker,
                        email: data.email
                    }
                });
                $scope.etapa = EtapasService.get({ id: $routeParams.idEtapa });
                $scope.competidor = CompetidorService.get({ id: $routeParams.idTrekker }, function (competidor) {
                    $rootScope.$broadcast('gotCompetidor', competidor);
                    
                });
            }])

        .controller('MenuCtrl', [
            '$scope', '$timeout', '$window', 'facebookService', '$location', '$routeParams', 'EtapasService', 'CompetidorService', 'EquipesService', 'CategoriaService', 'InscricaoService', 'AlertService', '$rootScope',
            function ($scope, $timeout, $window, facebookService, $location, $routeParams, EtapasService, CompetidorService, EquipesService, CategoriaService, InscricaoService, AlertService, $rootScope) {
                
                $rootScope.$on('gotCompetidor', function (event, competidor) { console.log(competidor); $scope.competidor = competidor;});
            }])

        .controller('RegistroCtrl', [
            '$scope', '$timeout', '$window', 'facebookService', '$location', '$routeParams', 'EtapasService', 'CompetidorService', 'EquipesService', 'CategoriaService', 'InscricaoService', 'AlertService', '$rootScope',
            function ($scope, $timeout, $window, facebookService, $location, $routeParams, EtapasService, CompetidorService, EquipesService, CategoriaService, InscricaoService, AlertService, $rootScope) {
                $scope.fbmsg = "Conectar com Facebook";

                $scope.exitFilterEquipe = function () {
                    console.log($scope.noResultEquipe)
                    if ($scope.noResultEquipe) {
                        var nome = $scope.novaEquipe;
                        $scope.novaEquipe = {
                            nome: nome
                        }
                    }
                }
                $scope.exitFilterCompetidor = function () {
                    console.log($scope.noResult)
                    if ($scope.noResult) {
                        var nome = $scope.novoCompetidor;
                        $scope.novoCompetidor = {
                            nome: nome
                        }
                    }
                }
                $scope.associaEquipe = function (equipe) {
                    if (equipe.id != $scope.competidor.id_Equipe) {
                        CompetidorService.associateEquipe(
                            { id_Trekker: $scope.competidor.id, id_Equipe: equipe.id, start: new Date().getTime() },
                            function (data) {
                                $scope.competidor.id_Equipe = equipe.id;
                                $scope.competidor.equipe = equipe.nome;
                                // $scope.competidor.categoria=$scope.novaEquipe.id;
                                $scope.showFormEquipe = false;
                            }, function (error) {
                                console.log("error salvando equieo", error);

                            }
                            );
                    } else {
                        $scope.showFormEquipe = false;
                    }
                }
                $scope.saveEquipe = function () {
                    //validar
                    if ($scope.novaEquipe.nome == null || $scope.novaEquipe.nome.length == 0) {
                        console.log("Nome obrigatorio")
                        return;
                    }
                    if ($scope.novaEquipe.id == null) {
                        EquipesService.save({}, $scope.novaEquipe, function (equipe) {
                            $scope.novaEquipe = equipe;
                            $scope.associaEquipe($scope.novaEquipe);
                        }, function (error) {
                            console.log("error salvando equieo", error);

                        });

                    } else {
                        $scope.associaEquipe($scope.novaEquipe);
                    }

                }
                $scope.saveCompetidor = function () {
                    //validar
                    if ($scope.novoCompetidor.id != null) {
                        $scope.competidor = $scope.novoCompetidor;
                        $scope.onCompetidorSet($scope.competidor);
                        $scope.showForm = false;
                    } else {
                        CompetidorService.save($scope.novoCompetidor, function (success) {

                            $scope.competidor = success;
                            $scope.onCompetidorSet($scope.competidor);
                            $scope.showForm = false;
                        }, function (error) {
                            console.log(error)
                        }
                            );
                    }
                    console.log($scope.competidor, $scope.novoCompetidor);
                }
                $scope.onCompetidorSet = function (competidor) {
                    $rootScope.$broadcast('gotCompetidor', competidor);
                    InscricaoService.get({ idTrekker: competidor.id, idEtapa: $routeParams.id }, function (data) {

                        $scope.inscricao = data;
                        if ($scope.inscricao.id_Etapa && $scope.inscricao.id_Trekker) {
                            AlertService.showError("Já existe uma inscrição sua nesta etapa.");
                            $location.path("/inscricao/" + $scope.inscricao.id_Etapa + "/" + data.id_Trekker);
                        }

                    });
                }

                $scope.etapa = EtapasService.get({ id: $routeParams.id }, function (data) {
                    var diff = $scope.etapa.data - new Date().getTime();
                    console.log($scope.etapa.data, " - ", new Date().getTime(), diff)
                    if (diff < 0) {
                        $scope.etapaFinalizada = true;
                        AlertService.showError("Etapa já completa, não é mais possível se inscrever nela.");

                    }
                });
                $scope.equipes = EquipesService.query();
                $scope.categorias = CategoriaService.query();
                $scope.competidores = CompetidorService.query();
                $scope.competidor = {};
                $scope.fbUser = null;
                $scope.connectFB = function (avoidPersist) {
                    if ($scope.fbUser) {
                        CompetidorService.query({ filter0: "email,eq," + $scope.fbUser.email }, function (results) {


                            if (results.length == 0 && avoidPersist == true) {
                                $scope.novoCompetidor = {
                                    email: $scope.fbUser.email,
                                    nome: $scope.fbUser.name,
                                    fbId: $scope.fbUser.id
                                };
                                $scope.saveCompetidor();
                            } else if (results.length == 1) {
                                var dbUser = results[0];
                                $scope.competidor = dbUser;
                                if ($scope.competidor.fbId != $scope.fbUser.id) {
                                    $scope.competidor.fbId = $scope.fbUser.id;
                                    CompetidorService.save({ id: $scope.competidor.id }, $scope.competidor);//nao importa o resultado.

                                }
                                $scope.onCompetidorSet($scope.competidor);
                                $scope.showForm = false;
                            }

                        }, function (error) {
                            console.log(error);
                        });
                    } else {
                        facebookService.login().then(function () {
                            $scope.updateWithFB();
                        });

                    }
                }
                $scope.updateWithFB = function () {
                    facebookService.loginStatus().then(function (resp) {
                        facebookService.meApi("email,name").then(function (data) {

                            $scope.fbUser = data;
                            $scope.connectFB(true);

                            $scope.fbmsg = "Conectar como " + $scope.fbUser.name + " ";
                        });
                    }, function (resp) {

                    })
                };
                $scope.updateWithFB();
                $scope.inscrever = function () {
                    if ($scope.competidor.id && $scope.etapa.id) {
                        $scope.inscricao = {};
                        $scope.inscricao.id_Trekker = $scope.competidor.id;
                        $scope.inscricao.id_Etapa = $scope.etapa.id;
                        $scope.inscricao.data = new Date().getTime();
                        InscricaoService.save({}, $scope.inscricao,
                            function (data) {



                            }, function (response) {

                                AlertService.showError("Houve um erro ao salvar");

                            });
                    }
                }

            }]);

