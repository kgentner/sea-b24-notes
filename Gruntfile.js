'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      src: ['models/**/*.js', 'server.js', 'routes/**/*.js', 'Gruntfile.js',
      'app/js/**/**/*.js', 'test/api/*.js', 'test/client/*.js', 'lib/*.js',
      'karma.config.js']
    },

    jscs: {
      src: ['models/**/*.js', 'server.js', 'routes/**/*.js', 'Gruntfile.js',
      'app/js/**/**/*.js', 'test/api/*.js', 'test/client/*.js', 'lib/*.js',
      'karma.config.js'],
      options: {
        config: '.jscsrc'
      }
    },

    simplemocha: {
      src: ['test/api/**/*.js']
    },

    clean: {
      src: ['build/']
    },

    copy: {
      dev: {
        cwd: 'app/',
        expand: true,
        src: ['**/*.html'],
        dest: 'build/'
      }
    },

    browserify: {
      dev: {
        src: ['app/js/**/*.js'],
        dest: 'build/client_bundle.js',
        options: {
          transform: ['debowerify']
        }
      },

      test: {
        src: ['test/client/**/*.js'],
        dest: 'test/angular_testbundle.js',
        options: {
          transform: ['debowerify']
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.config.js'
      },
      continuous: {
        configFile: 'karma.config.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
  grunt.registerTask('test:client', ['browserify:test', 'karma:unit']);
  grunt.registerTask('build', ['clean', 'browserify', 'copy:dev']);
  grunt.registerTask('default', ['build', 'test', 'test:client']);
};
