// Karma configuration
// Generated on Tue Oct 13 2015 19:08:06 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'public/',
    frameworks: ['jasmine'],
    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-ui-router/release/angular-ui-router.js',
      'lib/angular-cookies/angular-cookies.js',
      'lib/angular-resource/angular-resource.js',
      'lib/angular-loading-bar/build/loading-bar.js',

      'app/app.js',

      'app/user/*.js',
      'app/common/*.js',
      'app/configuration/*.js',
      'app/navbar/*.js',
      'app/sensor/*.js',
      'app/device/*.js',
      'app/group/*.js',
      'app/scheduler/*.js',

      'app/app.config.js',


      //'app/**/*.spec.js'
    ],

    exclude: [
    ],

    preprocessors: {
      'app/**/*.js' : ['coverage']
    },

    reporters: ['spec'/*, 'coverage'*/],

    coverageReporter: {
      type : 'html',
      dir : './../coverage/'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
};
