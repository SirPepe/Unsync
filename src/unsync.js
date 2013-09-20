(function (root, factory){
  if(typeof define === 'function' && define.amd) define(factory);
  else if(typeof exports === 'object') module.exports = factory();
  else root.unsync = factory();
}(this, function(){

'use strict';

var slice = Function.prototype.call.bind(Array.prototype.slice);
var URL = window.URL || window.webkitURL;

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
      typeof URL === 'object' &&
      typeof URL.createObjectURL === 'function'
    );
  }
});

unsync.template = 'this.onmessage = function(evt){\
  var result = (#CODE#).apply(null, evt.data);\
  this.postMessage(result);\
};';

unsync.createBlobTemplate = function(code){
  return this.template.split('#CODE#').join(code);
};

unsync.createWorker = function(code){
  var blob = new Blob([code], { type: 'text/javascript' });
  var url = URL.createObjectURL(blob);
  var worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
};

unsync.createAsyncFunction = function(worker, autoTerminate){
  var isTerminated = false;
  var func = function func(){
    if(isTerminated) throw new Error('Background process was already terminated');
    var done = (arguments.length > 0) ? arguments[arguments.length -1] : null;
    var args = (arguments.length > 1) ? slice(arguments, 0, -1) : [];
    worker.postMessage(args);
    worker.addEventListener('message', function callback(evt){
      worker.removeEventListener('message', callback);
      if(autoTerminate) func.terminate();
      if(done) done.call(null, evt.data, func);
    }, false);
  };
  Object.defineProperties(func, {
    isTerminated: {
      enumerable: true,
      get: function(){
        return isTerminated;
      }
    },
    terminate: {
      enumerable: true,
      value: function(){
        worker.terminate();
        isTerminated = true;
      }
    }
  });
  return func;
};

return unsync;

}));