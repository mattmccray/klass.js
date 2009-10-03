// Version 2.0.6
(function() {

  window.typeOf = (function(){
    var arrayCtor  = (new Array).constructor,
        dateCtor   = (new Date).constructor,
        regexpCtor = (new RegExp).constructor;
    return function typeOf(v, extended) {
      var typeStr = typeof(v);
      if (typeStr == "object" || typeStr == 'function') {
        if (v === null) return "null";
        if (v.constructor == arrayCtor) return "array";
        if (v.constructor == dateCtor) return "date";
        if (v.constructor == regexpCtor) return "regexp";
        if (extended && v.klass) return v.klass.displayName;
      }
      return typeStr;
    }
  })();
  
  if ( typeof Object.getPrototypeOf !== "function" ) {
    if ( typeof "test".__proto__ === "object" ) {
      Object.getPrototypeOf = function getPrototypeOf(object){
        return object.__proto__;
      };
    } else {
      Object.getPrototypeOf = function getPrototypeOf(object){
        // May break if the constructor has been tampered with
        return object.constructor.prototype;
      };
    }
  }
  
  Object.setPrototypeOf = (function(){ // Memoized
    if( {}.__proto__ ) {
      return function setPrototypeOf(o, proto){
        o.__proto__ = proto;
        return o;
      }
    } else {
      return function setPrototypeOf(o, proto){ 
        o.constructor.prototype = proto;
        return o;
      }
    }
  })();
  
  function addHelperMethods(srcObject) {
    if(!srcObject['callSuper']) {
      srcObject.callSuper = function callSuper() {
        var symbol = Array.prototype.shift.call(arguments),
            parent = Object.getPrototypeOf(Object.getPrototypeOf(this)),
            method = (parent[symbol]) ? parent[symbol] : false;
        if(method) {
          return method.apply(this, arguments);
        } else {
          throw "Method not found: "+ symbol;
        }
      };
    }
    if(!srcObject['method']) {
      srcObject.method = function method() {
        if(arguments.length == 0 || typeof arguments[0] != "string") {
          throw "You must specify a method name (as a String)";
        }
        var self = this,
            args = Array.prototype.slice.call(arguments),
            name = args.shift(),
            meth = self[name];
        if (typeof meth === 'function') {
          return function curriedMethod() {
            return meth.apply(self, args.concat(Array.prototype.slice.call(arguments)));
          };
        } else {
          throw "Method "+ name +" not found!";
        }
      };
    }
  }
  
  window.Klass = function(cName, oProto) {
    var klass = null;
    if(arguments.length == 1 && typeOf(cName) != 'string') { // using typeOf to better detect true 'objects'
      oProto = cName;
      cName = '[AnonymousKlass]';
    }
    klass = function klass() {
      if(this == window) { // Create Subclass 
        return klass.subKlass.apply(this, arguments);
      
      } else { // Constructor
        Object.setPrototypeOf(this, oProto); // The magic!
        this.constructor = klass;
        if(oProto['init']) {
          return oProto.init.apply(this, arguments); 
        }
      }
    }
    klass.displayName = cName;
    oProto = (typeof(oProto) == 'function') ? oProto(this) : oProto;
    
    // 'Static' methods:
    var klassMethods = oProto['klass'];
    if(klassMethods) {
      if(typeOf(klassMethods) == 'object') {
        delete oProto['klass']; // Delete the direct 'klass' property
        // If there's still one that's a function, that's the parent's klass object (from the prototype chain)...
        if(typeof( oProto['klass'] ) == 'function') {
          // Make the new klass prototype the prototype of the parent klass prototype -- mind bending, isn't it?
          Object.setPrototypeOf(klassMethods, Object.getPrototypeOf( oProto['klass'] ));
        } 
        addHelperMethods(klassMethods);
        Object.setPrototypeOf(klass, klassMethods);
        
      } else if(typeof(klassMethods) == 'function') {
        var klassMethodsProto = Object.getPrototypeOf( klassMethods );
        addHelperMethods(klassMethodsProto);
        Object.setPrototypeOf(klass, klassMethodsProto);
      }
    } else {
      var klassMethodsProto = {};
      addHelperMethods(klassMethodsProto);
      Object.setPrototypeOf(klass, klassMethodsProto);
    }
    klass.subKlass = function subKlass(subName, subProto){
      if(arguments.length == 1 && typeOf(subName) == 'object') {
        subProto = subName;
        subName = '[AnonymousSubKlass]';
      }
      Object.setPrototypeOf(subProto, oProto);
      return Klass(subName, subProto);
    }
    // Experimental... Allows you to set any arbitrary object's prototype to impersonate an object of this type...
    klass.adopt = function(obj) {
      Object.setPrototypeOf(obj, klass._prototype_);
      return obj;
    }
    
    // "Enhance" the prototype object with some useful methods...
    addHelperMethods(oProto);
    oProto.klass = klass;
    if(klass.__defineGetter__) klass.__defineGetter__( "_prototype_", function(){ return oProto; } );
    else klass._prototype_ = (function(){ return oProto; })();
    
    if(cName != '<undefined>') {
      window[cName] = klass;
    }
    return klass;
  }

})();