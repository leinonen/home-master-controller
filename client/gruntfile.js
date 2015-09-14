'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      unit: {
        options: {
          configFile: 'karma.conf.js',
          singleRun: true
        }
      }

    }
  });

  grunt.registerTask('test', ['karma:unit']);
};
