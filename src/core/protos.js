// Only really works on WebKit/Mozilla (So firefox, chrome, safari)

if ( typeof Object.getPrototypeOf !== "function" ) {
  if ( typeof "test".__proto__ === "object" ) {
    Object.getPrototypeOf = function getPrototypeOf(object){
      return object.__proto__;
    };
  } else {
    Object.getPrototypeOf = function getPrototypeOf(object){
      // May break if the constructor has been tampered with
      return object.constructor.prototype;
    };
  };
};

Object.setPrototypeOf = (function(){ // Memoized
  if( {}.__proto__ ) {
    return function setPrototypeOf(o, proto){
      o.__proto__ = proto;
      return o;
    }
  } 
  else {
    return function setPrototypeOf(o, proto){ 
      for(field in proto) { // Munge it for IE??
        o.constructor.prototype[field] = proto[field];
      }
      return o;
    }
  }
})();
