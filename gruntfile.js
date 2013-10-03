module.exports = function(grunt){

grunt.initConfig({

pkg: grunt.file.readJSON('package.json'),

jshint: {
  all: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js']
},

uglify: {
  all: {
    files: {
      'dist/unsync.min.js': 'src/unsync.js'
    }
  }
}

});

grunt.loadNpmTasks('grunt-contrib');

grunt.registerTask('default', ['jshint', 'uglify']);

};