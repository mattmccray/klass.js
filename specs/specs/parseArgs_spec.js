Screw.Unit(function() {
  describe("parseArgs", function() {

    function test() {
      return parseArgs(
        {name:String},
        {name:String, age:Number},
        {name:String, age:Number, callback:Function},
        {name:String, age:Number, callback:Function, data:Object}
      );
    }

    var res1, res2, res3, res4;
    
    before(function() {
      res1 = test("Bart");
      res2 = test("Bart", 10);
      res3 = test("Bart", 10, function cb(){});
      res4 = test("Bart", 10, function cb(){}, { id:50 });
    });

    it("should parse the correct argument list", function() {
      expect(res1.matchedOn).to(equal, 0);
      expect(res2.matchedOn).to(equal, 1);
      expect(res3.matchedOn).to(equal, 2);
      expect(res4.matchedOn).to(equal, 3);
    });

    it("should matter what order the params are called in", function() {
      var res = test(10, "Bart");
      expect(res.matchedOn).to(equal, -1);
    });
    
    it("should assign the correct names to values", function() {

      expect(res1.name).to(equal, "Bart");
      
      expect(res2.name).to(equal, "Bart");
      expect(res2.age).to(equal, 10);
      
      expect(res3.name).to(equal, "Bart");
      expect(res3.age).to(equal, 10);
      expect(res3.callback.name).to(equal, "cb");

      expect(res4.name).to(equal, "Bart");
      expect(res4.age).to(equal, 10);
      expect(res4.callback.name).to(equal, "cb");
      expect(res4.data.id).to(equal, 50);
    });
  });
});
