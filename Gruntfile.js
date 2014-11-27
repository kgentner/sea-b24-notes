'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.initConfig({
    jshint: {
      options: {
        node: true,
        jshintrc: true
      },
      src: ['models/**/*.js', 'server.js', 'routes/**/*.js', 'test/api/*.js',
      'Gruntfile.js']
    },
    jscs: {
      src: ['models/**/*.js', 'server.js', 'routes/**/*.js', 'test/api/*.js',
      'Gruntfile.js'],
      options: {
        config: '.jscsrc'
      }
    },

    simplemocha: {
      src: ['test/api/**/*.js']
    }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
  grunt.registerTask('default', ['test']);
};
