Screw.Unit(function() {
  describe("KVObject", function() {
    
    describe("Properties", function() {
      var o;
      before(function() {
        o = new KVObject();
      });
      
      it("should allow get access to values", function() {
        expect(o.get('name')).to(be_undefined);
      });
      
      it("should return a default value, if it's specified", function() {
        expect(o.get('name', 'mud')).to(equal, 'mud')
      });
      
      it("should allow values to be set", function() {
        o.set('name', 'bart')
        expect(o.get('name')).to(equal, 'bart');
        expect(o.get('name', 'mud')).to(equal, 'bart');
      });
    });
    
  });
  
  describe("KVCollection", function() {
    describe("Should mimic Array, where possible", function() {
      
      it("push()/pop()", function() {
        
        var col = new KVCollection();
        expect(col.arrangedObjects.length).to(equal, 0);

        col.push("One");
        
        expect(col.arrangedObjects.length).to(equal, 1);
        expect(col.get('length')).to(equal, 1);
        expect(col.length).to(equal, 1);

        var res = col.pop();
        
        expect(col.arrangedObjects.length).to(equal, 0);
        expect(col.get('length')).to(equal, 0);
        expect(col.length).to(equal, 0);
         expect(res).to(equal, "One");
        
      });
      
    });
  });
});
