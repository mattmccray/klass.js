Screw.Unit(function() {
  var bart, lisa;
  
  before(function() {
    bart = {
      name: 'Bart',
      age: 10
    }
    lisa = {
      name: 'List',
      age: 8
    }
  });
  
  after(function() {
    delete bart;
    delete lisa;
    
  });
  
  describe("watch", function() {
    
    it("should get a callback when a watched property changes", function() {
      var notificationCount = 0;
      
      bart.watch('name', function(a,b,c){ notificationCount+=1; return c; })
      
      bart.name = 'Bart Simpson';
      expect(notificationCount).to(equal, 1);

      bart.name = 'Bart';
      expect(notificationCount).to(equal, 2);

      bart.name = 'Bart';
      expect(notificationCount).to(equal, 3);
    });
    
  });
  
  describe("unwatch", function() {
    
    it("should stop getting callback when a watched property is unwatched", function() {
      var notificationCount = 0;
      
      bart.watch('name', function(a,b,c){ notificationCount+=1; return c; })
      
      bart.name = 'Bart Simpson';
      expect(notificationCount).to(equal, 1);
      
      bart.unwatch('name');

      bart.name = 'Bart';
      expect(notificationCount).to(equal, 1);

      bart.name = 'Bart';
      expect(notificationCount).to(equal, 1);
    });
    
  });
});
