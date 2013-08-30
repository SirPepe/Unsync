BackgroundJS
============

Easy-to-use background functions. Allows asynchronous execution of blocking
functions.

    function crunchNumbers(x){
      var startTime = new Date();
      for(var i = 0; i < x; i++){
        Math.sqrt(Math.random() * 1000000000);
      }
      var totalTime = new Date() - startTime;
      return totalTime;
    }

    var crunchInBackground = toBackground(crunchNumbers);

    crunchInBackground(5000000000, function(time){
      var msg = '[' + new Date() + '] Done! Time taken: ' + time + 's';
      window.alert(msg);
    });