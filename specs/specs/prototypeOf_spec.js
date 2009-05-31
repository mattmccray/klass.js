Screw.Unit(function() {
  describe("prototypeOf", function() {
    
    describe("getPrototypeOf", function() {
      it("should return the prototype object", function() {
        function parent() {}
        function child() {}
        var pi = new parent(), ci = new child();
        child.prototype = pi;
        expect( Object.getPrototypeOf(ci) ).to(equal, pi);
        
      });
    });
    
    describe("setPrototypeOf", function() {
      it("should set the prototype object", function() {
        function parent(){}
        parent.prototype.test = function(){ return 'OK'; }
        function child(){}
        var pi = new parent(), ci = new child();
        Object.setPrototypeOf(ci, pi);
        expect(Object.getPrototypeOf(ci)).to(equal, pi);
        expect(ci.test()).to(equal, 'OK');
      });
    });
    
  });
});
