Unsync
======

Allows asynchronous execution of blocking functions, provided they are pure
functions. Pure functions must not have any side effects and can do nothing
but work with their arguments and return a value.

Simple Example:

    function crunchNumbers(x){
      var startTime = new Date();
      for(var i = 0; i < x; i++){
        Math.sqrt(Math.random() * 1000000000);
      }
      var totalTime = new Date() - startTime;
      return totalTime;
    }

    var crunchAsync = unsync(crunchNumbers);

    crunchAsync(5000000000, function(time){
      var msg = '[' + new Date() + '] Done! Time taken: ' + time + 's';
      window.alert(msg);
    });