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
var jsonTransformQueryGetSingle = function (data, headers) {
    return jsonTransformQuery(data, headers)[0];
}
angular.module('north.services', ['ngResource'])
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
                this.alert(text, timeout, 'danger');
            }
        }
    }])

    .service('CompetidorService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {

        return $resource(appConfigs.context + '/Competidor/:id', {}, {
            query: {
                isArray: true,
                transformResponse: jsonTransformQuery
            },
            remove: {
                method: 'DELETE',
                url: appConfigs.context + '/Trekker/:id'
            },
            save: {
                method: 'POST',
                url: appConfigs.context + '/Trekker/:id'
            },
            associateEquipe: {
                method: 'POST',
                isArray: false,
                url: appConfigs.context + '/Trekker_Equipe'
            },
            desassociateEquipe: {
                method: 'PUT',
                isArray: false,
                url: appConfigs.context + '/Trekker_Equipe'
            }
        })
    }])
    .service('GridService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {

        return $resource(appConfigs.context + '/GridFull?filter0=id_Etapa,eq,:idEtapa&filter1=id_Config,eq,:idConfig', {}, {
            get: {
                isArray: false,
                url: appConfigs.context + '/GridFull?filter0=id_Etapa,eq,:idEtapa&filter1=id_Equipe,eq,:idEquipe',
                transformResponse: jsonTransformQueryGetSingle
            },
            query: {
                isArray: true,
                url: appConfigs.context + '/GridFull?filter0=id_Etapa,eq,:idEtapa&filter1=id_Config,eq,:idConfig',
                transformResponse: jsonTransformQuery
            },
            save: {
                method: 'POST',
                isArray: false,
                url: appConfigs.contextRoot + '/AlteraGrid.do'
                // url: "http://localhost/northServer/alteraGrid.php"
            },
            remove: {
                method: 'DELETE',
                isArray: false,
                url: appConfigs.contextRoot + '/AlteraGrid.do'
                // url: "http://localhost/northServer/alteraGrid.php"
            },
            update: {
                method: 'PUT',
                isArray: false,
                url: appConfigs.contextRoot + '/AlteraGrid.do'
                // url: "http://localhost/northServer/alteraGrid.php"
            }
        })
    }])
    .service('InscricaoService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {

        return $resource(appConfigs.context + '/InscricaoFull/', {}, {
            get: {
                isArray: false,
                url: appConfigs.context + '/InscricaoFull?filter0=id_Trekker,eq,:idTrekker&filter1=id_Etapa,eq,:idEtapa',
                transformResponse: jsonTransformQueryGetSingle
            },
            checkCompetidor: {
                method: "GET",
                isArray: false,
                url: appConfigs.contextRoot + '/endpoints/RegisterInscription'
            },
            registerUser: {
                method: "POST",
                isArray: false,
                url: appConfigs.contextRoot + '/endpoints/RegisterInscription'
            },
            startPwdRecovery: {
                method: "POST",
                isArray: false,
                url: "https:" +appConfigs.contextRoot + "/endpoints/senha/LembrarSenha"
            },
            loginUser: {
                method: "POST",
                isArray: false,
                url: appConfigs.contextRoot + '/endpoints/Login'
            },

            queryCompetidores: {
                isArray: true,
                url: appConfigs.contextRoot + '/app/enhanced/CompetidorInscricao/:idEtapa/:idEquipe'
            },
            query4Equipe: {
                isArray: true,
                url: appConfigs.context + '/InscricaoFull?filter0=id_Equipe,eq,:id&filter1=id_Etapa,eq,:idEtapa',
                transformResponse: jsonTransformQuery
            },
            query: {
                isArray: true,
                transformResponse: jsonTransformQuery
            },
            save: {
                method: 'POST',
                isArray: false,
                url: appConfigs.context + '/Inscricao'
            },
            remove: {
                method: 'DELETE',
                isArray: false,
                url: appConfigs.contextRoot + '/Inscrever.do'
                // url: "http://localhost/northServer/inscrever.php"
            },

            inscrever: {
                method: 'POST',
                isArray: false,
                url: appConfigs.contextRoot + '/Inscrever.do'
                // url: "http://localhost/northServer/inscrever.php"
            },
            marcarPagto: {
                method: 'PUT',
                isArray: false,
                url: appConfigs.contextRoot + '/SetPago.do'
                // url: "http://localhost/northServer/marcarPaga.php"
            }
        })
    }])
    .service('GridConfService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {

        return $resource(appConfigs.context + '/GridConfig/:id', {}, {
            query: {
                isArray: true,
                cache: true,
                transformResponse: jsonTransformQuery
            }
        })
    }])
    .service('EtapasService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {

        return $resource(appConfigs.context + '/Etapa/:id', {}, {
            query: {
                isArray: true,
                transformResponse: jsonTransformQuery
            },
            getEtapaAtual: {
                isArray: false,
                url: appConfigs.contextRoot + '/app/enhanced/EtapaAtual'
                // url: "http://localhost/northServer/app.php/EtapaAtual"
            },
            getPerformance: {
                isArray: true,
                url: appConfigs.contextRoot + '/app/enhanced/Etapa/:id/Resultado'
                // url: "http://localhost/northServer/app.php/Etapa/:id/Performance/:id_Equipe"
            },
            getResultados: {
                isArray: true,
                url: appConfigs.contextRoot + '/app/enhanced/Etapa/:id/Resultado'
                // url: "http://localhost/northServer/app.php/Etapa/:id/Resultado"
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
                transformResponse: jsonTransformQuery,
                cache: true
            }
        });

    }])
    .service('UtilsService', ['$http', '$q', '$resource', 'appConfigs', 'CategoriaService', 'GridConfService', function ($http, $q, $resource, appConfigs, CategoriaService, GridConfService) {
        var cats = CategoriaService.query();
        var grids = GridConfService.query();
        return {
            getGridInfo: function (id) {
                for (var index = 0; index < grids.length; index++) {
                    var element = grids[index];
                    if (element.id == id) {
                        return element;
                    }
                }
                return null;
            },
            getLabelCategoria: function (id) {
                for (var index = 0; index < cats.length; index++) {
                    var element = cats[index];
                    if (element.id == id) {
                        return element.nome;
                    }
                }
            }

        }
    }])
    .service('EquipesService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
        return $resource(appConfigs.context + '/Equipe/:id', {}, {
            query: {
                isArray: true,
                transformResponse: jsonTransformQuery
            }
        });
    }])
    .service('DestaquesService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
        return $resource(appConfigs.context + '/Destaque/:id', {}, {
            query: {
                isArray: true,
                transformResponse: jsonTransformQuery
            }
        });

    }]).factory('REST_Interceptor', ['appConfigs',

        function (appConfigs) {
            var DEBUG = false;
            var V2 = true;
            var request = function (config) {
                if (DEBUG) {

                    var url = config.url;

                    if (config.url.indexOf("AlteraGrid") > 0) {
                        config.url = "http://localhost/northServer/alteraGrid.php";
                    } else if (config.url.indexOf("Inscrever.do") > -1) {
                        config.url = "http://localhost/northServer/inscrever.php";
                    } else if (config.url.indexOf(appConfigs.contextRoot + '/app/enhanced') > -1) {
                        config.url = config.url.replace(appConfigs.contextRoot + '/app/enhanced', "http://localhost/northServer/app.php");

                    } else if (config.url.indexOf(appConfigs.contextRoot + '/endpoints/RegisterInscription') > -1) {
                        config.url = "http://localhost/northServer/userRegisterInscription.php";

                    } else if (config.url.indexOf(appConfigs.contextRoot + '/endpoints/Login') > -1) {
                        config.url = "http://localhost/northServer/login.php";
                    } else if (config.url.indexOf(appConfigs.contextRoot + 'app/rest') > -1) {
                        config.url = config.url.replace(appConfigs.contextRoot + "app/rest", "http://localhost/northServer/apiPub.php");

                    } else if (config.url.indexOf(appConfigs.contextRoot + '/rest') > -1) {
                        config.url = config.url.replace(appConfigs.contextRoot + "/rest", "http://localhost/northServer/api.php");
                    } else if (config.url.indexOf(appConfigs.contextRoot + '/SetPago.do') > -1) {
                        config.url = config.url.replace(appConfigs.contextRoot + "/SetPago.do", "http://localhost/northServer/marcarPaga.php");
                    }else if(config.url.indexOf(appConfigs.contextRoot + '/endpoints/senha/') > -1) {
                        config.url = config.url.replace(appConfigs.contextRoot + '/endpoints/senha/', "http://localhost/northServer/senha.php/");                    }

                    if (url != config.url) {
                        console.debug("Url alterada ", config.url, url)
                    } else {
                        console.warn("Url NAO alterada ", config.url, url)
                    }
                } else if (V2) {
                    var url = config.url;
                    config.url = config.url.replace("//cumeqetrekking.appspot.com", "//2-dot-cumeqetrekking.appspot.com");
                    if (url != config.url) {
                        console.warn("Url alterada ", config.url, url)
                    }
                } else {
                    console.log("no url update");
                }


                return config;
            }

            return {
                request: request
            }
        }])