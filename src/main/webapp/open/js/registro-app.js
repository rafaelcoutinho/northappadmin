var angularModule =
    angular.module('registroApp', ['ngRoute', 'ngAnimate', 'dialogs.main', 'north.services', 'ui.bootstrap', 'ngResource', 'ngSanitize']).constant("appConfigs", {
        "context": "//cumeqetrekking.appspot.com/app/rest",
        "contextRoot": "//cumeqetrekking.appspot.com/"
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
        .run(['$rootScope', '$window', '$templateCache', '$interpolate',
            function ($rootScope, $window, $templateCache, $interpolate) {
                // get interpolation symbol (possible that someone may have changed it in their application instead of using '{{}}')
                var startSym = $interpolate.startSymbol();
                var endSym = $interpolate.endSymbol();
                $templateCache.put('/dialogs/wait.html',
                    '<div class="modal-header dialog-header-wait"><h4 class="modal-title"><span class="' + startSym + 'icon' + endSym + '"></span> ' + startSym + 'header' + endSym + '</h4></div><div class="modal-body"><p ng-bind-html="msg"></p><div class="progress progress-striped active"><div class="progress-bar progress-bar-info" ng-style="getProgress()"></div><span class="sr-only"></span></div></div>');

            }])

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
                $scope.desconectar = function (desconectar) {
                    facebookService.logout();

                }
                $rootScope.$on('gotCompetidor', function (event, competidor) { console.log(competidor); $scope.competidor = competidor; });
            }])
        .controller('ModalCompetidor', function ($scope, $uibModalInstance, competidores, AlertService) {
            $scope.competidores = competidores;
            $scope.novoCompetidor = { nome: "" };

            $scope.ok = function () {
                if ($scope.novoCompetidor.id == null) {
                    //novo cadastro
                    if ($scope.competidorForm.competidorEmail.$valid == false) {
                        AlertService.showError("Por favor corrija os erros do formulário.");
                        return;
                    }

                }
                $uibModalInstance.close($scope.novoCompetidor);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.exitFilterCompetidor = function () {
                console.log($scope.noResult)
                if ($scope.noResult) {
                    var nome = $scope.novoCompetidor;
                    $scope.novoCompetidor = {
                        nome: nome
                    }
                }
            }
        }).controller('ModalEquipe', function ($scope, $uibModalInstance, equipes, categorias, AlertService) {
            $scope.equipes = equipes;
            $scope.novaEquipe = { nome: "" };
            $scope.categorias = categorias;
            $scope.ok = function () {
                if ($scope.novaEquipe.id == null) {
                    if ($scope.equipeForm.equipe.$valid == false || $scope.equipeForm.categoria.$valid == false) {
                        AlertService.showError("Por favor corrija os erros do formulário.");
                        return;
                    }

                }
                $uibModalInstance.close($scope.novaEquipe);
            };
            $scope.getNomeCategoria = function (item) {
                for (var index = 0; index < categorias.length; index++) {
                    var element = categorias[index];
                    if (element.id == item.id_Categoria) {
                        return element.nome;
                    }
                }
                return "";
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.exitFilterEquipe = function () {
                console.log($scope.noResultEquipe)
                if ($scope.noResultEquipe) {
                    var nome = $scope.novaEquipe;
                    $scope.novaEquipe = {
                        nome: nome
                    }
                }
            }

        })

        .controller('RegistroCtrl', [
            '$scope', '$timeout', '$window', 'facebookService', '$location', '$routeParams', 'EtapasService', 'CompetidorService', 'EquipesService', 'CategoriaService', 'InscricaoService', 'AlertService', '$rootScope', '$uibModal', '$log', 'dialogs',
            function ($scope, $timeout, $window, facebookService, $location, $routeParams, EtapasService, CompetidorService, EquipesService, CategoriaService, InscricaoService, AlertService, $rootScope, $uibModal, $log, dialogs) {
                $scope.loadingVal = 0;
                dialogs.wait("Carregando informações", "Por favor aguarde", $scope.loadingVal);
                //TODO não salvar usuário antes de ele submeter form, nem mesmo associar a equipe!
                $scope.inscricao = {
                    integrantes: [],
                    lider: null,
                    etapa: {},
                    equipe: null
                };
                $scope.fbmsg = "Conectar com Facebook";
                $scope.selectCompetidor = function () {
                    var openModal = function () {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'competidorModalContent.html',
                            controller: 'ModalCompetidor',
                            size: 'lg',
                            resolve: {
                                competidores: function () {
                                    return $scope.competidores;
                                }
                            }
                        });

                        modalInstance.result.then(function (selecionado) {
                            if (selecionado) {
                                $scope.setCompetidor(selecionado);
                            }
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                    }
                    if (!$scope.competidores) {
                        dialogs.wait("Carregando informações", "Por favor aguarde", 10);
                        $scope.competidores = CompetidorService.query({}, function () {
                            $rootScope.$broadcast('dialogs.wait.complete');
                            openModal();
                        });
                    } else {
                        openModal();
                    }

                };
                $scope.selectEquipe = function () {
                    dialogs.wait("Carregando informações", "Por favor aguarde", 10);
                    $scope.categorias = CategoriaService.query();
                    $scope.equipes = EquipesService.query({}, function () {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        openModal();
                    });
                    var openModal = function () {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'equipeModalContent.html',
                            controller: 'ModalEquipe',
                            size: 'lg',
                            resolve: {
                                equipes: function () {
                                    return $scope.equipes;
                                }, categorias: function () {
                                    return $scope.categorias;
                                }
                            }
                        });

                        modalInstance.result.then(function (selecionado) {
                            if (selecionado) {
                                $scope.setEquipe(selecionado);
                            }
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                    }
                };
                $scope.notLider = function () {
                    return function (item) {
                        return item.id != $scope.inscricao.lider.id;

                    };
                }
                $scope.removeIntegrante = function (integrante, index) {
                    $scope.inscricao.integrantes.splice(index, 1);
                }
                $scope.selectIntegrante = function () {
                    if (!$scope.competidores) {
                        $scope.competidores = CompetidorService.query();
                    }
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'competidorModalContent.html',
                        controller: 'ModalCompetidor',
                        size: 'lg',
                        resolve: {
                            competidores: function () {
                                return $scope.competidores;
                            }
                        }
                    });

                    modalInstance.result.then(function (selecionado) {
                        $scope.inscricao.integrantes.push(selecionado);
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
                var checkIfInscritos = function (idEquipe) {
                    var carregaIntegrantes = function (idEquipe) {
                        $scope.inscricao.integrantes = [];
                        $scope.inscricao.integrantes = CompetidorService.query({ filter0: "id_Equipe,eq," + idEquipe }, function () {
                            $rootScope.$broadcast('dialogs.wait.complete');
                        });
                    }
                    $scope.inscricaoServer = null;
                    dialogs.wait("Carregando informações", "Por favor aguarde enquanto carregamos informações de sua equipe.", 10);
                    InscricaoService.query4Equipe({ id: idEquipe, idEtapa: $routeParams.id }, function (data) {
                        if (data.length > 0) {
                            for (var index = 0; index < data.length; index++) {
                                var element = data[index];
                                $scope.inscricao.integrantes.push({
                                    id: element.id_Trekker,
                                    id_Equipe: element.id_Equipe,
                                    nome: element.nome

                                });

                            }

                            $rootScope.$broadcast('dialogs.wait.complete');
                            $scope.inscricaoServer = data;
                            AlertService.showError("Já existe uma inscrição da sua equipe nesta etapa.");
                        } else {
                            carregaIntegrantes(idEquipe);
                        }

                    }, function () {
                        carregaIntegrantes(idEquipe);
                    });
                }

                $scope.setEquipe = function (equipe) {
                    if (equipe == null) {
                        $scope.inscricao.equipe = null;
                        return;
                    }
                    $scope.inscricao.integrantes = [];
                    $scope.inscricaoServer = null;
                    //validar
                    if (equipe.nome == null || equipe.nome.length == 0) {
                        console.log("Nome obrigatório")
                        return;
                    }

                    $scope.inscricao.equipe = equipe;
                    if (equipe.id != null) {
                        checkIfInscritos(equipe.id);
                    }
                }
                $scope.setCompetidor = function (competidor) {
                    //validar
                    if (competidor.id == null) {
                        competidor.id = -1;
                    }
                    $scope.inscricao.lider = competidor;
                    if (competidor.id_Equipe != null) {
                        $scope.setEquipe({ id: competidor.id_Equipe, nome: competidor.equipe });
                    } else {
                        $scope.setEquipe(null);
                    }
                    $scope.onCompetidorSet(competidor);
                    $scope.showForm = false;
                }
                $scope.onCompetidorSet = function (competidor) {


                }

                $scope.inscricao.etapa = EtapasService.get({ id: $routeParams.id }, function (resp) {
                    var diff = resp.data - new Date().getTime();
                    console.log(resp.data, " - ", new Date().getTime(), diff)
                    if (diff < 0) {
                        $scope.etapaFinalizada = true;
                        dialogs.notify("Etapa completa", "Etapa já completa, não é mais possível se inscrever nela.");


                    }
                });


                $scope.connectFB = function (fbUser) {
                    if (fbUser) {
                        if (fbUser.email) {
                            $scope.fbmsg = "Conectar como " + fbUser.name + " ";
                            $rootScope.$broadcast('dialogs.wait.progress', { 'progress': 80 });
                            CompetidorService.query({ filter0: "email,eq," + fbUser.email }, function (results) {
                                $rootScope.$broadcast('dialogs.wait.progress', { 'progress': 90 });
                                $scope.loadingData = false;
                                if (results.length == 0) {
                                    var novoCompetidor = {
                                        email: fbUser.email,
                                        nome: fbUser.name,
                                        fbId: fbUser.id
                                    };
                                    $scope.setCompetidor(novoCompetidor);

                                } else if (results.length == 1) {
                                    var dbUser = results[0];
                                    $scope.inscricao.lider = dbUser;
                                    if ($scope.inscricao.lider.fbId != fbUser.id) {
                                        $scope.inscricao.lider.fbId = fbUser.id;
                                        CompetidorService.save({ id: $scope.inscricao.lider.id }, $scope.inscricao.lider);//nao importa o resultado.
                                    }
                                    $scope.setCompetidor($scope.inscricao.lider);
                                    $scope.showForm = false;
                                }
                                $rootScope.$broadcast('dialogs.wait.complete');
                            }, function (error) {
                                console.log(error);
                                $rootScope.$broadcast('dialogs.wait.complete');
                            });
                        } else {
                            $rootScope.$broadcast('dialogs.wait.complete');
                        }
                    } else {
                        $rootScope.$broadcast('dialogs.wait.complete');
                        facebookService.login().then(function () {
                            $scope.updateWithFB();
                        });

                    }
                }
                $scope.updateWithFB = function () {
                    $rootScope.$broadcast('dialogs.wait.progress', { 'progress': 30 });

                    facebookService.loginStatus().then(function (resp) {
                        $rootScope.$broadcast('dialogs.wait.progress', { 'progress': 50 });
                        facebookService.meApi("email,name").then(function (data) {
                            $rootScope.$broadcast('dialogs.wait.progress', { 'progress': 70 });
                            $scope.connectFB(data);

                        }, function (error) {
                            $rootScope.$broadcast('dialogs.wait.complete');

                        });
                    }, function (resp) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                    })
                };
                $scope.updateWithFB();
                $scope.inscrever = function () {

                    if ($scope.inscricao.etapa.id) {
                        dialogs.wait("Inscrevendo equipe", "Por favor aguarde", 10);

                        InscricaoService.inscrever({}, $scope.inscricao,
                            function (data) {

                                $scope.inscricao.equipe.id = data.equipe.id;
                                $scope.inscricao.lider.id = data.lider.id;
                                for (var index = 0; index < $scope.inscricao.integrantes.length; index++) {
                                    $scope.inscricao.integrantes[index].id = data.integrantes[index].id;//TODO talvez saida da ordem                                    
                                }
                                $scope.inscricaoServer = $scope.inscricao;
                                $rootScope.$broadcast('dialogs.wait.complete');
                            }, function (response) {
                                $rootScope.$broadcast('dialogs.wait.complete');
                                AlertService.showError("Houve um erro ao salvar");

                            });
                    }
                }

            }]);

