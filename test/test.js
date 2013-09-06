test('API', function(){
  ok(typeof window.unsync == 'function');
  ok(typeof window.unsync.createBlobTemplate == 'function');
  ok(typeof window.unsync.createWorker == 'function');
  ok(typeof window.unsync.createBackgroundFunction == 'function');
});


test('unsync.createWorker()', function(){
});

test('unsync.createBackgroundFunction()', function(){
});

test('unsync()', function(){

  throws(function(){
    window.unsync(undefined);
  }, 'throws when not called with a function');

  ok(typeof window.unsync(function(){}) == 'function',
    'returns a function when given a function');

});