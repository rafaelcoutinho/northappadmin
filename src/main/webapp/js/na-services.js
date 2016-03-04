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
    .service('InscricaoService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {

        return $resource(appConfigs.context + '/InscricaoFull/', {}, {
            get: {
                isArray: false,
                url: appConfigs.context + '/InscricaoFull?filter=id_Trekker,eq,:idTrekker&filter=id_Etapa,eq,:idEtapa',
                transformResponse: jsonTransformQueryGetSingle
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
            marcarPagto: {
                method: 'PUT',
                isArray: false,
                url: appConfigs.context + '/Inscricao'
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
    }])
    .service('DestaquesService', ['$http', '$q', '$resource', 'appConfigs', function ($http, $q, $resource, appConfigs) {
        return $resource(appConfigs.context + '/Destaque/:id', {}, {
            query: {
                isArray: true,
                transformResponse: jsonTransformQuery
            }
        });

    }])