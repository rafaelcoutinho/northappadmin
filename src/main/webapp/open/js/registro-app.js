// var SERVER_ROOT ="//2-dot-cumeqetrekking.appspot.com";
var SERVER_ROOT = "//cumeqetrekking.appspot.com";

var angularModule =
    angular.module('registroApp', ['ngRoute', 'ngAnimate', 'dialogs.main', 'north.services', 'ui.bootstrap', 'ngResource', 'ngSanitize']).constant("appConfigs", {
        "context": SERVER_ROOT + "/app/rest",
        "contextRoot": SERVER_ROOT

    })

        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider.when('/', {
                controller: 'EntryCtrl',
                templateUrl: 'partials/inscricaoForm.html',
            }).when('/:id', {
                controller: 'RegistroCtrl',
                templateUrl: 'partials/inscricaoForm.html',
            }).when('/inscricao/:idEtapa/:idTrekker', {
                controller: 'InscricaoCtrl',
                templateUrl: 'partials/inscricao.html',
            }).otherwise({
                redirectTo: '/'
            });
            $httpProvider.interceptors.push('REST_Interceptor');

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
        .controller('ModalCompetidor', function ($scope, $uibModalInstance, etapa, competidores, inscricao, AlertService, InscricaoService) {
            $scope.etapa = etapa;
            $scope.competidores = competidores;
            $scope.inscricao = inscricao;
            $scope.novoCompetidor = { nome: "" };

            $scope.ok = function () {
                if ($scope.novoCompetidor.id_Trekker == null) {

                    if ($scope.competidorForm.$valid == false) {
                        AlertService.showError("Por favor corrija os erros do formulário.");
                        return;
                    }

                }
                InscricaoService.getInscricaoCompetidor({ idEtapa: etapa.id, email: $scope.novoCompetidor.email }, function (results) {

                    if (results == null || results.ins_EquipeId == null || results.ins_EquipeId == $scope.inscricao.equipe.id) {
                        if (results.id_Trekker != null) {
                            $scope.novoCompetidor.id_Trekker = results.id_Trekker;
                        }
                        $uibModalInstance.close($scope.novoCompetidor);
                    } else {
                        $scope.competidorForm.competidorEmail.$valid = false;
                        $scope.competidorForm.competidorEmail.$error.jainscrito = true;
                        AlertService.showError("Este Competidor já está inscrito nesta etapa em outra equipe.");
                    }

                }, function (error) {
                    console.log("erro", error);
                });

            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.selectDupe = function () {
                $scope.novoCompetidor = $scope.competidorDuplicado;
                $scope.ok();
            }
            $scope.clearErrors = function () {
                $scope.competidorForm.competidorEmail.$error.jainscrito = false;
                $scope.competidorForm.competidorEmail.$valid = true;
                
                // $scope.competidorDuplicado = null;
            }

            $scope.exitFilterCompetidor = function () {

                if ($scope.noResult == true) {
                    var nome = $scope.novoCompetidor;
                    $scope.novoCompetidor = {
                        nome: nome
                    }
                }
            }
        })
        .controller('ConfirmModalCrtl', function ($scope, $uibModalInstance, title, message, instructions) {

            $scope.title = title;
            $scope.message = message;
            $scope.instructions = instructions;
            $scope.ok = function () {
                $uibModalInstance.close(true);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .controller('ModalLider', function ($scope, $uibModalInstance, AlertService, InscricaoService, CompetidorService, dialogs, $rootScope, $uibModal) {
            $scope.lider = {};
            $scope.hasPwd = false;
            $scope.usedFb = false;
            $scope.newUser = false;
            $scope.lastPwdSentEmail = "";
            $scope.connectFB = function () {
                $uibModalInstance.close({ triggerFB: true });
            }
            $scope.resetPwd = function () {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'partials/modal.html',
                    controller: 'ConfirmModalCrtl',
                    size: 'sm',
                    resolve: {
                        title: function () {
                            return "Resetar Senha";
                        },
                        message: function () {
                            return "Você deseja gerar uma nova senha?";
                        },
                        instructions: function () {
                            return "Um link será enviado para seu e-mail para gerar a nova senha."
                        }
                    }
                });
                modalInstance.result.then(function () {
                    InscricaoService.startPwdRecovery({}, { email: $scope.lider.email }, function () {
                        AlertService.showInfo("Verifique sua caixa de e-mails para gerar uma nova senha.");
                    }, function (erro) {
                        AlertService.showError("Houve um erro ao solicitar o resete de sua senha. Por favor tente novamente.");
                    });
                }, function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                });
            }
            $scope.validateLider = function () {
                if ($scope.lastPwdSentEmail == $scope.lider.email) {
                    return;
                } else if ($scope.liderForm.liderEmail.$valid == false) {
                    return;
                }
                $scope.hasPwd = false;
                $scope.usedFb = false;
                $scope.newUser = false;
                dialogs.wait("Por favor aguarde", "Confirmando informações do seu e-mail", 10);
                InscricaoService.checkCompetidor({ email: $scope.lider.email },
                    function (data) {
                        $scope.lastPwdSentEmail = $scope.lider.email;
                        $scope.wasChecked = true;
                        $scope.lider.id = data.id;
                        $scope.lider.state = data.state;
                        $scope.hasPwd = true;
                        $rootScope.$broadcast('dialogs.wait.complete');
                    }, function (err) {

                        $rootScope.$broadcast('dialogs.wait.complete');
                        if (err.data.errorCode) {
                            console.log(err);
                            $scope.hasPwd = false;
                            $scope.lastPwdSentEmail = $scope.lider.email;
                            $scope.wasChecked = true;
                            $scope.lider.id = null;
                            switch (err.data.errorCode) {
                                case 912:
                                    $scope.newUser = false;
                                    $scope.lider.state = "EXISTING";
                                    break;
                                case 911:
                                    $scope.newUser = true;
                                    $scope.lider.state = "NEW";
                                    break;
                                case 914:
                                    $scope.newUser = false;
                                    $scope.usedFb = true;
                                    $scope.lider.state = "EXISTING";
                                    break;
                                default:
                                    AlertService.showError("Houve um erro processando seu e-mail. Por favor tente novamente.");
                                    break;
                            }
                        } else {
                            AlertService.showError("Houve um erro inesperado processando seu e-mail. Por favor tente novamente.");
                        }




                    });
            }
            $scope.ok = function () {
                
                if ($scope.liderForm.$valid == false) {
                    AlertService.showError("Por favor corrija os erros do formulário.");
                    return;
                }
                var success = function (data) {
                    CompetidorService.query({ filter0: "email,eq," + data.email }, function (competidor) {

                        competidor[0].email = data.email;
                        $uibModalInstance.close(competidor[0]);
                    });
                };
                var error = function (err) {
                    console.log(err);
                    if (err.data.errorCode) {
                        switch (err.data.errorCode) {
                            case 804:
                                AlertService.showError("Senha inválida. Por favor tente novamente.");
                                break;
                            case 801:
                                AlertService.showError("Senha vazia. Por favor insira sua senha e tente novamente.");
                                break;

                            default:
                                AlertService.showError("Por favor corrija os erros do formulário.");
                        }
                    } else {
                        AlertService.showError("Houve um erro processando sua autenticação. Por favor revise seu formulário e tente novamente.");
                    }
                };

                if ($scope.lider.state == "ACTIVE") {
                    InscricaoService.loginUser($scope.lider, success, error);
                } else {
                    InscricaoService.registerUser($scope.lider, success, error);
                }


            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };



        })

        .controller('ModalEquipe', function ($scope, $uibModalInstance, equipes, categorias, AlertService) {
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
        .controller('EntryCtrl',
            ['$scope', '$timeout', '$window', '$location', '$routeParams', 'EtapasService', '$log', 'dialogs',
                function ($scope, $timeout, $window, $location, $routeParams, EtapasService, $log, dialogs) {
                    dialogs.wait("Carregando informações da etapa atual", "Por favor aguarde", $scope.loadingVal);
                    EtapasService.getEtapaAtual({}, function (etapa) {
                        $location.path("/" + etapa.id);
                    });
                }])
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
                            templateUrl: 'liderModalContent.html',
                            controller: 'ModalLider',
                            size: 'lg'

                        });

                        modalInstance.result.then(function (selecionado) {
                            if (selecionado && selecionado.triggerFB == true) {
                                $scope.connectFB();
                            } else if (selecionado) {
                                $scope.setCompetidor(selecionado);
                            }
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                    }

                    openModal();

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
                                if (selecionado.id == null) {

                                    var confirmModal = $uibModal.open({
                                        animation: $scope.animationsEnabled,
                                        templateUrl: 'partials/modal.html',
                                        controller: 'ConfirmModalCrtl',
                                        size: 'sm',
                                        resolve: {
                                            title: function () {
                                                return "Criar nova equipe";
                                            },
                                            message: function () {
                                                return "Você deseja realmente criar uma nova equipe?";
                                            },
                                            instructions: function () {
                                                return "Você definiu uma nova equipe, ela será criada e você será associado a ela. Confirme se realmente deseja criar uma nova equipe."
                                            }
                                        }
                                    });
                                    modalInstance.result.then(function () {
                                        $scope.setEquipe(selecionado);
                                    }, function () {

                                    });
                                } else {
                                    if (selecionado.id != $scope.inscricao.lider.id_Equipe)
                                        var confirmModal = $uibModal.open({
                                            animation: $scope.animationsEnabled,
                                            templateUrl: 'partials/modal.html',
                                            controller: 'ConfirmModalCrtl',
                                            size: 'sm',
                                            resolve: {
                                                title: function () {
                                                    return "Integrar nova equipe";
                                                },
                                                message: function () {
                                                    return "Você realmente deseja se inscrever na equipe " + selecionado.nome + "?";
                                                },
                                                instructions: function () {
                                                    return "Esta é a primeira vez que você se insecreve na equipe " + selecionado.nome + ", sua adesão será confirmada pela NORTHBRASIL."
                                                }
                                            }
                                        });
                                    modalInstance.result.then(function () {
                                        $scope.setEquipe(selecionado);
                                    }, function () {

                                    });
                                }




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
                $scope.disableAlterarEquipe = function () {
                    if ($scope.inscricaoServer == null) {
                        return false;
                    } else {
                        if ($scope.inscricao.lider.paga != null && $scope.inscricao.lider.paga == 1) {
                            return true;
                        } else {
                            if ($scope.alterarInscritos == true) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }

                }
                $scope.removeIntegrante = function (integrante) {
                    var finalarray = [];
                    for (var i = 0; i < $scope.inscricao.integrantes.length; i++) {

                        var element = $scope.inscricao.integrantes[i];

                        if (element != integrante) {
                            finalarray.push(element);
                        }

                    }
                    $scope.inscricao.integrantes = finalarray;
                    if (!$scope.inscricao.removidos) {
                        $scope.inscricao.removidos = [];
                    }
                    $scope.inscricao.removidos.push(integrante);
                }
                $scope.selectIntegrante = function () {
                    if (!$scope.competidores) {
                        $scope.competidores = CompetidorService.query({ filter0: "id_Equipe,eq," + $scope.inscricao.equipe.id });
                    }
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'competidorModalContent.html',
                        controller: 'ModalCompetidor',
                        size: 'lg',
                        resolve: {
                            etapa: function () {
                                return $scope.inscricao.etapa;
                            },
                            inscricao: function () {
                                return $scope.inscricao;
                            },
                            competidores: function () {
                                return $scope.competidores;
                            }
                        }
                    });

                    modalInstance.result.then(function (selecionado) {
                        if (selecionado.id_Trekker != null) {
                            for (var index = 0; index < $scope.inscricao.integrantes.length; index++) {
                                var element = $scope.inscricao.integrantes[index];
                                if (selecionado.id_Trekker == element.id_Trekker) {
                                    return;
                                }

                            }
                        }
                        $scope.inscricao.integrantes.push(selecionado);
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
                var checkIfInscritos = function (idEquipe) {
                    var carregaIntegrantes = function (idEquipe) {
                        $scope.inscricao.integrantes = [];
                        CompetidorService.query({ filter0: "id_Equipe,eq," + idEquipe }, function (data) {
                            $scope.inscricao.integrantes = [];
                            for (var index = 0; index < data.length; index++) {
                                var element = data[index];
                                if ($scope.inscricao.lider.id == element.id_Trekker) {

                                } else {
                                    $scope.inscricao.integrantes.push({
                                        id: element.id_Trekker,
                                        id_Trekker: element.id_Trekker,
                                        id_Equipe: element.id_Equipe,
                                        nome: element.nome
                                    });
                                }
                            }
                            $rootScope.$broadcast('dialogs.wait.complete');
                        });
                    }
                    $scope.inscricaoServer = null;
                    dialogs.wait("Carregando informações", "Por favor aguarde enquanto carregamos informações de sua equipe.", 10);
                    InscricaoService.query4Equipe({ id: idEquipe, idEtapa: $routeParams.id }, function (data) {
                        var principalJaInscrito = null;

                        if (data.length > 0) {

                            for (var index = 0; index < data.length; index++) {
                                var element = data[index];
                                if ($scope.inscricao.lider.id == element.id_Trekker) {
                                    $scope.inscricao.lider.paga = element.paga;
                                    principalJaInscrito = element;
                                } else {
                                    $scope.inscricao.integrantes.push({
                                        id: element.id_Trekker,
                                        id_Trekker: element.id_Trekker,
                                        id_Equipe: element.id_Equipe,
                                        nome: element.nome,
                                        paga: element.paga
                                    });
                                }

                            }

                            $rootScope.$broadcast('dialogs.wait.complete');
                            $scope.inscricaoServer = data;
                            if (principalJaInscrito != null) {
                                AlertService.showError("Já existe uma inscrição sua nesta etapa.");
                            } else {
                                AlertService.showInfo("Sua equipe já possui inscritos para esta etapa. Inscreva-se.");
                            }
                        } else {
                            carregaIntegrantes(idEquipe);
                        }

                    }, function () {
                        carregaIntegrantes(idEquipe);
                    });
                }

                $scope.setEquipe = function (equipe) {
                    $scope.competidores = null;
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
                    if (equipe.id != null && $scope.inscricao.lider.id_Equipe == equipe.id) {
                        checkIfInscritos(equipe.id);
                    }
                }
                $scope.belongsToEquipe = function () {
                    return $scope.inscricao != null && $scope.inscricao.equipe && $scope.inscricao.lider.id_Equipe == $scope.inscricao.equipe.id;
                }
                $scope.setCompetidor = function (competidor) {
                    //validar
                    if (competidor.id == null) {
                        competidor.id = -1;
                        $scope.inscricao.lider = competidor;
                        $scope.setEquipe(null);
                    } else {

                        $scope.inscricao.lider = competidor;
                        InscricaoService.get({ idTrekker: competidor.id, idEtapa: $routeParams.id }, function (data) {
                            if (data != null && data.id_Trekker == $scope.inscricao.lider.id) {
                                AlertService.showError("Já existe uma inscrição sua nesta etapa.");

                                $scope.setEquipe({ id: data.id_Equipe, nome: data.nome_Equipe });
                                if (data.id_Equipe != $scope.inscricao.lider.id_Equipe);
                                $scope.inscricaoServer = data;

                                $scope.showForm = false;
                            } else {
                                if (competidor.id_Equipe != null) {
                                    $scope.setEquipe({ id: competidor.id_Equipe, nome: competidor.equipe });
                                } else {
                                    $scope.setEquipe(null);
                                }
                            }
                        }, function (err) {
                            console.log(err);
                            if (competidor.id_Equipe != null) {
                                $scope.setEquipe({ id: competidor.id_Equipe, nome: competidor.equipe });
                            } else {
                                $scope.setEquipe(null);
                            }
                        });

                    }
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

                $scope.limpaCampos = function () {
                    var etapa = $scope.inscricao.etapa;
                    $scope.alterarInscritos = false;
                    $scope.inscricao = {
                        integrantes: [],
                        lider: null,
                        etapa: etapa,
                        equipe: null
                    };
                    $scope.inscricaoServer = null;
                };
                $scope.updateWithFB();
                $scope.inscrever = function () {

                    if ($scope.inscricao.etapa.id) {
                        $scope.alterarInscritos = false;
                        dialogs.wait("Inscrevendo equipe", "Por favor aguarde", 10);

                        InscricaoService.inscrever({}, $scope.inscricao,
                            function (data) {

                                $scope.inscricao.equipe.id = data.equipe.id;
                                $scope.inscricao.lider.id = data.lider.id;
                                if (data.lider.id_Equipe) {
                                    $scope.inscricao.lider.id_Equipe = data.lider.id_Equipe;
                                }
                                for (var index = 0; index < $scope.inscricao.integrantes.length; index++) {
                                    $scope.inscricao.integrantes[index].id_Trekker = data.integrantes[index].id_Trekker;//TODO talvez sai da ordem                                    
                                }
                                $scope.inscricaoServer = $scope.inscricao;
                                $rootScope.$broadcast('dialogs.wait.complete');
                                AlertService.showSuccess("Inscrição bem sucedida");
                            }, function (response) {
                                $scope.alterarInscritos = true;
                                $rootScope.$broadcast('dialogs.wait.complete');
                                if (response.data.errorCode) {
                                    switch (response.data.errorCode) {
                                        case 199:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. Confirme que nenhum dos integrantes tenham inscrições em outras equipe")
                                            break;
                                        case 662:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. Você já possui uma inscrição com status pago para esta etapa e não pode mudar de equipe.")
                                            break;
                                        case 661:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. Você está tentando remover um integrante que já possui inscrição com status paga.")
                                            break;
                                        case 663:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. Você está tentando adicionar um integrante que já possui inscrição em outra equipe nesta etapa.")
                                            break;
                                        case 990:
                                        case 801:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. Não foi possível salvar seus dados do cadastro. (" + response.data.errorCode + ")")
                                            break;
                                        case 701:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. O nome da equipe é obrigatório.")
                                            break;
                                        case 702:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. A categoria da equipe é obrigatório.")
                                            break;
                                        case 704:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. Falhou ao salvar a nova equipe, confirme que não existe outra equipe com mesmo nome.")
                                            break;





                                        default:
                                            AlertService.showError("Houve um erro ao efetuar inscrição. Tente novamente. (" + response.data.errorCode + " " + response.data.errorMsg + ").");
                                            break;
                                    }

                                } else {
                                    AlertService.showError("Houve um erro ao salvar");
                                }

                            });
                    } else {
                        console.log("Erro, não há etapa definida");
                    }
                }

            }]);

