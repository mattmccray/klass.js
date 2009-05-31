// TH.eventCountCache = {};
// TH.eventSubscriptions = [];
//     
// TH.countEvent = function (eventName) {
//     TH.Mock.eventCountCache[eventName] = 0;
//     TH.eventSubscriptions.push(MBX.EventHandler.subscribe([".mbx", MBX], eventName, function () {
//         TH.Mock.eventCountCache[eventName]++;
//     }));
// };

Screw.Matchers.be_near = {
     match: function(expected, actual) {
         if (!Object.isArray(expected)) {
             expected = [expected, 1];
         }
         return (actual < expected[0] + expected[1]) || (actual > expected[0] - expected[1]);
     },
     
     failure_message: function(expected, actual, not) {
       return 'expected ' + $.print(actual) + (not ? ' to not be within 1 of ' : ' to be within 1 of ') + expected;
     }
};

Screw.Unit(function() {
    before(function() {

    });
});
