// REQUIRES TAFFY DB!

Klass('DataCollection', {
  
  init: function(name, data) {
    this.name = name;
    this.db = new TAFFY(data || []);
    this.db.onInsert = this.method('triggerDbEvent', 'insert');
    this.db.onUpdate = this.method('triggerDbEvent', 'update');
    this.db.onRemove = this.method('triggerDbEvent', 'remove');
    this.supressEvents = false;
  },
  
  orderBy: function(fields) {
    this.order_by_fields = fields;
    this.db.orderBy(this.order_by_fields);
  },
  
  triggerDbEvent: function(eventType, newObj, oldObj) {
    if(!this.supressEvents) {
      AppEvent.fire(this.name +":db:"+ eventType, {
        value: newObj,
        oldValue: oldObj
      });
      AppEvent.fire(this.name +":db:changed", {
        type: eventType,
        value: newObj,
        oldValue: oldObj
      });
    }
  },
  
  create: function(objectOrArray) {
    var results;
    if(typeOf(objectOrArray) == 'array') {
      this.supressEvents = true;
      this.db.insert(objectOrArray);
      this.supressEvents = false;
      this.triggerDbEvent('insert', objectOrArray)
    } else {
      this.db.insert(objectOrArray);
    }
    if(this.order_by_fields) this.db.orderBy(this.order_by_fields);
    
    return results;
  },
  insert: function(objectOrArray) {
    return this.create(objectOrArray);
  },
  
  read: function(filter) {
    if(this.order_by_fields) this.db.orderBy(this.order_by_fields);
    return (filter) ? this.db.get(filter) : this.db.get();
  },
  get: function(filter) { 
    var results = this.read(filter); 
    return (results.length == 1) ? results[0] : results;
  },
  
  all: function() { return this.read(); },
  
  each:function(iter, filter) {
    if(this.order_by_fields) this.db.orderBy(this.order_by_fields)
    if(filter)
      this.db.forEach(iter, filter);
    else
      this.db.forEach(iter);
    return this;
  },
    
  getById: function(id) {
    return this.db.get({id:id});
  },
  
  update: function(object, finder_obj) {
    finder_obj = finder_obj || {};
    this.db.update(object, finder_obj);
    if(this.order_by_fields) this.db.orderBy(this.order_by_fields);
  },
  
  find: function(field) {
    return (new DataFinder(this)).where(field);
  },
  where: function(field) { return this.find(field); },
  
  clear: function() {
    this.supressEvents = true;
    this.db.remove();
    this.supressEvents = false;
  },
  
  klass: {
    build: function(name, data) {
      if(!this._collections) this._collections = {};
      this._collections[name] = new this(name, data)
      return this._collections[name];
    },
    
    get: function(name) {
      return this._collections[name];
    },
    
    find: function(name, field) {
      return this._collections[name].find(field);
    },
    where: function(name, field) { return this.find(name, field); }
  }
  
});

Klass('DataFinder', {
  
  init: function(collection) {
    this.collection = collection;
    this.filter = new DataFilter(this);
    this.finder_object = {};
    this.order_by_fields = false;
  },
  
  where: function(field) {
    this.next_field = field;
    return this.filter;
  },
  
  and: function(field) {
    // I think here needs to be more here...
    this.next_field = field;
    return this.filter;
  },
  
  or: function() {
    throw "OR logic has not been implemented yet!"
  },
  
  orderBy: function(field) {
    this.order_by_fields = field;
    return this;
  },
  
  order_by: function(field) {
    return this.orderBy(field);
  },
  
  items: function() {
    if(this.order_by_fields) this.collection.db.orderBy(this.order_by_fields)
    return this.collection.db.get(this.finder_object);
  },
  
  get: function() {
    var results = this.items();
    return (results.length == 1) ? results[0] : results;
  },
  
  all: function() {
    return this.items();
  },
  
  attributes: function() {
    var results = this.get();
    return (results.length == 1) ? results[0] : results;
  },
  
  each:function(iter) {
    if(this.order_by_fields) this.collection.db.orderBy(this.order_by_fields)
    this.collection.db.forEach(iter, this.finder_object);
    return this;
  },
  
  update: function(object) {
    this.collection.update(object, this.finder_object);
    return this;
  },

// This is a little different, it returns the destroyed object(s)... so you can keep them around, if need be.
  destroy: function() {
    var destroyed_objects = this.items();
    this.collection.db.remove(this.finder_object);
    return destroyed_objects;
  },
  
  remove: function() {
    return this.destroy();
  },
  
  find: function() {
    if(this.order_by_fields) this.collection.db.orderBy(this.order_by_fields)
    return this.collection.db.find(this.finder_object);
  },
  
  addFilter: function(object) {
    if(this.next_field) {
      var next_filter = this.finder_object[this.next_field];
      // Should allow 'ands' by extending existing field search, if it exists...
      if(next_filter) object = $.extend(object, next_filter)
      this.finder_object[this.next_field] = object;
      this.next_field = false;
    } 
    return this;
  }
  
});



Klass('DataFilter', (function(){
  
  var mappings = [
        ['equal',         ['eq', 'equal', 'equals']],
        ['startswith',    ['sw', 'startswith', 'starts_with', 'startsWith']],
        ['endswith',      ['ew', 'endswith', 'ends_with', 'endsWith']],
        ['greaterthan',   ['gt', 'greaterthan', 'greater_than', 'greaterThan']],
        ['lessthan',      ['lt', 'lessthan', 'less_than', 'lessThan']],
        ['has',           ['has', 'in', 'include', 'contains']],
        ['hasAll',        ['hasAll', 'has_all', 'includes_all', 'includesAll', 'contains_all', 'containsAll']],
        ['regexppass',    ['re', 'regexp', 'regExp']],
        ['like',          ['l', 'like']],
        ['notlike',       ['nl', 'notlike', 'not_like', 'notLike']],
        ['isSameObject',  ['is', 'issameobject', 'isSameObject', 'is_same_object']],
        ['isSameArray',   ['isa', 'issamearray', 'isSameObject', 'is_same_object']],
        ['length',        ['len', 'length']],

        ['isString',      ['isString']],
        ['isNumber',      ['isNumber']],
        ['isArray',       ['isArray']],
        ['isObject',      ['isObject']],
        ['isBoolean',     ['isBoolean']],
        ['isFunction',    ['isFunction']],
        ['isNull',        ['isNull']],
        ['isNumeric',     ['isNumeric']],
        ['isTAFFY',       ['isTAFFY']]
      ],
      df_methods = {
        init: function(finder) {
          this.finder = finder;
        }
      };
  
  $.each(mappings, function(i, map) {
    var filterName = map[0];
    $.each(map[1], function(i, methodName){
      df_methods[methodName] = new Function("value", "return this.finder.addFilter({ "+ filterName +":value });");
    });
  });
  
  return df_methods;
}));


