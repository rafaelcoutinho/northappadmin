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