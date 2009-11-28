load('src/klass.js')
load('src/core/underscore.js')
load('src/core/date.js')
load('src/utils/parse-args.js')
load('src/utils/spec_runner.js')


var Screw = {
  Unit: function(block) {
    block.call();
  }
}


load('specs/specs/klass_spec.js')
load('specs/specs/parseArgs_spec.js')
load('specs/specs/dateUtils_spec.js')
load('specs/specs/typeOf_spec.js')
load('specs/specs/prototypeOf_spec.js')
