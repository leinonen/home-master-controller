'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),

    // Compiles Less to CSS
    less: {
      server: {
        files: {
          'client/public/hmc.css' : 'client/less/hmc.less'
        }
      }
    }

  });

  grunt.registerTask('default', [
    'less'
  ]);
};
