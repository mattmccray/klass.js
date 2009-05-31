//
// watch.js  created by: M@ McCray
//                              http://www.mattmccray.com
//
// Implements Object#watch / Object#unwatch for browsers that don't already support it
// (and also support __defineGetter/Setter__).
//
// Usage is just like Moz's: 
//  - https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Object/watch
//  - https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Object/unwatch
//
// I have noticed that watching an Array's length works in Moz, it won't using this script and
// WebKit... Not yet, anyway. When I need that, I just write a wrapper class that manually updates
// a length property.
//
// NOTE! You must call .unwatch(key) for all the keys/objects you watch, otherwise you may
//       run the risk of memory leaks.
//
// Todo: Finish these methods to help with memory leak prevention:
//  - Object.unwatchAllFor(object)
//  - Object.unwatchAll()
//
if(!({}).watch && ({}).__defineGetter__) {(function setupWatch(){

  var _watchCache = {
    _values: {},
    _objs: {},
    init: function(obj, key) {
      if(!_watchCache._values[obj]) _watchCache._values[obj] = {};
      if(!_watchCache._objs[obj])   _watchCache._objs[obj] = 0;
      _watchCache._values[obj][key] = obj[key];
      _watchCache._objs[obj] += 1;
    },
    get: function(obj, key) {
      return _watchCache._values[obj][key];
    },
    set: function(obj, key, value) {
      _watchCache._values[obj][key] = value;
    },
    remove: function(obj, key) {
      if(_watchCache._values[obj]) {
        delete _watchCache._values[obj][key];
        _watchCache._objs[obj] -= 1;
        // if this is the last one for this obj... delete it. (free memory)
        if(_watchCache._objs[obj] == 0) { 
          delete _watchCache._objs[obj];
          delete _watchCache._values[obj];
        }
      }
    }
  };

  Object.prototype.watch = function(key, callback) {
    if(typeof key!= "string") return;
    if(typeof callback != "function") return;
    var self = this;
    _watchCache.init(self, key);
    
    this.__defineGetter__(key, function() {
      return _watchCache.get(self, key);
    });
    
    this.__defineSetter__(key, function(newValue) {
      var oldValue = _watchCache.get(self, key),
          newValue = newValue,
          newFromWatch = null,
          newFromWatch = callback.apply(self, [key, oldValue, newValue]);
      if(newFromWatch != oldValue)
        _watchCache.set(self, key, newFromWatch);
    });
    
  }

  Object.prototype.unwatch = function(key) {
    if(typeof key!= "string") return;
    var oldVal = _watchCache.get(this, key);
    _watchCache.remove(this, key);
    delete this[key];
    this[key] = oldVal;
  }
  
  Object.clearWatchCache = function() {
    // Needs to be smarter: Manually unwatch every object/key in cache...
    _watchCache._values = {};
    _watchCache._objs = {};
  }

  Object.unwatchAllFor = new Function(); // noop
  Object.unwatchAll = new Function(); // noop
  
})(); } else {
  
  Object.clearWatchCache = new Function(); // noop
  Object.unwatchAllFor = new Function(); // noop
  Object.unwatchAll = new Function(); // noop
}
