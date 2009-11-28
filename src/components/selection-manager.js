// FIXME: Make selectedItem(s) getters (what about setters???)

Klass('SelectionManager', {
  
  init: function(options) {
    options = _.extend({
      name: 'selection',
      container: 'list-control',
      item: 'list-item',
      selectedClass: 'selected',
      multiSelect: true
    }, (options || {}));
    
    this.name = options.name;
    
    this.container = $( this._normalizeSelector( options.container) );
    
    this.itemClass = this._normalizeClass( options.item );
    this.itemSelector = this._normalizeSelector( options.item );
    
    this.selectedClass = this._normalizeClass( options.selectedClass );
    this.selectedSelector = this._normalizeSelector( options.selectedClass );
    
    this.allowMultiple = options.multiSelect;

    this._selectedItem = null;
    this._extendedSelection = false;
    
    // Event delegation from the items to the container...
    this.container.bind('click', this.method('handleClick'));
  },
  
  handleClick: function(event) {
    var target = $(event.target),
        itemNode = (target.hasClass(this.itemClass)) ? 
                      target : 
                      target.parents(this.itemSelector);
    
    this._selectNode(itemNode, this._getSelectionType(event));
  },
  
  selectedItem: function() {
    return this._selectedItem;
  },
  
  selectedItems: function() {
    return $(this.selectedSelector, this.container);
  },
  
  selectPrev: function() {
    if(!this.isEmpty()) {
      var prevElem = this._selectedItem.prev(); // TODO: Should I add the itemSelector?
      if(prevElem.length > 0) {
        this._clearAll();
        this._selectedItem = prevElem; // TODO: Should I add the itemSelector?
        this._addSelectedClass();
        this._fireChangeEvent();
      }
    } else {
      this._selectedItem = $(this.itemSelector+":last", this.container);
      this._addSelectedClass();
      this._fireChangeEvent();
    }
  },
  
  selectPrevious: function() { return this.selectPrev(); },
  
  selectNext: function() {
    if(!this.isEmpty()) {
      var nextElem = this._selectedItem.next(); // TODO: Should I add the itemSelector?
      if(nextElem.length > 0) {
        this._clearAll();
        this._selectedItem = nextElem
        this._addSelectedClass();
        this._fireChangeEvent();
      }
    } else {
      this._selectedItem = $(this.itemSelector+":first", this.container);
      this._addSelectedClass();
      this._fireChangeEvent();
    }
  },
  
  selectNone: function() {
    if(!this.isEmpty()) {
      this._clearAll();
      this._selectedItem = null;
      this._fireChangeEvent();
    }
  },
  
  collapse: function() {
    if(!this.isEmpty() && this._selectedItem.length > 1) {
      this._clearAll();
      this._addSelectedClass();
      this._fireChangeEvent();
    }
  },

  selectAll: function() {
    this._clearAll();
    if(this.allowMultiple) {
      $(this.itemSelector, this.container).addClass(this.selectedClass);
    } else {
      $(this.itemSelector+":first", this.container).addClass(this.selectedClass);
    }
    this._selectedItem = $(this.selectedSelector+":first", this.container);
    this._fireChangeEvent();
  },
  
  isEmpty: function() {
    return (this._selectedItem == null || this._selectedItem.length == 0);
  },
  
  validate: function() {
    if(this.selectedItems().length == 0) {
      this.selectedItem = null;
      this._fireChangeEvent();
    }
  },
  
  preserveSelection: function() {
    if(!this.isEmpty()) {
      this._selectedItems = _.map(this.selectedItems().get(), function(n){ return n.id; })
      this._selectedItemId = this._selectedItem.attr('id');
    }
  },
  
  restoreSelection: function() {
    if(this._selectedItems) {
      var self = this;
      _.each(this._selectedItems, function(id) {
        self._addSelectedClass( $('#'+id) );
      })
      this._selectedItem = $('#'+ this._selectedItemId);
      this._selectedItems = false;
    }
    
  },
  
  _selectNode: function(elem, selectionType) {
    switch(selectionType) {
      case 'replace':
        if(this._selectedItem == null || this._extendedSelection || elem.get(0) != this._selectedItem.get(0)) {
          this._clearAll();
          this._selectedItem = elem;
          this._addSelectedClass(elem);
          this._extendedSelection = false;
          this._fireChangeEvent();
        }
      break;
      
      case 'extend':
        this._clearAll();
        var mode = 'skip',
            self = this,
            selNode = (this._selectedItem).get(0),
            tgtNode = elem.get(0);
        $(this.itemSelector, this.container).each(function(idx) {
          if(selNode == this || this == tgtNode) mode = (mode == 'select') ? 'done' : 'select';
          if(mode != 'skip') self._addSelectedClass( $(this) )
          if(mode == 'done') return false;
        });
        this._extendedSelection = true;
        this._fireChangeEvent();
      break;
      
      case 'append':
        if(elem.hasClass(this.selectedClass))
          elem.removeClass(this.selectedClass);
        else {
          this._selectedItem = elem;
          this._addSelectedClass();
        }
        this._extendedSelection = true;
        this._fireChangeEvent();
      break;
    }
  },

  
  _getSelectionType: function(event) {
    var selType = 'replace';
    if(this.allowMultiple && !this.isEmpty()) {
      if(event.shiftKey)  selType = 'extend';
      else if(event.metaKey || event.ctrlKey) selType = 'append';
    }
    return selType;
  },
  
  _fireChangeEvent: function() {
    AppEvent.fire( this.name +":selection:changed", {
      sender: this,
      selectedItem: this._selectedItem
    });
  },
  
  _clearAll: function() {
    $(this.itemSelector, this.container).removeClass(this.selectedClass);
  },
  
  _addSelectedClass: function(node) {
    node = node || this._selectedItem;
    node.addClass(this.selectedClass);
  },
  
  _normalizeClass: function(value) {
    return (value.indexOf('.') == 0) ? value.slice(1) : value;
    
  },
  
  _normalizeSelector: function(value) {
    return (value.indexOf('.') == 0) ? value : "."+ value;
  },
  
  klass: {
    SINGLE: 'single',
    MULTIPLE: 'multiple'
  }
  
})


