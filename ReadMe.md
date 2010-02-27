# Klass.js

**NOTE:** This is just a cursory overview, more docs to come. Klass is under active development. Specs/Bugs/Patches are welcome. It does now work under IE 8 (not sure about older versions of IE).

Klass.js is a simple class hierarchy layer for JavaScript that leverages the language's `prototype` chain. It does as little object munging as possible. You define a class's `prototype` in the class builder. So instantiating classes should be very cheap.

It's *not* a DOM framework. It's meant to run in conjunction with jQuery, or your DOM framework of choice.

Klass supports single parent, true prototype-based inheritance, inheritable static methods, and a unique class definition style. Named classes:

    Klass( 'Command', {
      
      init: function(name) {
        // Constructor
        
        // `this` refers to the instance object...
      },
      
      klass: {
        find: function() {
          // Static method
          // Here, `this` refers to the class constructor object
        }
      }
      
    });

Or anonymous classes, Prototype-ish style: 

    var Command = Klass({
    
      init: function(name) {
        // Static method
      }
    
    });

For improved runtime reflection, **named** classes provide a `.displayName` property which is a reference to the constructoring class's variable name.

An **anonymous** class is one that doesn't keep/know it's class name, it sets the constructor object's `.displayName` to '[AnonymousKlass]'.

Also, all instantiated classes can access their Klass by the `.klass` property that's provided.

Here's a quick example of why named classes are nifty:

    Klass( 'BaseModel', {
  
      init: function() { // Constructor
        this.attributes = {};
      },
  
      save: function() {
        alert("Saving "+ this.klass.displayName)
      }
  
      klass: { // These will be static methods (that are inherited, too)
    
        find: function() {
          // in static methods, 'this' references the class object
          alert("Finding models of type "+ this.displayName); 
        }
    
      }
    });

    // Create a User class that subclasses BaseModel, you can also use
    // BaseModel.subKlass( "User", {} ); if you prefer...

    BaseModel( 'User', {
  
      init: function() {
        this.callSuper('init'); // Call BaseModel#init();
      }
  
    })

    User.find(); // -> Alerts "Finding models of type User"

    var u  = new User();

    u.save(); // -> Alerts "Saving User"

So you can see, the parent methods, and static methods, know the child class's name. Trust me. Very handy.

You'll notice the call to `this.callSuper('init')`. This method is telling your Klass to look at your parent's prototype object for a method called 'init', and executes it passing any extras parameters provided.

Since you're defining the object's `prototype`, you can use JavaScript's support (in Moz and WebKit) for property getters and setters.

Klass also provides support for method binding: `[object].method('methodName'[, curriedParams]);` For example:

    Klass('SelectionManager', {
      
      init: function(containerSel, itemSel) {
        this.container = $(containerSel);
        this.itemSelector = itemSel;
        
        this.container.click( this.method('handleClick', false) );
        this.container.dblclick( this.method('handleClick', true) );
      },
      
      get selectedItems() { // A getter!
        return $(this.itemSelector, this.containerSel);
      },
      
      handleClick: function(isDblClick, event) {
        // `this` is what you'd expect (the instance), not a DOM element...
        if(isDblClick)
          alert("List was double clicked!");
        else
          alert("List was clicked!");
      }
      
    })


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


### KvcKlass

Rudimentary support for key-value coding (all property accessed via .get()/.set() methods). You can observe key changes. More docs to come.

    KvcKlass('User', {
      
      name: 'Default Value'
      
    });
    
    var u = new User();
    
    u.get('name') //-> 'Default Value'
    
    function callback(key, value, oldValue) {
      console.log(key +' changed to '+ value +' from '+ oldValue);
    }
    
    u.observe('name', callback);
    
    u.set('name', 'M@'); // Callback is fired with callback('name', 'M@', 'Default Value');

Has support for calling a method_missing like function when a key is get/set that doesn't exist:

    KvcKlass('User', {
      unknownProperty: function(key, value) {
        // If value exists, .set() has been called, other wise it's a .get();
        if(typeOf(value) != 'undefined') {
          this[key] = value; // You can do whatever you want here...
        } else {
          this[key] = "some default value"; // Or whatever you wanna do with it.
          return key +" didn't exist, before now.";
        }
      }
    })
    
    var u = new User();
    
    u.get('name'); //-> 'name didn't exist, before now.'
    u.get('name'); //-> 'some default value'
    u.set('name', 'M@');
    u.get('name'); //-> 'M@'

Of course using it like that is moot. But using this pattern is great for lazy loading properties.



## Specs

Comes with tests! Just open `specs/suite.html` in your browser. Not entirely complete coverage yet, but it's getting better.
