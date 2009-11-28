(function(_root) {

  _root.typeOf = (function(){
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

  _root.Klass = function(cName, oProto) {
    var klass = null;
    if(arguments.length == 1 && typeOf(cName) != 'string') { // using typeOf to better detect true 'objects'
      oProto = cName;
      cName = '[AnonymousKlass]';
    }
    klass = function klass() {
      if(this == _root) { // Create Subclass
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

    var klassMethods = oProto['klass'];
    if(klassMethods) {
      if(typeOf(klassMethods) == 'object') {
        delete oProto['klass']; // Delete the direct 'klass' property
        if(typeof( oProto['klass'] ) == 'function') {
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
    klass.adopt = function(obj) {
      Object.setPrototypeOf(obj, klass._prototype_);
      return obj;
    }

    addHelperMethods(oProto);
    oProto.klass = klass;
    if(klass.__defineGetter__) klass.__defineGetter__( "_prototype_", function(){ return oProto; } );
    else klass._prototype_ = (function(){ return oProto; })();

    if(cName != '<undefined>') {
      _root[cName] = klass;
    }
    return klass;
  }

})(this);