/*


function getSelectionTypeFromEvent(event, allowMultiple) {
  var selType = 'single';
  if(event.shiftKey) selType = 'contiguous';
  else if(allowMultiple && (event.ctrlKey || event.metaKey)) selType = 'multiple';
  return selType;
}


var SelectionManager = Class.create({
  
  initialize: function(name, selectedClass) {
    this.name = name || 'unnamed';
    this._selectedClass = selectedClass || 'selected';
    this._items = $A();
  },
  
  selectNode: function(elem, selectionType) {
    switch(selectionType) {

      case 'contiguous':
          var startElem = this._items.first();
          if(!startElem || (startElem === elem)) {
            this.__clearTheList();
            this.__addToList(elem);
            break;
          }
          var siblings = startElem.up().visibleChildElements(),
              doSelect = false;

          this.__clearTheList();
          this.__addToList(startElem);
          siblings.each(function(_currElem){
            if(doSelect) {
              this.__addToList(_currElem, true);
              if(_currElem === startElem || _currElem === elem)
                doSelect = false;
            } else {
              if(_currElem === startElem || _currElem === elem) {
                doSelect = true;
                this.__addToList(_currElem, true);
              }
            }
          }, this);
        break;

      case 'multiple':
        if(this._items.include(elem))
          this.__removeFromList(elem)
        else
          this.__addToList(elem);
        break;

      default: // Single
        this.__clearTheList();
        this.__addToList(elem);
    }
    this.__fire( 'selection:changed', {manager:this, type:selectionType, elem:elem});
  },
  
  moveUp: function(extend) {
    var nextUp = (this._items[1] || this._items[0]).previousVisibleSibling(); // previousSiblings().first();
    if(nextUp) this.selectNode(nextUp, extend);
  },
  
  moveDown: function(extend) {
    var nextDown = this._items.last().nextVisibleSibling(); //nextSiblings().first();
    if(nextDown) this.selectNode(nextDown, extend);
  },
  
  isEmpty: function() {
    return (this._items.length == 0);
  },
  
  notEmpty: function() {
    return !this.isEmpty();
  },
  
  collapse: function() {
    var firstNode = this.selectedItem();
    this.__clearTheList();
    this.__addToList(firstNode);
    return firstNode;
  },
  
  selectedItem: function() {
    return this._items.first();
  },
  
  selectedItems: function() {
    return this._items;
  },
  
  clear: function() {
    this.__clearTheList();
    this.__fire( 'selection:changed', {manager:this, type:null, elem:null});
  },
  
  addState: function(state) {
    this._items.each(function(item){
      item.addClassName(state);
    }, this);
  },
  
  removeState: function(state) {
    this._items.each(function(item){
      item.removeClassName(state);
    }, this);
  },

  removeStates: function() {
    var arrStates = $A(arguments);
    this._items.each(function(item){
      arrStates.each(function(state){
        item.removeClassName(state);
      });
    }, this);
  },
  
  hasState: function(state) {
    var count = 0;
    this._items.each(function(item){
      if(item.hasClassName(state)) count++;
    }, this);
    return (count == this._items.length);
  },
  
  toggleState: function(state) {
    this._items.each(function(item){
      item.toggleClassName(state);
    }, this);
  },
  
  __fire: function(eventName, memo) {
    // Automatically add the manager to the memo???
    appEvents.fire(this.name +':'+ eventName, memo);
    appEvents.fire('selection:'+ eventName, memo);
  },
  
  __addToList: function(elem, append) {
    if(elem && !this._items.include(elem)) {
      elem.addClassName(this._selectedClass);
      if(append)
        this._items.push(elem);
      else
        this._items.unshift(elem);
    }
  },
  
  __removeFromList: function(elem) {
    if(this._items.include(elem)) {
      elem.removeClassName(this._selectedClass);
      this._items = this._items.without(elem);
    }
  },
  
  __clearTheList: function() {
    this._items.each(function(_elem){ this.__removeFromList(_elem)}, this);
  }
  
});


*/