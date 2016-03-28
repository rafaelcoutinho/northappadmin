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
                url: appConfigs.context + '/Grid'
            },
            update: {
                method: 'POST',
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

    }])