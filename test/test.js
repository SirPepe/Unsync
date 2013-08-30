test('API', function(){
  ok(typeof window.toBackground == 'function');
  ok(typeof window.toBackground.createBlobTemplate == 'function');
  ok(typeof window.toBackground.createWorker == 'function');
  ok(typeof window.toBackground.createBackgroundFunction == 'function');
});


test('toBackground.createWorker()', function(){
});

test('toBackground.createBackgroundFunction()', function(){
});

test('toBackground()', function(){

  throws(function(){
    window.toBackground(undefined);
  }, 'throws when not called with a function');

  ok(typeof window.toBackground(function(){}) == 'function',
    'returns a function when given a function');

});