(function(){

'use strict';


module('API');

test('Properties', function(){
  ok(typeof window.unsync == 'function');
  ok(typeof window.unsync.supported == 'boolean');
  ok(typeof window.unsync.template == 'string');
  ok(typeof window.unsync.createBlobTemplate == 'function');
  ok(typeof window.unsync.createWorker == 'function');
  ok(typeof window.unsync.createAsyncFunction == 'function');
});

test('unsync.createBlobTemplate()', function(){
  var source = 'function(q){return q;}';
  var template = unsync.createBlobTemplate(source);
  ok(template.indexOf(source) > 0,
      'embeds source code into the template');
});

//test('unsync.createWorker()', function(){});

//test('unsync.createAsyncFunction()', function(){});

test('unsync()', function(){
  throws(function(){
    window.unsync(undefined);
  }, 'throws when not called with a function');
  ok(typeof window.unsync(function(){}) == 'function',
    'returns a function when given a function');
});


module('Unsynced functions');

asyncTest('Equivalence (0 arguments)', 1, function(){
  var testFn = function(){ return 42; };
  unsync(testFn)(function(result){
    strictEqual(result, testFn());
    start();
  });
});

asyncTest('Equivalence (1 argument)', 1, function(){
  var testFn = function(x){ return x * x; };
  unsync(testFn)(2, function(result){
    strictEqual(result, testFn(2));
    start();
  });
});

asyncTest('Equivalence (2 arguments)', 1, function(){
  var testFn = function(x, y){ return x + y; };
  unsync(testFn)(2, 3, function(result){
    strictEqual(result, testFn(2, 3));
    start();
  });
});

asyncTest('Loop', 1, function(){
  var runs = 0;
  var testFn = function(x){ return ++x; };
  unsync(testFn)(0, function callback(result, self){
    runs++;
    if(result !== 3){
      self(result, callback);
    }
    else {
      start();
      strictEqual(result, runs);
    }
  });
});


module('Worker termination');

asyncTest('Manual termination / termination state', 4, function(){
  var thisShouldBeFalse = false;
  var testFn = function(){ return; };
  var unsynced = unsync(testFn);
  strictEqual(unsynced.isTerminated, false);
  unsynced(function(){
    thisShouldBeFalse = true; // Should not happen because of early termination
  });
  setTimeout(function(){
    strictEqual(thisShouldBeFalse, false);
    start();
  }, 500);
  unsynced.terminate();
  strictEqual(unsynced.isTerminated, true);
  throws(function(){
    unsynced(function(){});
  }, 'throws when calling a terminated process');
});

asyncTest('Automatic termination', 1, function(){
  var testFn = function(){ return; };
  var unsynced = unsync(testFn, true);
  unsynced(function(){
    strictEqual(unsynced.isTerminated, true);
    start();
  });
});

})();