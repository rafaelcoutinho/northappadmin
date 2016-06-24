///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Defines the javascript files that need to be loaded and their dependencies.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

require.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        angularResources: '../../bower_components/angular-resource/angular-resource.min',
        angularRoute: '../../bower_components/angular-route/angular-route.min',
        angularAnimate: '../../bower_components/angular-animate/angular-animate.min',
        angularMessages: '../../bower_components/angular-messages/angular-messages.min',

        angularSanitize: '../../bower_components/angular-sanitize/angular-sanitize.min',
        angularDialogs: '../../bower_components/angular-dialog-service/dist/dialogs.min',

        lodash: '../../bower_components/lodash/dist/lodash.min',
        jQuery: '../../bower_components/admin-lte/plugins/jQuery/jQuery-2.1.4.min',
        inputMask: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask',
        inputMaskDate: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask.date.extensions',
        inputMaskPhone: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask.phone.extensions',
        inputMaskExtensions: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask.extensions',
        boostrap: '../../bower_components/admin-lte/bootstrap/js/bootstrap.min',
        uiboostrap: '../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        adminLte: '../../bower_components/admin-lte/dist/js/app.min',
        northServices: "../../common/na-services",

        'facebook': 'http://connect.facebook.net/pt_BR/sdk',
        'registroApp': "registro-app"

    },
    shim: {
        'facebook': {
            exports: 'FB'
        },
        jQuery: {
            exports: "jQuery"
        },
        angular: {
            exports: "angular"
        },
        csrfInterceptor: {
            deps: ['angular']
        },
        angularMessages: {
            deps: ['angular']
        },
        angularResources: {
            deps: ['angular']
        },
        boostrap: {
            deps: ['jQuery']
        },
        angularAnimate: {
            deps: ['angular']
        },


        adminLte: {
            deps: ['boostrap']
        },
        inputMask: {
            deps: ['jQuery']
        },
        inputMaskExtensions: {
            deps: ['jQuery', 'inputMask']
        },
        inputMaskPhone: {
            deps: ['jQuery', 'inputMask', 'inputMaskExtensions']
        },
        inputMaskDate: {
            deps: ['jQuery', 'inputMask', 'inputMaskExtensions']
        },

        uiboostrap: {
            deps: ['angular']
        },
        angularDialogs: {
            deps: ['angular']
        },
        angularSanitize: {
            deps: ['angular']
        },
        angularRoute: {
            deps: ['angular']
        },
        northServices: {
            deps: ['angular']
        },

        registroApp: {
            deps: ['lodash', 'angularDialogs', 'angularAnimate', 'northServices', 'angular', 'adminLte', 'angularMessages', 'angularRoute', 'angularResources', 'uiboostrap', 'angularSanitize']
        }
    }
});

require(['registroApp'], function () {

    angular.bootstrap(document.getElementById('registroApp'), ['registroApp']);

}, function (erro) {
    console.log("Erro carregando bibliotecas");
    alert("Houve um problema carregando esta página, por favor recarregue a página.");
});