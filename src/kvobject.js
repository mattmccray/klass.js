//=require 'klass'
//=require 'typeOf'

Klass('KVObject', {
  
  init: function() {
    this._listeners = [];
  },
  
  get: function(key, defaultValue) {
    var returnValue = defaultValue,
        prop = this[key];
    if(key in this) { 
      returnValue = (typeOf(prop) == 'function') ? prop.apply(this, []) : prop;
    } 
    console.log("get('"+ key +"', <"+ defaultValue +":"+ typeOf(defaultValue) +">) called, returned "+ returnValue)
    return returnValue;
  },
  
  set: function(key, value) {
    // fire observers?
    // Allow overriding the value to be set?
    console.log("set('"+ key +"', <"+ value +":"+ typeOf(value) +">) called")
    this[key] = value;
    
    // fire observers again?
    
    return value;
  },
  
  observe: function(key) {
    
  }
  
});

(function() {
  
  function delegateTo(obj, func, track) {
    if(track) {
      return function() {
        var arrSrc = this[obj],
            oldLen = arrSrc.length,
            result = arrSrc[func].apply(arrSrc, arguments),
            newLen = arrSrc.length;
        if(newLen != oldLen) {
          this.set('length', newLen);
        }
        return result;
      }
    } else {
      return function() {
        return this[obj].call(func, arguments),
      }
    }
  }
  
  var kvcol_instanceMethods = {
    
    init: function(src) {
      this._super();
      this.arrangedObjects = (src) ? src : [];
      this.length = this.arrangedObjects.length;
    },
    
    // Allow get(0) to mimic arr[0]
    get: function(key, defaultValue) {
      if(typeOf(key) == 'number') {
        return this.arrangedObjects[key] || defaultValue;
      } else {
        return this._super(key, defaultValue);
      }
    }
    
  };
  
  var arrFuncs = "concat indexOf lastIndexOf join slice toString toSource valueOf".split(' ');
  for (var i=0; i < arrFuncs.length; i++) {
    kvcol_instanceMethods[arrFuncs[i]] = delegateTo('arrangedObjects', arrFuncs[i], false);
  };
  arrFuncs = "push pop shift unshift splice".split(' '); // What about sort and reverse?
  for (var i=0; i < arrFuncs.length; i++) {
    kvcol_instanceMethods[arrFuncs[i]] = delegateTo('arrangedObjects', arrFuncs[i], true);
  };
  
  KVObject('KVCollection', kvcol_instanceMethods);

})();

/*
concat()	Joins two or more arrays and returns the result	1	4
join()	Puts all the elements of an array into a string. The elements are separated by a specified delimiter	1	4
pop()	Removes and returns the last element of an array	1	5.5
push()	Adds one or more elements to the end of an array and returns the new length	1	5.5
reverse()	Reverses the order of the elements in an array	1	4
shift()	Removes and returns the first element of an array	1	5.5
slice()	Returns selected elements from an existing array	1	4
sort()	Sorts the elements of an array	1	4
splice()	Removes and adds new elements to an array	1	5.5
toSource()	Represents the source code of an object	1	-
toString()	Converts an array to a string and returns the result	1	4
unshift()	Adds one or more elements to the beginning of an array and returns the new length	1	6
valueOf()
*/