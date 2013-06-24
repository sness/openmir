requirejs.config({
    // Initialize the application with the main application file
    deps: ["app/match/main"],

    // By default load any module IDs from js/lib
    baseUrl: 'js/lib',

    paths: {
        app: '../../app'
    },

    // For any libraries that do not use define() to declare a module.
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

