Screw.Unit(function() {
  var bart;
  
  before(function() {
    bart = {
      name: 'Bart',
      age: 10
    }
  });
  
  after(function() {
    bart.unwatch('name')
    bart.unwatch('age')
    delete bart;
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
    
    it("should allow value manipulation in callback function", function() {
      bart.watch('age', function(a,b,c){ 
        return c * 2;
      })

      bart.age = 10;
      expect(bart.age).to_not(equal, 10)
      expect(bart.age).to(equal, 20);

      bart.age = 50;
      expect(bart.age).to(equal, 100);
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
