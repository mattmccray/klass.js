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
    this.stack.push({
      name: name,
      passed: 0,
      failed: 0,
      errors: 0,
      errorMsgs: []
    });
    this.pos += 1;
  },
  pop: function() {
    this.pos -= 1;
    if(this.pos < 0) {
      var eof = (Spec.SPECS_ONLY) ? '' : "/"+ this.stack[0].name;
      this.log( eof +"\n");
    } 
    return this.stack.pop();
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
      report.push( this.currentStack.failed +' failed');
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

// test dsl
function should(testName, block) {
  // Reset pass/fail/error counts on stack...
  Spec.pop(); Spec.push();
  
  Spec.log(testName);
  try {
    block.call();
  } catch (ex) {
    Spec.error(ex);
  }
  Spec.report();
}
// alias
var it = should;

// matcher dsl
function expect(obj) {
  return new Spec.ObjectMatcher(obj);
}

// evaluators
function equal(obj, value) {
  return (obj == value);
}

function be_undefined(obj) {
  return (typeof obj == 'undefined');
}
