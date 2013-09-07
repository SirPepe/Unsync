window.unsync = (function(){

var slice = Function.prototype.call.bind(Array.prototype.slice);

function unsync(sourceFunc, autoTerminate){
  if(typeof sourceFunc !== 'function'){
    throw new Error('Expected function, got ' + typeof sourceFunc);
  }
  var sourceCode = unsync.createBlobTemplate(sourceFunc.toString());
  var worker = unsync.createWorker(sourceCode);
  var func = unsync.createAsyncFunction(worker, Boolean(autoTerminate));
  return func;
}

Object.defineProperty(unsync, 'supported', {
  enumerable: true,
  get: function(){
    return (
      typeof window.Worker === 'function' &&
      typeof window.URL.createObjectURL === 'function'
    );
  }
});

unsync.createBlobTemplate = function(code){
  return 'this.onmessage = function(evt){' +
    '  var result = (' + code + ').apply(null, evt.data);' +
    '  this.postMessage(result);' +
    '};';
};

unsync.createWorker = function(code){
  var blob = new Blob([code], { type: 'text/javascript' });
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  window.URL.revokeObjectURL(url);
  return worker;
};

unsync.createAsyncFunction = function(worker, autoTerminate){
  var terminated = false;
  var func = function func(){
    if(terminated) throw new Error('Background process was already terminated');
    var args = slice(arguments, 0, -1);
    var done = arguments[arguments.length -1];
    worker.postMessage(args);
    worker.addEventListener('message', function callback(evt){
      done.call(null, evt.data);
      worker.removeEventListener('message', callback);
      if(autoTerminate) func.terminate();
    }, false);
  };
  Object.defineProperty(func, 'terminated', {
    enumerable: true,
    get: function(){
      return terminated;
    }
  });
  func.terminate = function(){
    worker.terminate();
    terminated = true;
  };
  return func;
};

return unsync;

})();