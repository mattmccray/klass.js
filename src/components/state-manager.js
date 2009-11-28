// Make .currentState and/or .state a getter/setter method?
// Convert to KvcKlass so that the currentState can be observed?
Klass('StateManager', {
  
  init: function(name, states, initialState, target) {
    this.name = name || 'unnamed';
    this.target = $( target || document.body );
    this.currentState = null;
    this.currentStateIdx = -1;
    this.previousState = null;
    this.validStates = states; // Remove the '.' _.map(arr, callback(item))
    this.set( initialState || states[0] );
  },
  
  set: function(newState) {
    if(newState == this.currentState) return;
    var newStateIdx = _.include(this.validStates, newState);
    if(newStateIdx >= 0) {
      this.previousState = this.currentState;
      this.target.removeClass(this.previousState);
      this.target.addClass(newState);
      this.currentState = newState;
      this.currentStateIdx = newStateIdx;
      AppEvent.fire(this.name+':state:changed', { target:this.target, oldState:this.previousState, 'state':newState, mgr:this });
    } else {
      throw newState +" is not a valid state! Should be one of: "+ this.validStates.join(", ") +'.';
    }
    return this;
  },
  
  setState: function(state){ return this.set(state); },
  
  get active() {
    return this.currentState;
  },
  
  set active(stateName) {
    this.set(stateName);
  },
  
  revert: function() {
    this.set(this.previousState);
    return this;
  },
  
  toggle: function() {
    // Rolls through the states
    var nextIdx = this.currentStateIdx+1;
    if(nextIdx >= this.validStates.length) nextIdx = 0;
    this.set(this.validStates[nextIdx]);
  },
  
  is: function(state) {
    return (this.currentState == state);
  },
  
  not: function(state) {
    return !this.is(state);
  },
  
  isnt: function(state) {
    return this.not(state);
  },
  
  toString: function() {
    return this.currentState;
  }
});