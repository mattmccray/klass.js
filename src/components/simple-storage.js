// Should work on FireFox 3+, Safari 3+, and IE8... 
// FIXME: Convert to KvcKlass???
Klass('SimpleStorage', function(){

  function keyName(self, key) {
    return self.name +"_"+ key;
  };

  var getStorage = (function(){
    if(window.globalStorage) {
      return function() {
        var storage = null;
        try{
          storage = window.globalStorage[location.hostname];
        } catch(ex) {
          //throw "Can't use the storage system from here... (filesystem?)"
          storage = { // FIXME: Persist this mock object via a Cookie?
            _data: {},
            getItem: function(key) {
              return this._data[key];
            },
            setItem: function(key, value) {
              this._data[key] = value;
            }
          }
        }
        return storage 
      }
    } else if(window.localStorage) {
      return function() {
        return window.localStorage;
      } 
    } else {
      throw "No Storage system available!";
    }
  })();

return {
  init: function(name) {
    this.name = name || '_simple_storage_';
    this.storage = getStorage();
  },

  set: function(key, value) {
    key = keyName(this, key);
    this.storage.setItem(key, value);
    return this; // this or the value?
  },

  get: function(key, defaultValue) {
    key = keyName(this, key);
    return this.storage.getItem(key) || defaultValue;
  },

  getInt: function(key, defaultValue) {
    return parseInt(this.get(key, defaultValue));
  },
  getFloat: function(key, defaultValue) {
    return parseFloat(this.get(key, defaultValue));
  },
  getString: function(key, defaultValue) {
    return this.get(key, defaultValue);
  },


  
  klass: {
    get instance() {
      if(!this.__instance) this.__instance = new this();
      return this.__instance;
    },
    set: function(key, value) {
      return this.instance.set(key, value);
    },
    get: function(key, defaultValue) {
      return this.instance.get(key, defaultValue);
    },
    getInt: function(key, defaultValue) {
      return this.instance.getInt(key, defaultValue);
    },
    getFloat: function(key, defaultValue) {
      return this.instance.getFloat(key, defaultValue);
    }
  }
}});


// Testing!
// var storage = new SimpleStorage('TaskThis2');
// storage.set('count', storage.getInt('count', 0) + 1)
// console.log('COUNT: '+ storage.get('count'))