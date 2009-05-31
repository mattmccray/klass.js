Screw.Unit(function() {
  describe("dateUtils", function() {
    var feb0209 = new Date( Date.UTC(2009,1,1,3,0,0,0) );
    var mar0209 = new Date( Date.UTC(2009,2,1,3,0,0,0) );
    
    describe("For Feb 1st, 2009 strftime results should match:", function() {

      it("%m/%d/%Y to 02/01/2009", function(){
        expect(feb0209.strftime('%m/%d/%Y')).to(equal, '02/01/2009');
      });
      
      var defToS = feb0209.toString(),
      formats = [
        ['%a', 'Sun',       "Short day"],
        ['%A', 'Sunday',    "Long day"],
        ['%b', 'Feb',       "Short month"],
        ['%B', 'February',  "Month"],
        ['%c', defToS,      "Locale date from native Date object"],
        ['%d', '01',        "Date"],
        ['%e', ' 1',        "Short date"],
        ['%H', '03',        "24 Hour"],
        ['%i', '3',         "Short hour"],
        ['%I', '03',        "Hour"],
        ['%m', '02',        "Month"],
        ['%M', '00',        "Minute"],
        ['%p', 'AM',        "AM/PM"],
        ['%S', '00',        "Second"],
        ['%w', '0',         "Weekday"],
        ['%y', '09',        "Short year"],
        ['%Y', '2009',      "Year"]
      ];

      $(formats).each(function(arr, format){
        it( format[0] +" to "+ format[1] +" - ("+ format[2]+")", function() {
          expect(feb0209.strftime(format[0])).to(equal, format[1]);
        });
      })

    });
    
    describe("toRelativeTime", function() {
      it("should support relative times between two dates", function(){
         expect(feb0209.toRelativeTime(mar0209)).to(equal, '28 days ago');
         // Need to test other date times...
      });
    });
  });
});
