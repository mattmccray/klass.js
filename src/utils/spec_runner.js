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

// TODO:

var Spec = {
  // Flags
  SPECS_ONLY: false,
  
  output: [],
  
  // Group Stack
  stack: [],
  pos: -1,
  // get currentStack() {
  //   return this.stack[this.pos];
  // },
  push: function(name) {
    this.stack.push({});
    this.pos += 1;
    this.reset(name);
  },
  pop: function() {
    this.pos -= 1;
    if(this.pos < 0) {
      var eof = (Spec.SPECS_ONLY) ? '' : " "; //"/"+ this.stack[0].name;
      this.log( eof +"\n");
    } 
    return this.stack.pop();
  },
  reset: function(name) {
    var name = name || this.stack[this.pos].name,
        setups = this.stack[this.pos].setups || [],
        teardowns = this.stack[this.pos].teardowns || [];
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
    var len = this.stack[this.pos].setups.length;
    for (var i=0; i < len; i++) {
      this.stack[this.pos].setups[i].call();
    };
  },
  runAfters: function() {
    for (var i=0; i < this.stack[this.pos].teardowns.length; i++) {
      this.stack[this.pos].teardowns[i].call();
    };
  },

  pass: function() {
    this.stack[this.pos].passed += 1;
  },
  fail: function() {
    this.stack[this.pos].failed += 1;
  },
  error: function(ex) {
    this.stack[this.pos].errors += 1;
    this.stack[this.pos].errorMsgs.push(ex.description || ex.message || ex);
  },
  
  report: function() {
    var report = [];
    if(this.stack[this.pos].passed > 0)
      report.push( this.stack[this.pos].passed +' passed');
    if(this.stack[this.pos].failed > 0)
      report.push( this.stack[this.pos].failed +' FAILED');
    if(this.stack[this.pos].errors > 0) {
      for (var i=0; i < this.stack[this.pos].errorMsgs.length; i++) {
        if(!Spec.SPECS_ONLY) this.log( "> "+ this.stack[this.pos].errorMsgs[i], 1 );
      };
     report.push( this.stack[this.pos].errors +' ERROR(s)');
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
      
      this.output.push(pad + msg);
      _root.onload = function(){
        var out = document.getElementById('output');
        if(!out) {
          out = document.createElement('div');
          out.id = "output";
          document.body.appendChild(out);
        }
        
        var transformed = [];
        for (var i=0; i < Spec.output.length; i++) {
          var line = Spec.output[i];
          tLine = line.replace(/[\W]/g, '&nbsp;');
          
          if(/[\w]*\>/.test(line)) {
            transformed.push( '<span style="color:red;">'+ tLine +'</span>' );
          }
          else if(/[\w]*[\d]* passed$/.test(line)) {
            transformed.push( '<span style="color:green;">'+ tLine +'</span>' );
          }
          else if(/[\w]*[\d]* passed/.test(line)) {
            transformed.push( '<span style="color:orange;">'+ tLine +'</span>' );
          }
          else {
            transformed.push( tLine );
          }
        }
        
        
        out.innerHTML = "<div><tt>"+ transformed.join("</tt></div><div><tt>") +"</tt></div>";
       } 
      
      
/*
      if(output = document.getElementById('output')) {
        output.innerHTML += pad + msg +"\n";
      } else if(document.createElement && document.body) {
        var p = document.createElement('pre');
        p.id = "output";
        p.innerHTML = pad + msg +"\n";
        document.body.appendChild(p);
      }
*/    
      /*
      if(!_root.onload) _root.onload = function() {
        var results = document.getElementById('output').innerHTML.split('\n'),
            transformed = [];
        for (var i=0; i < results.length; i++) {
          var line = results[i];
          if(/[\w]*\&gt;/.test(line)) {
            transformed.push( '<span style="color:red;">'+ line +'</span>' );
          } else if(/[\w]*[\d]* passed$/.test(line)) {
            transformed.push( '<span style="color:green;">'+ line +'</span>' );
          } else if(/[\w]*[\d]* passed/.test(line)) {
            transformed.push( '<span style="color:orange;">'+ line +'</span>' );
          } else {
            transformed.push( line );
          }
        };
        document.getElementById('output').innerHTML = transformed.join("<br/>");
      }
      */
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
  Spec.stack[Spec.pos].setups.push(block);
}
function after(block) {
  Spec.stack[Spec.pos].teardowns.push(block);
}

// test dsl
function should(testName, block) {
  // Reset pass/fail/error counts on stack...
  Spec.reset();
  Spec.log(testName);
  try {
    Spec.runBefores();
    block.call();
    Spec.runAfters();
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
// alias
var assert = expect;


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
