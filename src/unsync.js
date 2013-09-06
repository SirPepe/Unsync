window.unsync = (function(){

var slice = Function.prototype.call.bind(Array.prototype.slice);

function unsync(sourceFunc){
  if(typeof sourceFunc !== 'function'){
    throw new Error('Expected function, got ' + typeof sourceFunc);
  }
  var sourceCode = unsync.createBlobTemplate(sourceFunc.toString());
  var worker = unsync.createWorker(sourceCode);
  var backgroundFunction = unsync.createBackgroundFunction(worker);
  return backgroundFunction;
}

unsync.createBlobTemplate = function(code){
  return 'this.onmessage = function(evt){' +
    '  var result = (' + code + ').apply(null, evt.data);' +
    '  this.postMessage(result);' +
    '};';
};

unsync.createWorker = function(code){
  var workerBlob = new Blob([code], { type: 'text/javascript' });
  var workerUrl = window.URL.createObjectURL(workerBlob);
  var worker = new Worker(workerUrl);
  worker.__url__ = workerUrl;
  return worker;
};

unsync.createBackgroundFunction = function(worker){
  var terminated = false;
  var func = function(){
    if(terminated) throw new Error('Background process was already terminated');
    var args = slice(arguments, 0, -1);
    var done = arguments[arguments.length -1];
    worker.postMessage(args);
    worker.onmessage = function(evt){
      if(typeof done === 'function') done.call(null, evt.data);
    };
  };
  func.close = function(){
    worker.terminate();
    window.URL.revokeObjectURL(url);
    terminated = true;
  };
  return func;
};

return unsync;

})();