
describe('Klass', function() {

  describe("Constructor", function() {
    
    it("should be defined", function () {
      expect(Klass).to_not(be_undefined);
    });

    it("should create named classes", function () {
      Klass('User', {

      });

      expect(User).to_not(be_undefined);
      expect(User.displayName).to(equal, "User");
      
      var u = new User();
      expect(u.klass).to(equal, User);
      //delete User;
    });

    it("should create anonymous classes (without accurate displayName)", function() {
      var Action = Klass({
        init: function() {}
      });
      expect(Action).to_not(be_undefined)
      expect(Action.displayName).to(equal, "[AnonymousKlass]")

      var a = new Action();
      expect(a.klass).to(equal, Action);
      expect(a.klass.displayName).to(equal, "[AnonymousKlass]")
      //delete Action
    });
  });

  describe("Classes", function() {

    it("should define static method", function() {
      Klass( 'Data', {
        klass: {
          find: function() {
            return 'found!';
          }
        }
      });
      expect(Data.find).to_not(be_undefined)
      expect(Data.find()).to(equal, "found!")

      //delete Data
    });

    it("should inherit static methods", function() {
      Klass( 'AR', {
        klass: {
          find: function() {
            return "find for "+ this.displayName;
          }
        }
      })
      AR( 'User', {})

      expect(AR.find()).to(equal, 'find for AR');
      expect(User.find()).to(equal, 'find for User');

      //delete AR
      //delete User
    });

// NOT ANYMORE
/*
    it("should allow calls to superclass static methods", function() {
      Klass( 'Parent', {
        klass: {
          sayIt: function() {
            return 'from parent'
          }
        }
      })
      Parent( 'Child', {
        klass: {
          sayIt: function() {
            return "from child, then "+ this.callSuper('sayIt');
          }
        }
      });

      expect(Child.sayIt()).to(equal, "from child, then from parent");

      //delete Parent
      //delete Child
    });
*/
  });

  describe("Instances", function() {
    
  
    it("should contain methods", function() {
      Klass( 'Car', {
        start: function() {
          return 'now running';
        }
      })
      var c = new Car()
      expect(typeof c.start).to(equal, 'function');
      expect(c.start()).to(equal, 'now running');
      //delete Car
    });

    it("should inherit methods", function() {
      Klass( 'Car', {
        start: function() {
          return this.klass.displayName +" is running";
        }
      })
      Car( 'Truck', {
        stop: function() {
          return 'stopped';
        }
      });
      var c = new Car();
      var t = new Truck();
      expect(c.start()).to(equal, 'Car is running');
      expect(t.start()).to(equal, 'Truck is running');
      expect(t.stop()).to(equal, 'stopped');

      //delete c
      //delete t
    });
    
    it("should inherit methods (Anonymous)", function() {
      var Car = Klass({
        start: function() {
          return this.klass.displayName +" is running";
        }
      })
      var Truck = Car.subKlass({
        stop: function() {
          return "stopped";
        }
      });
      expect(Car).to_not(be_undefined);
      expect(Truck).to_not(be_undefined);
      var c = new Car();
      var t = new Truck();
      expect(c.start()).to(equal, '[AnonymousKlass] is running');
      expect(t.start()).to(equal, '[AnonymousSubKlass] is running');
      expect(t.stop()).to(equal, 'stopped');
      
      //delete c
      //delete t
    });


    it("should allow calls to superclass methods", function() {
      Klass( 'Person', {
        title: function() {
          return 'Buffoon';
        }
      });
      
      Person.subKlass( 'Sith', {
        title: function() {
          return "Darth "+ this.callSuper('title');
        }
      });

      var u = new Person();
      var s = new Sith();
      expect(u.title()).to(equal, 'Buffoon');
      expect(s.title()).to(equal, 'Darth Buffoon');
      //delete Person
      //delete Sith
    });

    it("should encapsulate method calls", function() {
      Klass( 'User', {
        init: function(name) {
          this.name = name;
        },
        speak: function(quote) {
          return this.name +" said: "+ quote;
        }
      })

      var u = new User('M@');

      expect(u.speak('I need money')).to(equal, "M@ said: I need money");

      var speak = u.method('speak');
      expect(speak('Read ZooDotCom.com')).to(equal, 'M@ said: Read ZooDotCom.com');

      var speakWithQuote = u.method('speak', "I already said that")
      expect(speakWithQuote()).to(equal, "M@ said: I already said that");

      //delete User
    });
    
    it("should contain a reference to their constructing Klass", function() {
      Klass('Car', {
        
      })
      var c = new Car();
      expect(c.klass).to(equal, Car);
      expect(c.klass.displayName).to(equal, 'Car')
      var c2 = new c.klass();
      expect(c2.klass == Car).to(equal, true)
      //delete Car
    });
    
  });

});
