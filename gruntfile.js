module.exports = function(grunt){

grunt.initConfig({

pkg: grunt.file.readJSON('package.json'),


uglify: {
  all: {
    files: {
      'dist/unsync.min.js': 'src/unsync.js'
    }
  }
},

connect: {
  server: {
    options: {
      port: 23456
    }
  }
},

qunit: {
  all: {
    options: {
      urls: (function(){
        var files = grunt.file.expand('test/*.html');
        return files.map(function(file){
          return 'http://localhost:23456/' + file;
        });
      })()
    }
  }
}

});

grunt.loadNpmTasks('grunt-contrib');

grunt.registerTask('test',    ['connect', 'qunit']);
grunt.registerTask('default', ['test', 'uglify']);

};