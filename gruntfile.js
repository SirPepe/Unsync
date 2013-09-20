module.exports = function(grunt){

grunt.initConfig({

pkg: grunt.file.readJSON('package.json'),


uglify: {
  all: {
    files: {
      'dist/unsync.min.js': 'src/unsync.js'
    }
  }
}

});

grunt.loadNpmTasks('grunt-contrib');

grunt.registerTask('default', ['uglify']);

};