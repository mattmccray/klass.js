// FIXME: Do new AppEvent objects need to be created for every event???
Klass('AppEvent', {

  init: function(eventType, payload, src) {
    this.type = eventType;
    this.data = payload || {};
    this.source = src || null;
  },
  
  fire: function() {
    this.klass._broadcastEvent(this);
  },
  
  klass: {
    
    __registry: {},
    
    fire: function(eventType, payload) {
      var evt = new this(eventType, payload, arguments.caller);
      evt.fire();
      return evt;
    },
    
    listen: function(eventType, method) {
      if(!this.__registry[eventType]) this.__registry[eventType] = [];
      this.__registry[eventType].push(method);
    },

    listenAll: function(eventMap) {
      for(eventKey in eventMap) {
        if(eventMap.hasOwnProperty(eventKey)) {
          this.listen(eventKey, eventMap[eventKey]);
        }
      }
    },
    
    _broadcastEvent: function(evt) {
      if(this.__registry[evt.type]) {
        for (var i = this.__registry[evt.type].length - 1; i >= 0; i--){
          this.__registry[evt.type][i](evt); //FIXME: Add try/catch block around broadcastEvents?
        }
      }
    }
     
  }

});