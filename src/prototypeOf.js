
if ( typeof Object.getPrototypeOf !== "function" ) {
  if ( typeof "test".__proto__ === "object" ) {
    Object.getPrototypeOf = function(object){
      return object.__proto__;
    };
  } else {
    Object.getPrototypeOf = function(object){
      // May break if the constructor has been tampered with
      return object.constructor.prototype;
    };
  }
}

Object.setPrototypeOf = (function(){ // Memoized
  if( {}.__proto__ ) {
    return function(o, proto){ 
      o.__proto__ = proto;
      return o;
    }
  } else {
    return function(o, proto){ 
      o.constructor.prototype = proto;
      return o;
    }
  }
})();