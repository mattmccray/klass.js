// Version 2.0.7
(function(globalObject, ident) {
  function klass(name, methods, scope) {
    if(arguments.length == 1 && typeof(name) != 'string') { // using typeOf to better detect true 'objects'
      methods = name;
      name = '[AnonymousKlass]';
    }
    if(typeof methods == 'undefined') methods = {};
    if(!('callSuper' in methods)) {
      methods.callSuper = function callSuper() {
        var symbol = Array.prototype.shift.call(arguments),
            parent = methods,
            method = (parent[symbol]) ? parent[symbol] : false;
        if(method) { return method.apply(this, arguments); }
        else { throw "Method not found: "+ symbol; };
      };
    };
    if(!('method' in methods)) {
      methods.method = function method() {
        if(arguments.length == 0 || typeof arguments[0] != "string") { throw "You must specify a method name (as a String)"; };
        var self = this,
            args = Array.prototype.slice.call(arguments),
            name = args.shift(),
            meth = self[name];
        if (typeof meth === 'function') { return function curriedMethod() {
            return meth.apply(self, args.concat(Array.prototype.slice.call(arguments)));
          };}
        else { throw "Method "+ name +" not found!"; };
      };
    };
    function klass_ctor() {
      if(this == globalObject || typeof(this.constructor) == 'undefined') { return klass_ctor.subKlass.apply(this, arguments); }
      else if('init' in this) { this.init.apply(this, arguments);  }; // Constructor
    };
    if('_static_methods' in methods) {
      for(fName in methods['_static_methods']) { klass_ctor[fName] = methods['_static_methods'][fName]; };
    };
    if('klass' in methods) {
      for(fName in methods['klass']) { klass_ctor[fName] = methods['klass'][fName]; };
      methods._static_methods = methods['klass'];
    };
    klass_ctor.prototype = methods;
    klass_ctor.prototype.klass = klass_ctor;
    klass_ctor.displayName = name;
    klass_ctor.subKlass = function(subName, subMethods) {
      if(arguments.length == 1 && typeof(subName) != 'string') { // using typeOf to better detect true 'objects'
        subMethods = subName;
        subName = '[AnonymousSubKlass]';
      };
      function parentKlass() {
        for(prop in subMethods) { this[prop] = subMethods[prop]; };
      };
      parentKlass.prototype = methods;
      return klass(subName, new parentKlass());
    };
    if(name != '[AnonymousKlass]' && name != '[AnonymousSubKlass]') {
      if(typeof scope != 'undefined')
        scope[name] = klass_ctor
      else
        globalObject[name] = klass_ctor;
    };
    return klass_ctor
  };
  globalObject[ident] = klass;
})((this.exports || this), 'Klass');