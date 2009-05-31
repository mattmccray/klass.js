// Inspired by John Resig's Class (and he from base2 and Prototype) -> http://ejohn.org/blog/simple-javascript-inheritance
(function klassWrapper(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b(_super|_klass)\b/ : /.*/;

  // The base Class implementation
  this.Klass = function KlassBase(name, props){ 
    if(this instanceof arguments.callee) {
    } else {
      return arguments.callee.subclassAs(name, props);
    }
  };

  // obj.method(name, args) will curry (bind) this method call
  this.Klass.prototype.method = function method() {
    if(arguments.length == 0 || typeof arguments[0] != "string")
      throw "You must specify a method name (as a String)";
    var self = this,
        args = Array.prototype.slice.call(arguments),
        name = args.shift(),
        meth = self[name];
    if (typeof meth === 'function') 
      return function() {
        return meth.apply(self, args.concat(Array.prototype.slice.call(arguments)));
      }
    else
      throw "Method "+ name +" not found!";
  };

  // Helper method for assigning properties and, optionally, providing _super()
  function mergeProperties(from, to, parent, self) {
    for (var name in from) {
      // Check if we're overwriting an existing function
      to[name] = typeof from[name] == "function" && 
        typeof parent[name] == "function" && fnTest.test(from[name]) ?
        (function(name, fn){
          return function() {
            var tmp  = this._super;
            
            // Add a new ._super() method that is the same method but on the super-class
            this._super = parent[name];
            
            // The method only needs to be bound temporarily, so we remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            return ret;
          };
        })(name, from[name]) :
        from[name];
    }
  }

  // Create a new Class that inherits from this class
  Klass.subclassAs = function subclassAs(klassName, prop) {
    // Support anonymous classes
    if(typeof klassName == 'object' && typeof prop == 'undefined') {
      prop = klassName;
      klassName = '';
    }
    var _super       = this.prototype,
        klassIdent   = (klassName || ""),
        klassPath    = klassIdent.split('.'),
        klassName    = klassPath.pop(),
        klassMeths   = prop['klass'],
        supKlasMeths = this['_staticMethods'],
        ctx          = window;
    delete prop['klass'];

    // Create any needed namespaces...
    for (var i=0; i < klassPath.length; i++) {
      var pathSeg = klassPath[i];
      if(!ctx[pathSeg]) ctx[pathSeg] = {};
      ctx = ctx[pathSeg];
    };
    klassPath = klassPath.join('.');

    // Instantiate a base class (only create the instance, don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Assign meta data
    if(klassName != '') {
      Klass._name = klassName;
      Klass._ns = klassPath;
      Klass._fullname = klassIdent;
      Klass._staticMethods = klassMeths;
      prototype._klass = Klass;
    }

    // Copy the properties over onto the new prototype
    mergeProperties(prop, prototype, _super, this);

    // The dummy class constructor
    function Klass(klassName, props) {
      if(this instanceof arguments.callee) {
        // All construction is actually done in the init method
        if ( !initializing && this.init )
          this.init.apply(this, arguments);
      } else {
        // If the method is being used as a function (no new keywoard), 
        // then make it a subclassAs() call
        arguments.callee.subclassAs(klassName, props)
      }
    }

    // Populate our constructed prototype object
    Klass.prototype = prototype;

    // Enforce the constructor to be what we expect
    Klass.constructor = Klass;

    // Setup classMethods...
    if(supKlasMeths) mergeProperties(supKlasMeths, Klass, {}, Klass);
    mergeProperties(klassMeths, Klass, (supKlasMeths || {}), Klass);

    // And make this class extendable
    Klass.subclassAs = arguments.callee;    

    // Assign to the window or namespace
    if(klassName != '') ctx[klassName] = Klass;

    return Klass;
  };
})();