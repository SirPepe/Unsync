Unsync
======

Turns synchronous functions into asynchronous functions using
[Web Workers](http://www.w3.org/TR/workers/). Simple Example:

```js
var asyncFn = unsync(fn);
asyncFn(callback);
```

This is useful for blocking functions that run for so long that they block the
browser's main thread, e.g. some homegrown number crunching algorithm.

The source function (`fn` in the example) can be any pure function. Pure
functions must not have any side effects and can do nothing but work with their
arguments and return a value <sup>1</sup>. A somewhat less simple example:

```js
// A pure, blocking function without side effects
function crunchNumbers(x){
  var startTime = new Date();
  for(var i = 0; i < x; i++){
    Math.sqrt(Math.random() * 1000000000);
  }
  var totalTime = new Date() - startTime;
  return totalTime;
}

// Async version of the function above
var crunchAsync = unsync(crunchNumbers);

// Callback for the async function. First argument is the value returned by
// the original function
var done = function(time){
  var msg = '[' + new Date() + '] Done! Time taken: ' + time + 's\n';
  document.getElementById('Results').innerHTML += msg;
};

// Call the async function with its arguments and a callback
crunchAsync(5000000000, done);
```

To try this code, open `demo/index.html` in a non-prehistoric browser of your
choice.



API
---

### unsync(sourceFn [, autoTerminate])

Returns an asynchronous function that processes the function `sourceFn` in a
Web Worker. If `autoTerminate` is `true` the Web Worker is terminated after
the async function is called once (default: `false`).

### unsyncedFn([arguments...], callback)

Call a function created by `unsync()` with the arguments required by the source
function and a callback. The callback's arguments are the result computed by the
source function and a reference to the unsynced function itself.

#### unsyncedFn.terminate()

Terminates the worker behind `unsyncedFn`. The function then can not be used
again and throws an error when called.

#### unsyncedFn.isTerminated

Indicates if the worker behind `unsyncedFn` is terminated.


Browser support
---------------

* Chrome 29+
* Firefox 24+
* Safari 6+
* iOS 6+

Older versions of the browsers above might work too. IE 10 and 11 support
the necessary APIs but <a href="https://connect.microsoft.com/IE/feedback/details/801810/web-workers-from-blob-urls-in-ie-10-and-11">a
bug prevents them from working together</a> (see issue #1).



Footnotes
---------

<sup>1</sup> Not quite true; the source function can not use anything from its
original context (it can't access the DOM for example), but it can use the
capabilities provided by the Web Worker's environment. See
[http://www.w3.org/TR/workers/](the specs) for details.