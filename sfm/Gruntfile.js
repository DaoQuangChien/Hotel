module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      views: 'source/views/',
      assets: 'source/assets/',
      build: 'public/'
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: '<%= meta.views %>',
          src: ['**/*.jade', '!blocks/**', '!layouts/**', '!mixins/**'],
          dest: '<%= meta.build %>',
          ext: '.html'
        }]
      }
    },
    less: {
      build: {
        options: {
          compress: false
        },
        files: [{
          '<%= meta.build %>css/style.css': '<%= meta.assets %>css/style.less',
          '<%= meta.build %>css/print.css': '<%= meta.assets %>css/print.less',
          '<%= meta.build %>css/libs/bootstrap.css': '<%= meta.assets %>css/bootstrap/bootstrap.less',
          '<%= meta.build %>css/libs/jquery-ui.css': '<%= meta.assets %>css/jquery-ui/*.css'
        }]
      }
    },
    concat: {
      dist: {
        files: [{
          '<%= meta.build %>js/modernizr.js': ['<%= meta.assets %>js/libs/modernizr.2.8.3.js','<%= meta.assets %>js/libs/detectizr.js'],
          '<%= meta.build %>js/libs.js': ['<%= meta.assets %>js/libs/jquery-2.1.4.min.js', '<%= meta.assets %>js/libs/jquery-ui.min.js', '<%= meta.assets %>js/libs/jquery-ui-timepicker-addon.js' , '<%= meta.assets %>js/libs/globalize.js', '<%= meta.assets %>js/libs/globalize.culture.de-DE.js', '<%= meta.assets %>js/libs/bootstrap.min.js', '<%= meta.assets %>js/libs/highcharts.js', '<%= meta.assets %>js/libs/plugins/*.js'],
          '<%= meta.build %>js/l10n.js': '<%= meta.assets %>js/l10n.js',
          '<%= meta.build %>js/script.js': ['<%= meta.assets %>js/site.js', '<%= meta.assets %>js/plugins/*.js'],
          '<%= meta.build %>js/courantScript.js': '<%= meta.assets %>js/courant-plugins/*.js'
        }]
      }
    },
    copy: {
      data: {
        files: [{
          expand: true,
          cwd: '<%= meta.views %>data/',
          src: ['**/*', '!*.jade'],
          dest: '<%= meta.build %>data/'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>images/',
          src: '**/*',
          dest: '<%= meta.build %>images/'
        }]
      },
      icons: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>icons/',
          src: '**/*',
          dest: '<%= meta.build %>'
        }]
      },
      video: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>video/',
          src: '**/*',
          dest: '<%= meta.build %>video/'
        }]
      },
      audio: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>audio/',
          src: '**/*',
          dest: '<%= meta.build %>audio/'
        }]
      },
      xml: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>xml/',
          src: '**/*',
          dest: '<%= meta.build %>xml/'
        }]
      },
      json: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>json/',
          src: '**/*',
          dest: '<%= meta.build %>json/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>fonts/',
          src: '**/*',
          dest: '<%= meta.build %>fonts/'
        }]
      },
      htaccess: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>htaccess/',
          src: '.htaccess',
          dest: '<%= meta.build %>'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['<%= meta.assets %>js/courant-plugins/*.js', '<%= meta.assets %>js/plugins/*.js', '<%= meta.assets %>js/*.js']
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      files: ['<%= meta.build %>css/*.css']
    },
    htmlhint: {
      options: {
        htmlhintrc: '.htmlhintrc'
      },
      files: ['<%= meta.build %>*.html']
    },
    watch: {
      options: {
        spawn: false,
        interrupt: true
      },
      js: {
        files: ['<%= meta.assets %>js/plugins/*.js', '<%= meta.assets %>js/*.js', '<%= meta.assets %>js/courant-plugins/*.js'],
        tasks: ['jshint', 'concat']
      },
      jade: {
        files: ['<%= meta.views %>**/*.jade'],
        tasks: ['jade', 'htmlhint']
      },
      data: {
        files: ['<%= meta.views %>data/**/*.*'],
        tasks: ['copy:data']
      },
      less: {
        files: ['<%= meta.assets %>css/**/*.less'],
        tasks: ['less', 'autoprefixer', 'csslint']
      },
      fonts: {
        files: ['<%= meta.assets %>fonts/**/*'],
        tasks: ['copy:fonts']
      },
      images: {
        files: ['<%= meta.assets %>images/**/*'],
        tasks: ['copy:images']
      },
      videos: {
        files: ['<%= meta.assets %>videos/**/*'],
        tasks: ['copy:videos']
      },
      xml: {
        files: ['<%= meta.assets %>xml/**/*'],
        tasks: ['copy:xml']
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= meta.build %>images/',
          src: '**/*.{png,jpg,gif}',
          dest: '<%= meta.build %>images/'
        }]
      }
    },
    cssmin: {
      options: {
        banner: '<%= meta.banner %>',
        keepSpecialComments: false,
        compatibility: 'ie8'
      },
      compress: {
        files: [{
          // '<%= meta.build %>css/libs/bootstrap.css': '<%= meta.build %>css/bootstrap/bootstrap.css',
          // '<%= meta.build %>css/libs/jquery-ui.css': '<%= meta.build %>css/jquery-ui/*.css'
          '<%= meta.build %>css/style.css': '<%= meta.build %>css/style.css',
          '<%= meta.build %>css/print.css': '<%= meta.build %>css/print.css',
        }]
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>',
        // mangle: false,
        compress: true,
        beautify: false,
        preserveComments: false
      },
      dist: {
        files: [{
          '<%= meta.build %>js/modernizr.js': ['<%= meta.assets %>js/libs/modernizr.2.8.3.js','<%= meta.assets %>js/libs/detectizr.js'],
          // '<%= meta.build %>js/libs.js': ['<%= meta.assets %>js/libs/jquery-2.1.3.js', '<%= meta.assets %>js/libs/jquery-ui-1.11.1.js', '<%= meta.assets %>js/libs/jquery-ui-timepicker-addon.js', '<%= meta.assets %>js/libs/globalize.js', '<%= meta.assets %>js/libs/globalize.culture.de-DE.js', '<%= meta.assets %>js/libs/bootstrap.js', '<%= meta.assets %>js/libs/plugins/*.js'],
          '<%= meta.build %>js/l10n.js': '<%= meta.assets %>js/l10n.js',
          '<%= meta.build %>js/script.js': ['<%= meta.assets %>js/site.js', '<%= meta.assets %>js/plugins/*.js']
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 3 versions']
      },
      files: {
        expand: true,
        src: '<%= meta.build %>css/*.css'
      }
    },
    markdownpdf: {
      options: {
        concatFiles: true
      },
      files: {
        src: ['*.md', '!README.md'],
        dest: '<%= meta.build %>'
      }
    },
    open: {
      options: {
        delay: 10
      },
      dev: {
        path: 'http://localhost:3000/sitemap.html'
      }
    },
    nodemon: {
      options: {
        ignore: ['node_modules/**', '<%= meta.assets %>js/**'],
        ext: 'js'
      },
      dev: {
        script: 'source/server.js'
      }
    },
    concurrent: {
      options: {
        limit: 2
      },
      dev: {
        tasks: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    qunit: {
      options: {
        timeout: 10000,
        '--cookies-file': 'test/cookies.txt'
      },
      all: {
        options: {
          urls: [
            'http://localhost:8000/test/test.html'
          ]
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      },
      jasmine:{
        options:{
         port: 7000,
         base: '.',
          keepalive: true
        }
      }
    },
    clean: {
      options: {
        force: true
      },
      build: ['public']
    }
  });
  grunt.file.expand('./node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
  require('time-grunt')(grunt);
  grunt.registerTask('build', ['clean', 'concat', 'less', 'jade', 'copy', 'autoprefixer', 'htmlhint', 'jshint', 'csslint']);
  grunt.registerTask('default', ['build', 'concurrent:dev']);
  grunt.registerTask('test', ['connect:server', 'qunit']);
   grunt.registerTask('jasmine', ['connect:jasmine']);
  grunt.registerTask('pdf', ['markdownpdf']);
  grunt.registerTask('release', ['build', 'test', 'uglify', 'cssmin']);
};
