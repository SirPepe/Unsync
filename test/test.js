test('API', function(){
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