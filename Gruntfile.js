'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jasmine_node: {
      specNameMatcher: "_test", // load only specs containing specNameMatcher
      projectRoot: "test",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath: "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      test: {
        files: ['lib/*.js', 'test/*.js'],
        tasks: ['jshint', 'jasmine_node']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine_node']);

};
