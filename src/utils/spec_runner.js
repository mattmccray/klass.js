// Simple spec runner that runs in the browser and in the console via v8 or rhino
// Runner HTML:
/*
<html>
  <head><title>Spec Runner</title></head>
  <body></body>
  <script src="spec_runner.js"></script>
  <script src="tests/your_test.js"></script>
</html>
*/

var Spec = {
  // Flags
  SPECS_ONLY: false,
  
  // Group Stack
  stack: [],
  pos: -1,
  get currentStack() {
    return this.stack[this.pos];
  },
  push: function(name) {
    this.stack.push({});
    this.pos += 1;
    this.reset(name);
  },
  pop: function() {
    this.pos -= 1;
    if(this.pos < 0) {
      var eof = (Spec.SPECS_ONLY) ? '' : "/"+ this.stack[0].name;
      this.log( eof +"\n");
    } 
    return this.stack.pop();
  },
  reset: function(name) {
    var name = name || this.currentStack.name,
        setups = this.currentStack.setups || [],
        teardowns = this.currentStack.teardowns || [];
    this.stack[this.pos] = {
      name: name,
      setups: setups,
      teardowns: teardowns,
      passed: 0,
      failed: 0,
      errors: 0,
      errorMsgs: []
    }
  },
  
  runBefores: function() {
    var len = this.currentStack.setups.length;
    for (var i=0; i < len; i++) {
      this.currentStack.setups[i].call();
    };
  },
  runAfters: function() {
    for (var i=0; i < this.currentStack.teardowns.length; i++) {
      this.currentStack.teardowns[i].call();
    };
  },

  pass: function() {
    this.currentStack.passed += 1;
  },
  fail: function() {
    this.currentStack.failed += 1;
  },
  error: function(ex) {
    this.currentStack.errors += 1;
    this.currentStack.errorMsgs.push(ex.description || ex.message || ex);
  },
  
  report: function() {
    var report = [];
    if(this.currentStack.passed > 0)
      report.push( this.currentStack.passed +' passed');
    if(this.currentStack.failed > 0)
      report.push( this.currentStack.failed +' FAILED');
    if(this.currentStack.errors > 0) {
      for (var i=0; i < this.currentStack.errorMsgs.length; i++) {
        if(!Spec.SPECS_ONLY) this.log( "> "+ this.currentStack.errorMsgs[i], 1 );
      };
     report.push( this.currentStack.errors +' ERROR(s)');
    }
    if(!Spec.SPECS_ONLY) this.log( report.join(", "), 1 );
  },
  
  log: function (msg, offset) {
    var pad = "",
        offset = offset || 0,
        len = Spec.pos + offset;
    for(var i=0; i<=len; i++) { pad += "  "; }
    
    if(!_root.window) {
      print(pad + msg);
    } else {
      if(_root.console) {
        console.log(pad + msg);
      }
      if(output = document.getElementById('output')) {
        output.innerHTML += pad + msg +"\n";
      } else if(document.createElement && document.body) {
        var p = document.createElement('pre');
        p.id = "output";
        p.innerHTML = pad + msg +"\n";
        document.body.appendChild(p);
      }
    } 
  },

  // Classes
  ObjectMatcher: function(object) {
    this.object = object;
  },
  
  // Matcher Methods
  Matchers: {
    to: function(evaluator, value) {
      this.evaluate(evaluator, value, true);
    },

    to_not: function(evaluator, value) {
      this.evaluate(evaluator, value, false);
    },
    
    evaluate: function(evaluator, value, comp) {
      try {
        var results = evaluator(this.object, value);
        if(results == comp) {
          Spec.pass();
          return true;
        } else {
          Spec.fail();
          return false;
        }
      } catch( ex ) {
        Spec.error(ex);
        return false;
      }
    }
  }
}


Spec.ObjectMatcher.prototype = Spec.Matchers;

var _root = this; // window || global, depending on context

// group dsl
function describe(groupName, block) {
  Spec.push(groupName);
  Spec.log(groupName, -1);
  block.call();  
  Spec.pop();
}

// setup/teardown dsl
function before(block) {
  Spec.currentStack.setups.push(block);
}
function after(block) {
  Spec.currentStack.teardowns.push(block);
}

// test dsl
function should(testName, block) {
  // Reset pass/fail/error counts on stack...
  Spec.reset();
  Spec.log(testName);
  Spec.runBefores();
  try {
    block.call();
  } catch (ex) {
    Spec.error(ex);
  }
  Spec.runAfters();
  Spec.report();
}
// alias
var it = should;

// matcher dsl
function expect(obj) {
  return new Spec.ObjectMatcher(obj);
}

// evaluators
function equal(expected, actual) {
  if (expected instanceof Object) {
    for (var key in expected)
      if (expected[key] != actual[key]) return false;
    for (var key in actual)
      if (actual[key] != expected[key]) return false;
    return true;
  } else {
    return expected == actual;
  }
}

function be_undefined(obj) {
  return (typeof obj == 'undefined');
}
