///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Defines the javascript files that need to be loaded and their dependencies.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

require.config({
    paths: {
        angular: '../../bower_components/angular/angular.min',
        angularResources: '../../bower_components/angular-resource/angular-resource.min',
        angularRoute: '../../bower_components/angular-route/angular-route.min',
        angularAnimate: '../../bower_components/angular-animate/angular-animate.min',
        angularMessages: '../../bower_components/angular-messages/angular-messages.min',
        lodash: '../../bower_components/lodash/dist/lodash.min',
        jQuery: '../../bower_components/admin-lte/plugins/jQuery/jQuery-2.1.4.min',
        inputMask: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask',
        inputMaskDate: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask.date.extensions',
        inputMaskPhone: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask.phone.extensions',
        inputMaskExtensions: '../../bower_components/admin-lte/plugins/input-mask/jquery.inputmask.extensions',
        boostrap: '../../bower_components/admin-lte/bootstrap/js/bootstrap.min',
        uiboostrap: '../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        adminLte: '../../bower_components/admin-lte/dist/js/app.min',
        knob: '../../bower_components/admin-lte/plugins/knob/jquery.knob',
        summernote: '../../bower_components/summernote/dist/summernote',
        bootstrapColorPicker: '../../bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min',      
        'adminServices': "../../common/na-services",
        'adminApp': "na-app"

    },
    shim: {
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
        bootstrapColorPicker:{
          deps: ['boostrap','angular']  
        },
       summernote:{
           deps: ['boostrap','bootstrapColorPicker','jQuery']
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

        angularRoute: {
            deps: ['angular']
        },
        knob: {
            deps: ['jQuery']
        },
        adminServices: {
            deps: ['angular', 'angularResources']
        },
        adminApp: {
            deps: ['lodash', 'angular', 'angularMessages', 'angularRoute', 'angularResources', 'uiboostrap', 'adminLte', 'knob', 'inputMaskDate', 'inputMaskPhone', 'adminServices','summernote']
        }
    }
});

require(['adminApp'], function () {

    angular.bootstrap(document.getElementById('adminApp'), ['adminApp']);

});