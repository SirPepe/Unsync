(function (root, factory){
  if(typeof define === 'function' && define.amd) define(factory);
  else if(typeof exports === 'object') module.exports = factory();
  else root.unsync = factory();
}(this, function(){

'use strict';

var slice = Function.prototype.call.bind(Array.prototype.slice);
var URL = window.URL || window.webkitURL;

function unsync(sourceFn, autoTerminate){
  if(typeof sourceFn !== 'function') throw new Error('Expected function, got ' +
    typeof sourceFn);
  var sourceCode = unsync.createBlobTemplate(sourceFn.toString());
  var worker = unsync.createWorker(sourceCode);
  var fn = unsync.createAsyncFunction(worker, Boolean(autoTerminate));
  return fn;
}

Object.defineProperty(unsync, 'supported', {
  enumerable: true,
  get: function(){
    return (
      typeof window.Worker === 'function' &&
      typeof URL === 'function' &&
      typeof URL.createObjectURL === 'function' &&
      typeof URL.revokeObjectURL === 'function' &&
      (function(){
        try {
          unsync.createWorker(';');
        } catch(e){
          return false;
        }
        return true;
      }())
    );
  }
});

unsync.template = 'this.onmessage = function(evt){' +
'  var result = (#CODE#).apply(null, evt.data);' +
'  this.postMessage(result);' +
'};';

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

unsync.createMessageHandler = function(unsyncedFn, done, autoTerminate){
  return function callback(evt){
    this.removeEventListener('message', callback);
    if(autoTerminate) unsyncedFn.terminate();
    if(done) done.call(null, evt.data);
  };
};

unsync.createAsyncFunction = function(worker, autoTerminate){
  var isTerminated = false;
  var fn = function fn(){
    if(isTerminated) throw new Error('Background process already terminated');
    var done = (arguments.length > 0) ? arguments[arguments.length -1] : null;
    var args = (arguments.length > 1) ? slice(arguments, 0, -1) : [];
    worker.postMessage(args);
    worker.addEventListener('message',
      unsync.createMessageHandler(fn, done, autoTerminate), false);
  };
  Object.defineProperties(fn, {
    terminate: {
      enumerable: true,
      value: function(){
        isTerminated = true;
        return worker.terminate();
      }
    }
  });
  return fn;
};

return unsync;

}));