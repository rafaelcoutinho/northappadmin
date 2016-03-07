var angularModule =
    angular.module('registroApp', ['ngRoute', 'north.services', 'ui.bootstrap', 'ngResource','ngSanitize']).constant("appConfigs", {
        //"context": "//cumeqetrekking.appspot.com/rest"
        "context": "//localhost/northServer/api.php"
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
        .controller('waitDialogCtrl', ['$scope', '$uibModalInstance',  '$timeout', 'data', function ($scope, $uibModalInstance, $timeout, data) {
            //-- Variables -----//

            $scope.header =data.header;
            $scope.msg = data.msg;
            $scope.progress = (angular.isDefined(data.progress)) ? data.progress : 100;
            $scope.icon = (angular.isDefined(data.fa) && angular.equals(data.fa, true)) ? 'fa fa-clock-o' : 'glyphicon glyphicon-time';

            //-- Listeners -----//
	
            // Note: used $timeout instead of $scope.$apply() because I was getting a $$nextSibling error
	
            // close wait dialog
            $scope.$on('dialogs.wait.complete', function () {
                $timeout(function () { $uibModalInstance.close(); $scope.$destroy(); });
            }); // end on(dialogs.wait.complete)
	
            // update the dialog's message
            $scope.$on('dialogs.wait.message', function (evt, args) {
                $scope.msg = (angular.isDefined(args.msg)) ? args.msg : $scope.msg;
            }); // end on(dialogs.wait.message)
	
            // update the dialog's progress (bar) and/or message
            $scope.$on('dialogs.wait.progress', function (evt, args) {
                $scope.msg = (angular.isDefined(args.msg)) ? args.msg : $scope.msg;
                $scope.progress = (angular.isDefined(args.progress)) ? args.progress : $scope.progress;
            }); // end on(dialogs.wait.progress)
	
            //-- Methods -----//

            $scope.getProgress = function () {
                return { 'width': $scope.progress + '%' };
            }; // end getProgress
	
        }])
        .provider('shortDialogsService', [function () {
            var _b = true; // backdrop
            var _k = true; // keyboard
            var _w = 'dialogs-default'; // windowClass
            var _bdc = 'dialogs-backdrop-default'; // backdropClass
            var _copy = true; // controls use of angular.copy
            var _wTmpl = null; // window template
            var _wSize = 'lg'; // large modal window default
            var _animation = false; // true/false to use animation

            var _fa = false; // fontawesome flag
            var _setOpts = function (opts) {
                var _opts = {};
                opts = opts || {};
                _opts.kb = (angular.isDefined(opts.keyboard)) ? !!opts.keyboard : _k; // values: true,false
                _opts.bd = (angular.isDefined(opts.backdrop)) ? opts.backdrop : _b; // values: 'static',true,false
                _opts.bdc = (angular.isDefined(opts.backdropClass)) ? opts.backdropClass : _bdc; // additional CSS class(es) to be added to the modal backdrop
                _opts.ws = (angular.isDefined(opts.size) && ((opts.size === 'sm') || (opts.size === 'lg') || (opts.size === 'md'))) ? opts.size : _wSize; // values: 'sm', 'lg', 'md'
                _opts.wc = (angular.isDefined(opts.windowClass)) ? opts.windowClass : _w; // additional CSS class(es) to be added to a modal window
                _opts.anim = (angular.isDefined(opts.animation)) ? !!opts.animation : _animation; // values: true,false
                return _opts;
            }; // end _setOpts
            this.$get = ['$uibModal', function ($uibModal) {
                return {
                    /**
                     * Wait Dialog
                     *
                     * @param	header 		string
                     * @param	msg 		string
                     * @param	progress 	int
                     * @param	opts	object
                     */
                    wait: function (header, msg, progress, opts) {
                        opts = _setOpts(opts);

                        return $uibModal.open({
                            templateUrl: '/dialogs/wait.html',
                            controller: 'waitDialogCtrl',
                            backdrop: opts.bd,
                            backdropClass: opts.bdc,
                            keyboard: opts.kb,
                            windowClass: opts.wc,
                            size: opts.ws,
                            animation: opts.anim,
                            resolve: {
                                data: function () {
                                    return {
                                        header: angular.copy(header),
                                        msg: angular.copy(msg),
                                        progress: angular.copy(progress),
                                        fa: _fa
                                    };
                                }
                            }
                        }); // end modal.open
                    } // end wait
                }}];
        }

        ])
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
                $scope.desconectar=function(desconectar){
                    facebookService.logout();
                    
                }
                $rootScope.$on('gotCompetidor', function (event, competidor) { console.log(competidor); $scope.competidor = competidor; });
            }])
        .controller('ModalCompetidor', function ($scope, $uibModalInstance, competidores) {
            $scope.competidores = competidores;
            $scope.novoCompetidor = { nome: "" };

            $scope.ok = function () {
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
        }).controller('ModalEquipe', function ($scope, $uibModalInstance, equipes, categorias) {
            $scope.equipes = equipes;
            $scope.novaEquipe = { nome: "" };
            $scope.categorias = categorias;
            $scope.ok = function () {
                $uibModalInstance.close($scope.novaEquipe);
            };

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
            '$scope', '$timeout', '$window', 'facebookService', '$location', '$routeParams', 'EtapasService', 'CompetidorService', 'EquipesService', 'CategoriaService', 'InscricaoService', 'AlertService', '$rootScope', '$uibModal', '$log','shortDialogsService',
            function ($scope, $timeout, $window, facebookService, $location, $routeParams, EtapasService, CompetidorService, EquipesService, CategoriaService, InscricaoService, AlertService, $rootScope, $uibModal, $log,shortDialogsService) {
                $scope.loadingVal = 0;
                shortDialogsService.wait("Carregando informações","Por favor aguarde",$scope.loadingVal);
                //TODO não salvar usuário antes de ele submeter form, nem mesmo associar a equipe!
                $scope.inscricao = {
                    integrantes: [],
                    lider: null,
                    etapa: {},
                    equipe: null
                };
                $scope.fbmsg = "Conectar com Facebook";
                $scope.selectCompetidor = function () {
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
                        if (selecionado) {
                            $scope.setCompetidor(selecionado);
                        }
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.selectEquipe = function () {
                    $scope.equipes = EquipesService.query();
                    $scope.categorias = CategoriaService.query();

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
                };

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

                $scope.setEquipe = function (equipe) {
                    if(equipe==null){
                        $scope.inscricao.equipe = null;
                        return;
                    }
                    //validar
                    if (equipe.nome == null || equipe.nome.length == 0) {
                        console.log("Nome obrigatório")
                        return;
                    }

                    $scope.inscricao.equipe = equipe;
                    if (equipe.id != null) {
                        $scope.inscricao.integrantes = CompetidorService.query({ filter0: "id_Equipe,eq," + equipe.id });

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
                    }else{
                        $scope.setEquipe(null);
                    }
                    $scope.onCompetidorSet(competidor);
                    $scope.showForm = false;
                }
                $scope.onCompetidorSet = function (competidor) {
                    $rootScope.$broadcast('gotCompetidor', competidor);
                    if (competidor.id != null && competidor.id != -1) {
                        InscricaoService.get({ idTrekker: competidor.id, idEtapa: $routeParams.id }, function (data) {

                            $scope.inscricaoServer = data;
                            if ($scope.inscricaoServer.id_Etapa && $scope.inscricaoServer.id_Trekker) {
                                AlertService.showError("Já existe uma inscrição sua nesta etapa.");
                                // $location.path("/inscricao/" + $scope.inscricao.id_Etapa + "/" + data.id_Trekker);
                            }

                        });
                    }
                }

                $scope.inscricao.etapa = EtapasService.get({ id: $routeParams.id }, function (resp) {
                    var diff = resp.data - new Date().getTime();
                    console.log(resp.data, " - ", new Date().getTime(), diff)
                    if (diff < 0) {
                        $scope.etapaFinalizada = true;
                        AlertService.showError("Etapa já completa, não é mais possível se inscrever nela.");

                    }
                });

                
                $scope.connectFB = function (fbUser) {
                    if (fbUser) {
                        if(fbUser.email){
                        $scope.fbmsg = "Conectar como " + fbUser.name + " ";
                        $rootScope.$broadcast('dialogs.wait.progress',{'progress' : 80});
                        CompetidorService.query({ filter0: "email,eq," + fbUser.email }, function (results) {
                            $rootScope.$broadcast('dialogs.wait.progress',{'progress' : 90});
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
                        }else{
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
                    $rootScope.$broadcast('dialogs.wait.progress',{'progress' : 30});
                    
                    facebookService.loginStatus().then(function (resp) {
                        $rootScope.$broadcast('dialogs.wait.progress',{'progress' : 50});
                        facebookService.meApi("email,name").then(function (data) {                           
                            $rootScope.$broadcast('dialogs.wait.progress',{'progress' : 70});                            
                            $scope.connectFB(data);
                            
                        },function(error){
                              $rootScope.$broadcast('dialogs.wait.complete');

                        });
                    }, function (resp) {
                        $rootScope.$broadcast('dialogs.wait.complete');
                    })
                };
                $scope.updateWithFB();
                $scope.inscrever = function () {
 
                    if ($scope.inscricao.etapa.id) {
                        shortDialogsService.wait("Inscrevendo equipe","Por favor aguarde",10);
                        console.log("inscrevendo", $scope.inscricao)
                        InscricaoService.inscrever({}, $scope.inscricao,
                            function (data) {
                                console.log(data)
                                $rootScope.$broadcast('dialogs.wait.complete');
                            }, function (response) {
                                 $rootScope.$broadcast('dialogs.wait.complete');
                                AlertService.showError("Houve um erro ao salvar");

                            });
                    }
                }

            }]);

