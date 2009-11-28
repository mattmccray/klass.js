Screw.Unit(function() {
  describe("typeOf", function() {

    it("should correctly report objects", function() {
      var toObj = typeOf({});
      expect(toObj).to(equal, "object");
    });

    it("should correctly report arrays", function() {
      var toArr = typeOf([]);
      expect(toArr).to(equal, "array");
    });
    
    it("should correctly report regular expressions", function() {
      var toRE = typeOf(/test/);
      expect(toRE).to(equal, 'regexp');
    });

    it("should correctly report dates", function() {
      var toDte = typeOf((new Date));
      expect(toDte).to(equal, "date");
    });

    it("should correctly report functions", function() {
      var toFn = typeOf(function b(){});
      expect(toFn).to(equal, "function");
    });

    it("should correctly report numbers", function() {
      var toNum = typeOf(10);
      expect(toNum).to(equal, "number");
    });

    it("should correctly report strings", function() {
      var toStr = typeOf("");
      expect(toStr).to(equal, "string");
    });

    it("should correctly report booleans", function() {
      var toBool = typeOf(true);
      expect(toBool).to(equal, "boolean");
    });

    it("should correctly report nulls", function() {
      var toNull = typeOf(null);
      expect(toNull).to(equal, "null");
    });

    it("should correctly report undefined", function() {
      var toUdef = typeOf(this['crap']);
      expect(toUdef).to(equal, "undefined");
    });

  });
});

