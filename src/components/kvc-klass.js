

Klass('KvcKlass', {

  __observers: false,

  get: function(key) {
    if(this[key]) {
      if(typeOf(this[key]) == 'function') {
        return this[key]();
      } else {
        return this[key];
      }
    
    } else if(this['unknownProperty']){
      return this.unknownProperty(key);
    
    } else {
      throw "Unknown property: "+ key;
    }
  },

  set: function(key, value) {
    if(this[key]) {
      var oldValue = this.get(key);
      if(typeOf(this[key]) == 'function')
        this[key](value);
      else
        this[key] = value;
      this.notify(key, value, oldValue);
      return value;
      
    } else if(this['unknownProperty']) {
      return this.unknownProperty(key, value);
    
    } else {
      throw "Unknown property: "+ key;
    }
  },

  observe: function(key, func) { // By Key?
    if(!this.__observers){ this.__observers = {}; } 
    if(!this.__observers[key]){ this.__observers[key] = []; }
    this.__observers[key].push(func);
  },

  ignore: function(key, func) {
    
  },

  clearAll: function(key) {
    // Removes all listeners...
    // If key is null, it clears all listens for all keys
  },

  notify: function(key, value, oldValue) {
    if(this.__observers && this.__observers[key]) {
      for (var i=0; i < this.__observers[key].length; i++) {
        this.__observers[key][i](value, oldValue, key);
      };
    }
  }

});