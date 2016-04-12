// var SERVER_ROOT ="//2-dot-cumeqetrekking.appspot.com"; 
 var SERVER_ROOT ="//cumeqetrekking.appspot.com";
    
var angularModule =
    angular.module('adminApp', ['north.services', 'ngRoute', 'ui.bootstrap', 'ngResource'])
        .constant("appConfigs", {
            "context": SERVER_ROOT+"/rest",
            // "context": "//localhost/northServer/api.php",
            "contextRoot": SERVER_ROOT

        }).config(['$routeProvider','$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider.when('/', {
                templateUrl: 'partials/main.html'

            })
                .when('/etapas/', {
                    templateUrl: 'partials/etapas.html',
                    controller: 'EtapasCtrl'
                }).when('/etapa/:id', {
                    templateUrl: 'partials/etapa.html',
                    controller: 'EtapaDetailsCtrl'
                }).when('/etapa/:id/relatorio', {
                    templateUrl: 'partials/printEtapa.html',
                    resolve: {
                        idEtapa: function ($route) {

                            return $route.current.params.id;

                        }
                    },
                    controller: 'PrintCtrl'
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
                }).when('/etapa/:idEtapa/grid', {
                    templateUrl: 'partials/grid.html',
                    controller: 'GridListCtrl'
                }).when('/gridconfs', {
                    templateUrl: 'partials/gridConfigs.html',
                    controller: 'GridConfListCtrl'
                }).when('/gridconf/:id', {
                    templateUrl: 'partials/gridConf.html',
                    controller: 'GridConfDetailsCtrl'
                }).when('/etapa/:idEtapa/inscricoes', {
                    templateUrl: 'partials/inscricoes.html',
                    controller: 'InscricoesListCtrl'
                }).when('/etapa/:idEtapa/inscricoes/:idTrekker', {
                    templateUrl: 'partials/inscricao.html',
                    controller: 'InscricaoDetailsCtrl'
                }).when('/etapa/:idEtapa/resultadoEdit', {
                    templateUrl: 'partials/resultadoEtapaForm.html',
                    controller: 'ResultadoFormCtrl',
                    resolve: {
                        idEtapa: function ($route) {

                            return $route.current.params.idEtapa;

                        }
                    }
                }).when('/etapa/:idEtapa/performanceEdit', {
                    templateUrl: 'partials/performanceEtapaForm.html',
                    controller: 'PerformanceFormCtrl',
                    resolve: {
                        idEtapa: function ($route) {

                            return $route.current.params.idEtapa;

                        }
                    }
                }).when('/etapa/:idEtapa/resultados', {
                    templateUrl: 'partials/resultados.html',
                    controller: 'ResultadosCtrl',
                    resolve: {
                        idEtapa: function ($route) {

                            return $route.current.params.idEtapa;

                        }
                    }
                }).otherwise({
                    redirectTo: '/'
                });
                 $httpProvider.interceptors.push('REST_Interceptor');

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
        .filter('zeroLeadNumber', function ($filter) {
            return function (input) {
                if (isNaN(input)) {
                    return "-";
                } else {
                    if (input < 10) {
                        return '0' + input;
                    } else {
                        return input;
                    }

                };
            };
        })
        .service('RelatorioService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource(appConfigs.context + '/RelatorioEtapa/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                },
                queryOutOfGrid:{
                    isArray: true,                    
                    url:appConfigs.contextRoot + '/app/enhanced/Etapa/:id/OutOfGrid'
                //    url: "http://localhost/northServer/app.php/Etapa/:id/OutOfGrid"
                    
                }
            });
        }])
        .service('ResultadoAdminService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
            return $resource(appConfigs.context + '/Resultado/:id', {}, {
                query: {
                    isArray: true,
                    transformResponse: jsonTransformQuery
                },
                save:{
                    method: "POST",
                    isArray: false
                },
                update:{
                    method: "PUT",
                    isArray: false
                },
                saveResultados: {
                    method: "PUT",
                    isArray: false,                    
                    url:appConfigs.contextRoot + '/GerenciaResultado.do'
                    // url: "http://localhost/northServer/performance.php"
                },
                 processPerformanceCSV: {
                    method: "POST",
                    isArray: true,                    
                    url:appConfigs.contextRoot + '/GerenciaResultado.do'
                    // url: "http://localhost/northServer/performance.php"

                }
            });
        }])
        
        
        .controller('ModalEditResultadoCtrl', function ($scope, $uibModalInstance, etapa, entry, results, AlertService, GridService, EquipesService, UtilsService) {
            $scope.etapa = etapa;
            $scope.equipes = [];
            $scope.equipe = entry.equipe;
            if ($scope.equipe == null) {
                $scope.equipe = { nome: '' };
            }
            $scope.isNew = true;
            $scope.entry = entry;

            $scope.results = results;

            $scope.getLabelCategoria = UtilsService.getLabelCategoria;

            EquipesService.query({}, function (data) {
                for (var index = 0; index < data.length; index++) {
                    var element = data[index];
                    var found = false;
                    for (var j = 0; j < $scope.results.length; j++) {
                        if($scope.results[j].grid.equipe){
                            if ($scope.results[j].grid.equipe != null && element.id == $scope.results[j].grid.equipe.id_Equipe) {
                                found = true;

                                break;
                            }
                        }
                    }
                    if (found == false) {
                        $scope.equipes.push(element);
                    }
                }
            });



            $scope.ok = function () {
                $scope.entry.grid.equipe={
                    id_Equipe:$scope.equipe.id,
                    nome:$scope.equipe.nome,
                    id_Categoria:$scope.equipe.id_Categoria,
                    descricao:$scope.equipe.descricao,
                    hora:$scope.entry.grid.hora,
                    minuto:$scope.entry.grid.minuto
                }
               
                console.log("#", $scope.equipe);
                if ($scope.equipe == null) {
                    return;
                }

                $uibModalInstance.close($scope.entry);

            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        })
        .controller('ModalDetalhesPCSCtrl', function ($scope, $uibModalInstance,  entry, AlertService, GridService, EquipesService, UtilsService) {
            $scope.entry=entry;
            $scope.getTipoLabel = function (tipo) {
                switch (tipo) {
                    case 1:
                        return "Tempo";
                        break;
                    case 2:
                        return "Virtual";
                        break;
                    case 3:
                        return "Cancelado";
                        break;
                    default:
                        break;
                }

            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .controller('ResultadosCtrl', function ($scope, idEtapa, EtapasService, UtilsService, $uibModal,CategoriaService,$location,$log,ResultadoAdminService,AlertService) {
            $scope.etapa = EtapasService.get({ id: idEtapa });
            $scope.categorias = CategoriaService.query({}, function (data) {
                $scope.categoria = { id_Categoria: data[0].id };

            });
            $scope.resultados = EtapasService.getResultados({ id: idEtapa });
            $scope.getLabelCategoria = UtilsService.getLabelCategoria;

            $scope.importCSV = function () {
                $location.path("/etapa/" + idEtapa + "/resultadoEdit");
            };
            $scope.importPerformanceCSV = function () {
                $location.path("/etapa/" + idEtapa + "/performanceEdit");
            };
            
            $scope.remover = function (item) {
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
                            return "Você tem certeza que deseja remover o resultado para esta equipe?";
                        }
                    }
                });
                modalInstance.result.then(function () {
                    ResultadoAdminService.remove(item,
                        function (data) {
                            AlertService.showSuccess("Resultado removido");
                          $scope.resultados = EtapasService.getResultados({ id: idEtapa });

                        }, function (data) {
                            AlertService.showError("Houve um erro ao remover");
                        });
                }, function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                });

            }
            $scope.addResultado = function () {
                $scope.editItem({ equipe: null })
            }
            $scope.editItem = function (item) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modalResultadoContent.html',
                    controller: 'ModalEditResultadoCtrl',
                    size: 'sm',
                    resolve: {
                        entry: function () {
                            return item;
                        },
                        etapa: function () {
                            return $scope.etapa;
                        },

                        results: function () {
                            return $scope.resultados;
                        }
                    }
                });

                modalInstance.result.then(function (selecionado) {

                    if (selecionado.id_Equipe == null) {
                        selecionado.id_Equipe = selecionado.grid.id;
                        selecionado.id_Etapa = $scope.etapa.id;
                        ResultadoAdminService.save(selecionado, function (data) {
                            $scope.resultados = EtapasService.getResultados({ id: idEtapa });
                        });

                    } else {
                        ResultadoAdminService.update(selecionado, function (data) {
                            $scope.resultados = EtapasService.getResultados({ id: idEtapa });
                        });
                    }

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
            $scope.showDetalhes = function (item) {
                 if(!item.pcs){
                    item.pcs = EtapasService.getPerformance({ id: idEtapa, id_Equipe:item.id_Equipe });
                } 
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modalPCS.html',
                    controller: 'ModalDetalhesPCSCtrl',
                    size: 'sm',
                    resolve: {
                        entry: function () {
                            return item;
                        }
                    }
                });

                modalInstance.result.then(function () {

                    
                }, function () {
                    
                });
            }
        })
        
        .controller('PerformanceFormCtrl', function ($scope, idEtapa, EtapasService, UtilsService, ResultadoAdminService, $uibModal, $log) {
            $scope.processCsv = function () {
                ResultadoAdminService.processPerformanceCSV({ etapa: idEtapa }, $scope.csvData, function (data) {
                    $scope.preResultados = data;

                }, function (error) {
                    console.log("erro", error);
                });
            }
            $scope.getPoints = function (item) {
                var pcs = item.pcs;
                
                var totalPerdido = 0;
                var totalZerados = 0;
                var pcsNaoPassados = 0;
                for (var index = 0; index < pcs.length; index++) {
                    var element = pcs[index];
                    if (element.Tmp) {
                        if (isNaN(element.Tmp)) {
                            if (element.Tmp == "*900") {
                                pcsNaoPassados++;
                                totalPerdido += 900;
                            } else {
                                console.log("err", element,item);
                            }
                        } else {
                            if(element.Tmp==0){
                                totalZerados++;
                            }
                            totalPerdido += Math.abs(element.Tmp);
                        }
                    } else if (element.Virt) {
                        if (isNaN(element.Virt)) {
                            if (element.Virt == "*900") {
                                pcsNaoPassados++;
                                totalPerdido += 900;
                            } else {
                                console.log("err", element,item);
                            }
                        } else {
                            if(element.Virt==0){
                                totalZerados++;
                            }
                            totalPerdido += Math.abs(element.Virt);
                        }
                    }

                }
                item.PtsPerdidos=totalPerdido;
                item.PCZerado=totalZerados;
                item.PtsPerdidos=totalPerdido;
                item.PCPassou=(pcs.length-pcsNaoPassados);
                if(item.grid){//todo mover pra outro lugar
                    item=item.grid.id_Equipe;
                }
                return totalPerdido;
            }
            $scope.accentsTidy = function (s) {
                var r = s.toLowerCase();
                r = r.replace(new RegExp(/\s/g), "");
                r = r.replace(new RegExp(/[àáâãäå]/g), "a");
                r = r.replace(new RegExp(/æ/g), "ae");
                r = r.replace(new RegExp(/ç/g), "c");
                r = r.replace(new RegExp(/[èéêë]/g), "e");
                r = r.replace(new RegExp(/[ìíîï]/g), "i");
                r = r.replace(new RegExp(/ñ/g), "n");
                r = r.replace(new RegExp(/[òóôõö]/g), "o");
                r = r.replace(new RegExp(/œ/g), "oe");
                r = r.replace(new RegExp(/[ùúûü]/g), "u");
                r = r.replace(new RegExp(/[ýÿ]/g), "y");
                r = r.replace(new RegExp(/\W/g), "");
                return r;
            };
            $scope.diffNames = function (item) {
                if(!item.grid.equipe){
                    return true;
                }
                return item.grid.equipe != null && $scope.accentsTidy(item.grid.equipe.nome) != $scope.accentsTidy(item.Piloto);
            }
            $scope.getLabelCategoria = UtilsService.getLabelCategoria;
            $scope.salvarResultados = function () {
                ResultadoAdminService.saveResultados({ etapa: idEtapa }, $scope.preResultados);
            }
            $scope.selecao = {};
            $scope.editEquipe = function (item) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'equipeModal.html',
                    controller: 'ModalEditResultadoCtrl',
                    size: 'sm',
                    resolve: {
                        entry: function () {
                            return item;
                        },
                        results: function () {
                            return $scope.preResultados;
                        },
                        etapa: function () {
                            return $scope.etapa;
                        }
                    }
                });

                modalInstance.result.then(function (selecionado) {
                    for (var index = 0; index < $scope.preResultados.length; index++) {
                        var element = $scope.preResultados[index];
                        console.log(element, selecionado);
                        if (element.Num == selecionado.Num) {
                            $scope.preResultados[index] = selecionado;
                            return;
                        }
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }
            $scope.getLabelCategoria = UtilsService.getLabelCategoria;
            $scope.updateBreadcrumb = function () {
                $scope.title = 'Gerenciar Resultados ' ;
                
                $scope.bcs = [{ title: 'Home', url: '#/' }, { title: 'Etapas', url: '#/etapas' }, { title: 'Etapa', url: '#/etapa/' + idEtapa }, { title: 'Importar CSV', url: '',active:true }]
            }
        })
       
        .controller('ResultadoFormCtrl', function ($scope, idEtapa, EtapasService, UtilsService, ResultadoAdminService, $uibModal, $log) {
            $scope.etapa = EtapasService.get({ id: idEtapa });
            $scope.processCsv = function () {
                ResultadoAdminService.processCSV({ etapa: idEtapa }, $scope.csvData, function (data) {
                    $scope.preResultados = data;
                    
                }, function (error) {
                    console.log("erro", error);
                });
            }
            $scope.salvarResultados = function () {
                ResultadoAdminService.saveResultados({ etapa: idEtapa }, $scope.preResultados);
            }
 
            $scope.accentsTidy = function (s) {
                var r = s.toLowerCase();
                r = r.replace(new RegExp(/\s/g), "");
                r = r.replace(new RegExp(/[àáâãäå]/g), "a");
                r = r.replace(new RegExp(/æ/g), "ae");
                r = r.replace(new RegExp(/ç/g), "c");
                r = r.replace(new RegExp(/[èéêë]/g), "e");
                r = r.replace(new RegExp(/[ìíîï]/g), "i");
                r = r.replace(new RegExp(/ñ/g), "n");
                r = r.replace(new RegExp(/[òóôõö]/g), "o");
                r = r.replace(new RegExp(/œ/g), "oe");
                r = r.replace(new RegExp(/[ùúûü]/g), "u");
                r = r.replace(new RegExp(/[ýÿ]/g), "y");
                r = r.replace(new RegExp(/\W/g), "");
                return r;
            };
            $scope.diffNames = function (item) {
                return item.grid != null && $scope.accentsTidy(item.grid.nome) != $scope.accentsTidy(item.Piloto);
            }
            $scope.selecao = {};
            $scope.editEquipe = function (item) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'equipeModal.html',
                    controller: 'ModalEditResultadoCtrl',
                    size: 'sm',
                    resolve: {
                        entry: function () {
                            return item;
                        },
                        results: function () {
                            return $scope.preResultados;
                        },
                        etapa: function () {
                            return $scope.etapa;
                        }
                    }
                });

                modalInstance.result.then(function (selecionado) {
                    for (var index = 0; index < $scope.preResultados.length; index++) {
                        var element = $scope.preResultados[index];
                        console.log(element, selecionado);
                        if (element.Num == selecionado.Num) {
                            $scope.preResultados[index] = selecionado;
                            return;
                        }
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }
            $scope.getLabelCategoria = UtilsService.getLabelCategoria;
            $scope.updateBreadcrumb = function () {
                $scope.title = 'Gerenciar Resultados ' ;
                
                $scope.bcs = [{ title: 'Home', url: '#/' }, { title: 'Etapas', url: '#/etapas' }, { title: 'Etapa', url: '#/etapa/' + idEtapa }, { title: 'Importar CSV', url: '',active:true }]
            }

        })
        .controller('PrintCtrl', function ($scope, RelatorioService, idEtapa, EtapasService,UtilsService) {
            $scope.etapa = EtapasService.get({ id: idEtapa });
            $scope.data = new Date();
           $scope.report=  RelatorioService.query({ filter0: 'id_Etapa,eq,'+idEtapa });
            $scope.lastChangeIndex=-1;
            $scope.lastChangeCat=-1;
            $scope.getNumeracao=function(item,index){
                if($scope.lastChangeCat!=item.categoria_Equipe){
                    $scope.lastChangeIndex=index;
                    $scope.lastChangeCat=item.categoria_Equipe;
                }
                var gridCat = item.categoria_Equipe<3?1:item.categoria_Equipe;
                
                return index+UtilsService.getGridInfo(gridCat).numeracao - $scope.lastChangeIndex;
            }
            $scope.reportOutOfGrid = RelatorioService.queryOutOfGrid({ id:idEtapa });
            $scope.printIt = function () {
                window.print();
            }
            $scope.getLabelCategoria= UtilsService.getLabelCategoria;

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
        .controller('ModalLargadaCtrl', function ($scope, $uibModalInstance, gridConfig, gridInfo, etapa, equipes, AlertService, GridService,EquipesService,UtilsService) {
            $scope.gridConfig = gridConfig;
            
            $scope.gridInfo = gridInfo;
            $scope.etapa = etapa;
            $scope.equipes = [];
            $scope.equipesNoGrid = equipes;
            console.log("$scope.equipesNoGrid",$scope.equipesNoGrid)
            $scope.isNew=false;
            
            $scope.getLabelCategoria = UtilsService.getLabelCategoria;
            if (gridInfo == null) {
                $scope.isNew = true;
                $scope.gridInfo = {
                    id_Etapa:$scope.etapa.id
                    
                };
                EquipesService.query({}, function (data) {
                    for (var index = 0; index < data.length; index++) {
                        var element = data[index];
                        var found = false;
                        for (var j = 0; j < $scope.equipesNoGrid.length; j++) {
                            
                            if (element.id == $scope.equipesNoGrid[j].id_Equipe) {
                                found = true;
                                
                                break;
                            }
                        }
                        if (found == false) {
                            $scope.equipes.push(element);
                        }
                    }
                });
            }


            $scope.ok = function () {
                if ($scope.largadaForm.$valid == false) {
                    return;
                }
                if ($scope.isNew == true) {
                    

                    $scope.gridInfo.id_Equipe = $scope.gridInfo.equipe.id;
                    $scope.gridInfo.id_Etapa = $scope.etapa.id;
                    $scope.gridInfo.nome_Equipe = $scope.gridInfo.equipe.nome;
                    $scope.gridInfo.categoria_Equipe = $scope.gridInfo.equipe.id_Categoria;
                    $scope.gridInfo.type = 1;

                    GridService.save($scope.gridInfo, function (data) {
                        $uibModalInstance.close(newGridInfo);
                    }, function (error) {
                        console.log("Error", error)
                        AlertService.showError("Houve um erro ao inserir no grid: "+error);
                    });
                } else {
                    var newGridInfo = $scope.gridInfo;

                    GridService.update(newGridInfo, function (data) {

                        $uibModalInstance.close(newGridInfo);
                    }, function (error) {
                        AlertService.showError("Houve um erro ao atualizar o grid: "+error);
                    });
                }


            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        })
        .controller('GridListCtrl', [

            '$scope', '$timeout', '$window', '$routeParams', 'GridService', '$location', 'CategoriaService', 'GridConfService', '$uibModal', '$log', 'EtapasService','UtilsService','AlertService',
            function ($scope, $timeout, $window, $routeParams, GridService, $location, CategoriaService, GridConfService, $uibModal, $log, EtapasService,UtilsService,AlertService) {
                $scope.sortItem = {
                    field: ["hora", "minuto"],
                    reverse: false
                };
                $scope.gridConfig = 1;
                $scope.getGridConf = UtilsService.getGridInfo;
                
                $scope.grids = GridConfService.query({}, function (data) {
                    $scope.items = GridService.query({ idEtapa: $routeParams.idEtapa, idConfig: $scope.gridConfig });
                });
                $scope.refresh = function () {
                    $scope.items = GridService.query({ idEtapa: $routeParams.idEtapa, idConfig: $scope.gridConfig });
                }
                $scope.categorias = CategoriaService.query({});

                $scope.updateGrid = function () {
                    $scope.items = GridService.query({ idEtapa: $routeParams.idEtapa, idConfig: $scope.gridConfig });
                }
                $scope.addEquipe = function(){
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'largadaModalContent.html',
                        controller: 'ModalLargadaCtrl',
                        size: 'sm',
                        resolve: {
                            gridConfig: function () {
                                return $scope.getGridConf(); 
                                
                            },
                            gridConfigs:function(){
                                return $scope.grids;
                            },
                            equipes:function(){
                                return $scope.items;
                            },  
                            gridInfo: function () {
                                return null;
                            },
                            etapa: function () {
                                return $scope.etapa;
                            }
                        }
                    });

                    modalInstance.result.then(function (selecionado) {
                        for (var index = 0; index < $scope.items.length; index++) {
                            var element = $scope.items[index];
                            if (element.id_Equipe == selecionado.id_Equipe) {                                
                                $scope.items[index] = selecionado;
                                return;
                            }
                        }
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
                $scope.etapa = EtapasService.get({ id: $routeParams.idEtapa });
                $scope.getLabelCategoria = UtilsService.getLabelCategoria;
                $scope.inscOrder = "largada";
                $scope.sortBy = function (col) {
                    $scope.inscOrder = col;
                }
                $scope.removerDoGrid = function(item){
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
                                return "Você tem certeza que deseja remover esta equipe do Grid?";
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        GridService.remove(item,
                            function (data) {                                
                                AlertService.showSuccess("Inscrição removida");
                                 $scope.refresh();

                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                }
                $scope.updateLargada = function (item) {
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'largadaModalContent.html',
                        controller: 'ModalLargadaCtrl',
                        size: 'sm',
                        resolve: {
                            gridConfigs:function(){
                                return $scope.grids;
                            },
                            gridConfig: function () {
                                for (var index = 0; index < $scope.grids.length; index++) {
                                    var element = $scope.grids[index];
                                    if (element.id == $scope.gridConfig) {
                                        return element;
                                    }
                                }
                                return null;
                            },
                            gridInfo: function () {
                                return item;
                            },equipes:function(){
                                return [];
                            },  
                            etapa: function () {
                                return $scope.etapa;
                            }
                        }
                    });

                    modalInstance.result.then(function (selecionado) {
                        for (var index = 0; index < $scope.items.length; index++) {
                            var element = $scope.items[index];
                            if (element.id_Equipe == selecionado.id_Equipe) {                                
                                $scope.items[index] = selecionado;
                                return;
                            }
                        }
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            }])
        .controller('GridConfListCtrl', [

            '$scope', '$timeout', '$window', '$routeParams', 'GridConfService', '$location',
            function ($scope, $timeout, $window, $routeParams, GridConfService, $location) {

                $scope.items = GridConfService.query();
                $scope.sortBy = function (col) {
                    $scope.inscOrder = col;
                }

                $scope.novo = function () {
                    $location.path("/etapa/" + $routeParams.idEtapa + "/gridconfs/-1");
                }
            }])
        .controller('GridConfDetailsCtrl', [
            '$scope', '$timeout', '$location', '$routeParams', 'GridConfService', 'CategoriaService', '$rootScope', '$uibModal', 'AlertService', 'EquipesService', 'InscricaoService',
            function ($scope, $timeout, $location, $routeParams, GridConfService, CategoriaService, $rootScope, $uibModal, AlertService, EquipesService, InscricaoService) {

                if ($routeParams.idTrekker == -1) {
                    $scope.item = {}
                } else {
                    $scope.item = GridConfService.get({ id: $routeParams.id }, function (data) {

                    });
                }

                $scope.saveData = function () {

                    GridConfService.save({ id: $scope.item.id }, $scope.item,
                        function (data) {

                            AlertService.showSuccess("Salvo com sucesso");

                        }, function (response) {

                            AlertService.showError("Houve um erro ao salvar");

                        });
                }
                $scope.cancel = function () {
                    $location.path("/gridconfs");
                }
            }])
        .controller('InscricoesListCtrl', [

            '$scope', '$timeout', '$window', '$routeParams', 'InscricaoService', 'EtapasService', '$location','$uibModal','AlertService',
            function ($scope, $timeout, $window, $routeParams, InscricaoService, EtapasService, $location,$uibModal,AlertService) {
                $scope.inscOrder = "data";
                $scope.idEtapa = $routeParams.idEtapa;
                $scope.etapa = EtapasService.get({ id: $routeParams.idEtapa });
                $scope.refresh = function () {
                    $scope.items = InscricaoService.query({ filter0: "id_Etapa,eq," + $routeParams.idEtapa });
                }
                $scope.items = InscricaoService.query({ filter0: "id_Etapa,eq," + $routeParams.idEtapa });
                $scope.go = function (n) {
                    $scope.currentPage += n;
                }
                $scope.sortItem = {
                    field: "data",
                    reverse: false
                }
                $scope.apagar =function(item){
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
                                return "Você tem certeza que deseja remover esta Inscrição?";
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        InscricaoService.remove(item,
                            function (data) {                                
                                AlertService.showSuccess("Inscrição removida");
                                 $scope.refresh();

                            }, function (data) {
                                AlertService.showError("Houve um erro ao remover");
                            });
                    }, function () {
                        // $log.info('Modal dismissed at: ' + new Date());
                    });
                }
               
                $scope.marcarPago = function (item, state) {
                    var p = item.paga;
                    item.pagoTemp = true;
                    InscricaoService.marcarPagto(
                        { 
                            id_Trekker: item.id_Trekker,
                            id_Equipe: item.id_Equipe,  
                            id_Etapa: $routeParams.idEtapa, 
                            
                            paga: state }, function (successo) {
                        item.paga = state;
                        item.pagoTemp = false;
                    }, function (error) {
                        item.pagoTemp = false;
                    })

                }

                $scope.nova = function () {
                    $location.path("/etapa/" + $routeParams.idEtapa + "/inscricoes/-1");
                }
            }])
        .controller('InscricaoDetailsCtrl', [
            '$scope', '$timeout', '$location', '$routeParams', 'CompetidorService', 'CategoriaService', '$rootScope', '$uibModal', 'AlertService', 'EquipesService', 'InscricaoService',
            function ($scope, $timeout, $location, $routeParams, CompetidorService, CategoriaService, $rootScope, $uibModal, AlertService, EquipesService, InscricaoService) {

                if ($routeParams.idTrekker == -1) {
                    $scope.inscricao = {}
                } else {
                    $scope.inscricao = InscricaoService.get({ idTrekker: $routeParams.idTrekker, idEtapa: $routeParams.idEtapa }, function (data) {
                        $scope.inscricao.trekker = {
                            nome: data.nome,
                            id: data.id_Trekker,
                            email: data.email
                        }
                    });
                }
                $scope.competidores = CompetidorService.query();
                $scope.saveData = function () {
                    $scope.inscricao.id_Trekker = $scope.inscricao.trekker.id;
                    $scope.inscricao.id_Etapa = $routeParams.idEtapa;
                    $scope.inscricao.data = new Date().getTime();
                    InscricaoService.save({}, $scope.inscricao,
                        function (data) {

                            AlertService.showSuccess("Salvo com sucesso");

                        }, function (response) {

                            AlertService.showError("Houve um erro ao salvar");

                        });
                }
            }])
        .controller('CompetidoresListCtrl', [

            '$scope', '$timeout', '$window', '$routeParams', 'CompetidorService', '$location',
            function ($scope, $timeout, $window, $routeParams, CompetidorService, $location) {
                $scope.go = function (n) {
                    $scope.currentPage += n;
                }
                $scope.sortItem = {
                    field: "nome",
                    reverse: false
                }
                $scope.currentPage = 0;
                $scope.pageSize = 10;
                $scope.competidores = CompetidorService.query();
                $scope.numberOfPages = function () {
                    return Math.ceil($scope.competidores.length / $scope.pageSize);
                }
                $scope.novo = function () {
                    $location.path("/competidor/-1");
                }
                $scope.getEstado = function (competidor) {
                    switch (competidor.state) {
                        case "PASSIVE":
                            return "Adicionado";
                        case "PASSIVE_EMAIL":
                            return "Erro Email";
                        case "INSCRIPTION":
                            return "Lider";
                        case "ACTIVE":
                            return "OK";
                    }
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
                            if ($scope.entity.id == null || $scope.entity.id == -1) {
                                $scope.entity = data;
                                $location.path("/competidor/" + data.id);
                            }

                            AlertService.showSuccess("Salvo com sucesso");

                        }, function (response) {
                            if (response.data.errorMsg && response.data.errorMsg.indexOf("Duplicate entry") > -1) {
                                AlertService.showError("Nome ou email de competidor já existente");
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
            '$scope', '$timeout', '$window', '$routeParams', 'EquipesService', '$location', 'CategoriaService',
            function ($scope, $timeout, $window, $routeParams, EquipesService, $location, CategoriaService) {
                $scope.go = function (n) {
                    $scope.currentPage += n;
                }
                $scope.sortItem = {
                    field: "nome",
                    reverse: false
                }
                $scope.currentPage = 0;
                $scope.pageSize = 10;

                $scope.numberOfPages = function () {
                    return Math.ceil($scope.equipes.length / $scope.pageSize);
                }
                $scope.equipes = [];
                $scope.categorias = CategoriaService.query({}, function () {
                    $scope.equipes = EquipesService.query();
                });
                $scope.getCategoriaLabel = function (id) {
                    for (var index = 0; index < $scope.categorias.length; index++) {
                        var element = $scope.categorias[index];
                        if (element.id == id) {
                            return element.nome;
                        }

                    }
                    return "?";
                }
                $scope.novo = function () {
                    $location.path("/equipe/-1");
                }
            }])
        .controller('EquipeDetailsCtrl', [
            '$scope', '$timeout', '$location', '$routeParams', 'EquipesService', 'CategoriaService', '$rootScope', '$uibModal', 'AlertService', 'CompetidorService',
            function ($scope, $timeout, $location, $routeParams, EquipesService, CategoriaService, $rootScope, $uibModal, AlertService, CompetidorService) {


                $scope.categorias = CategoriaService.query({}, function () {
                    if ($routeParams.id == -1) {
                        $scope.equipe = {}
                    } else {
                        $scope.equipe = EquipesService.get({ id: $routeParams.id }, function (equipe) {
                            $scope.competidores = CompetidorService.query({ filter0: "id_Equipe,eq," + equipe.id });
                            $scope.val = 3
                        });
                    }
                });
                $scope.saveData = function () {
                    EquipesService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.equipe,

                        function (data) {
                            if ($scope.equipe.id == null || $scope.equipe.id == -1) {
                                $scope.equipe = data;
                                $location.path("/equipe/" + data.id);
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
                        if ($scope.destaque.id == null || $scope.destaque.id == -1) {
                            $scope.destaque = data;
                            $location.path("/destaque/" + data.id);
                        }

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
                            if ($scope.etapa.dataLimiteLote1) {
                                $scope.dataLimiteLote1 = new Date(parseInt($scope.etapa.dataLimiteLote1));
                            }
                            if ($scope.etapa.dataLimiteLote2) {
                                $scope.dataLimiteLote2 = new Date(parseInt($scope.etapa.dataLimiteLote2));
                            }
                            if ($scope.etapa.dataLimiteLote3) {
                                $scope.dataLimiteLote3 = new Date(parseInt($scope.etapa.dataLimiteLote3));
                            }
                        });
                }
                $scope.$watch('formData', function (newValue) {
                    try {
                        $scope.etapa.data = newValue.getTime();
                    } catch (e) {
                    }
                });


                $scope.saveData = function () {
                    if ($scope.dataLimiteLote1) {
                        $scope.etapa.dataLimiteLote1 = $scope.dataLimiteLote1.getTime();
                    }
                    if ($scope.dataLimiteLote2) {
                        $scope.etapa.dataLimiteLote2 = $scope.dataLimiteLote2.getTime();
                    }
                    if ($scope.dataLimiteLote3) {
                        $scope.etapa.dataLimiteLote3 = $scope.dataLimiteLote3.getTime();
                    }


                    EtapasService.save({ id: $routeParams.id != -1 ? $routeParams.id : null }, $scope.etapa, function (data) {
                        if ($scope.etapa.id == null || $scope.etapa.id == -1) {
                            $scope.etapa = data;
                            $location.path("/etapa/" + data.id);
                        }
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
                            if ($scope.location.id == null || $scope.location.id == -1) {
                                $scope.location = data;
                                $location.path("/localidade/" + data.id);
                            }

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
        .directive('colSorter', function () {
            function link(scope, element, attrs) {

                scope.reverse = true;
                element.on('click', function (event) {
                    if (scope.sortVar.field != scope.sortField) {
                        scope.sortVar.field = scope.sortField;
                    }

                    scope.reverse = !scope.reverse;
                    scope.sortVar.reverse = scope.reverse;

                    scope.$apply();
                });

                scope.$watch('sortVar.field', function (value) {

                    if (value != scope.sortField) {
                        scope.reverse = null;
                        console.log("mudou ", value, scope.sortField);
                    }

                }, true)


                element.on('$destroy', function () {

                });
            }

            return {
                replace: true,
                transclude: true,
                scope: {
                    sortField: '=field',
                    sortVar: '=var'
                },
                template: '<i class="fa" ng-class="{\'fa-sort-up\':reverse,\'fa-sort-down\':reverse==false,\'fa-sort\':reverse==null}"></i>',
                link: link
            };

        }).directive('loading', ['$http', function ($http) {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs) {
                    scope.isLoading = function () {
                        
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function (v) {
                        try {
                            
                            if (v) {
                                elm[0].className = "fa fa-spin fa-refresh"
                            } else {
                                elm[0].className = "ng-hide"
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            };

        }])
    ;
