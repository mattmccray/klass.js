// Will work in Safari 3+ and Firefox 3+

var StyleMgr = (function(){
  
  var ruleCache = {};
  
  function iterateStylesFor(ruleName) {
    if(!document.styleSheets) return null;
    if(ruleCache[ruleCache]) return ruleCache[ruleName];
    
    var found_rule = null;
    for( var s=0; s<document.styleSheets.length; s++) {
      var rules = document.styleSheets[s].cssRules || document.styleSheets[s].rules;
      for (var r=0; r<rules.length; r++) {
        if(rules[r].selectorText == ruleName) { found_rule = rules[r]; break;}
      };
    }
    if(found_rule) {
      ruleCache[ruleName] = {
        ruleset:  found_rule,
        selector: found_rule.selectorText,
        style:    found_rule.style
      }
    }
    return ruleCache[ruleName] || null;
  }
  
  return {
    getRule: function(ruleName){
      return iterateStylesFor(ruleName);
    },
    clearCache: function() {
      ruleCache = {};
    }
  }
  
})();