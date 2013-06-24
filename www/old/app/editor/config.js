requirejs.config({
    // Initialize the application with the main application file
    deps: ["app/editor/main"],

    // By default load any module IDs from js/lib
    baseUrl: 'www/js/lib',

    paths: {
        app: '../../app'
    }
});
