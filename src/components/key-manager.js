Klass('KeyManager', {
  
  init: function(states) {
    this.states = states;
    this.maps = {};
  },
  
  defineKeymapForState: function(state, keymap) {
    this.maps[state] = new KeyMap(this, state, keymap);
    return this.maps[state];
  },

  keymapForState: function(state) {
    return this.maps[state];
  },

  currentKeymap: function() {
    return this.maps[this.states.currentState];
  },
  
  handleKeyEvent: function(event) {
    if( map = this.currentKeymap() ) {
      map.dispatch( this._getKeyCode(event), event );
    }
  },
  
  _getKeyCode: function(evt) {
    var code = evt.charCode||evt.keyCode,
        ctrl = (evt.ctrlKey || evt.metaKey) ? 'c' : '',
        alt = evt.altKey ? 'a' : '',
        shift = evt.shiftKey ? 's' : '',
        key = (code >= 48 && code <= 90) ? String.fromCharCode(code) : code;
    return ctrl + alt + shift + key;
  }
  
})

Klass('KeyMap', {
  
  init: function(manager, state, initialMaps) {
    this.state = state;
    this.manager = manager;
    this.map = {};
  },
  
  addEvt: function(key, event) {
    this.map[key] = this.method('fireEvent', event)
  },
  
  addFnc: function(key, func) {
    this.map[key] = func;
  },
  
  fireEvent: function(appEvent, event) {
    AppEvent.fire(appEvent, {nativeEvent:event});
  },
  
  dispatch: function(key, event) {
    if(this.map[key]) {
      this.map[key](event);
      event.preventDefault();
    }
  }
  
})

var Key = {
  SPACE:    32,
  UP:       38,
  DOWN:     40,
  LEFT:     37,
  RIGHT:    39,
  ENTER:    13,
  RETURN:   13,
  TAB:      9,
  PAGEUP:   33,
  PAGEDOWN: 34,
  DELETE:   46,
  BACKSPACE:8,
  END:      35,
  HOME:     36
}
