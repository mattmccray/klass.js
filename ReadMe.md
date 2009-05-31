# Klass.js

Assorted lightweight utility scripts known to work in good browsers (Modern WebKit and Mozilla):

* `Klass`
* `dateUtils`
* `parseArgs`
* `typeOf`
* `watch`

**NOTE:** This is just a cursory overview, more docs to come. Klass is under active development. Specs/Bugs/Patches are welcome. None of this is tested in IE. In fact, I know `watch` will *never* work under IE. The rest? It's possible.


### Klass


A simple class hierarchy layer for JavaScript based on John Resig's [Class][1]. 

Klass supports single parent inheritance, inheritable static methods, namespaces, and a unique class definition style. Named classes:

    Klass( 'Command', {
      
      init: function(name) {
        // Constructor
      },
      
      klass: {
        find: function() {
          // Static method
        }
      }
      
    });

Or anonymous classes, Prototype-ish style: 

    var Command = Klass({
    
      init: function(name) {
        // Static method
      }
    
    });

An **anonymous** class is one that doesn't keep any metadata about it's constructing class.

For improved runtime reflection, **named** classes provide a `_klass` property which is a reference to the constructoring class. Plus it keeps it's `_name`, `_ns` (namespace), and other metadata.

Here's a quick example of why named classes are nifty:

    Klass( 'BaseModel', {
  
      init: function() { // Constructor
        this.attributes = {};
      },
  
      save: function() {
        alert("Saving "+ this._klass._name)
      }
  
      klass: { // These will be static methods (that are inherited, too)
    
        find: function() {
          // in static methods, 'this' references the class object
          alert("Finding models of type "+ this._name); 
        }
    
      }
    });

    // Create a User class that subclasses BaseModel, you can also use
    // BaseModel.subclassAs( "User", {} ); if you prefer...

    BaseModel( 'User', {
  
      init: function() {
        this._super(); // Call BaseModel#init();
      }
  
    })

    User.find(); // -> Alerts "Finding models of type User"

    var u  = new User();

    u.save(); // -> Alerts "Saving User"

### parseArgs

If you have functions/methods that can be called with multiple arrangements of arguments, `parseArgs` can help you out. You just call `parseArgs` with examples of acceptable argument lists (as name value pairs) and it will return an object with the argument values.

    function ftp() {
      var args = parseArgs(
        {host:String},                               // Option 1 = ftp('myhost')
        {host:String, user:String, password:String}, // Option 2 = ftp('myhost', 'usr', 'pwd')
        {host:String, callback:Function}             // Option 3 = ftp('myhost', onConnect)
      );
  
      // args.matchedOn will have the index of the matched argument list, 
      // or -1 if none of the current arguments matched the argments list.
    }

### typeOf

A better version of JavaScript's `typeof`. It will differentiate between objects and arrays, regular expressions, and dates.

Using JavaScript's `typeof`:

    typeof(true) // -> 'boolean'
    typeof("") // -> 'string'
    typeof(42) // -> 'number'
    typeof({}) // -> 'object'
    typeof([]) // -> 'object'
    typeof(/test/) // -> 'object'
    typeof((new Date)) // -> 'object'
    typeof(function(){}) // -> 'function'
    typeof(null) // -> 'object'
    typeof(undefined) // -> 'undefined'
    
See how arrays, regular expressions, nulls, and dates all return 'object'? Annoying, isn't it?

Using `typeOf`:

    typeOf(true) // -> 'boolean'
    typeOf("") // -> 'string'
    typeOf(42) // -> 'number'
    typeOf({}) // -> 'object'
    typeOf([]) // -> 'array'
    typeOf(/test/) // -> 'regexg'
    typeOf((new Date)) // -> 'date'
    typeOf(function(){}) // -> 'function'
    typeOf(null) // -> 'null'
    typeOf(undefined) // -> 'undefined'

Ah, much better.

### dateUtils

Adds support for:

* `Date#strftime`
* `Date#toRelativeTime`


### watch

**NOTE:** `watch` will not work in IE, at all. Probably ever.

Mozilla's JavaScript engine supports a rudimentray `KVO`-like system using `Object#watch`. You tell it what property to watch on an object, give it a callback, and it'll call it anytime the property is changed.

    var credentials = {
      username: "",
      password: ""
    }

    credentials.watch('username', function(key, oldValue, newValue) {
      console.log(key +" has changed");
      return newValue;
    });

    credentials.username = 'bobross'; // -> callback is triggered: "username has changed"

    // to stop observing changes...

    credentials.unwatch('username')

Unfortunately, WebKit doesn't support this (as of yet). However, WebKit does implement `__defineGetter__` and `__defineSetter__`. So I rolled up my sleeves and wrote support for `watch` and `unwatch` for browsers that support defining getters and setter the WebKit way.

**NOTE 2:** Be sure and `unwatch` everything `watch`, or you may wind up with zombie objects. If you get attacked by a zombie apocalype, it's on your head. I warned you... Be sure and protect your brains.


## Specs

Comes complete with tests! Just open `specs/suite.html` in your browser.



  [1]: http://ejohn.org/blog/simple-javascript-inheritance