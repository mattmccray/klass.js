// Underscore.js
// (c) 2009 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the terms of the MIT license.
// Portions of Underscore are inspired by or borrowed from Prototype.js,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore/
(function(){var j=this,m=j._;function i(a){this._wrapped=a}var l=typeof StopIteration!=="undefined"?StopIteration:"__break__",b=j._=function(a){return new i(a)};if(typeof exports!=="undefined")exports._=b;b.VERSION="0.4.5";b.each=function(a,c,d){try{if(a.forEach)a.forEach(c,d);else if(a.length)for(var e=0,f=a.length;e<f;e++)c.call(d,a[e],e,a);else for(e in a)Object.prototype.hasOwnProperty.call(a,e)&&c.call(d,a[e],e,a)}catch(g){if(g!=l)throw g;}return a};b.map=function(a,c,d){if(a&&a.map)return a.map(c,
d);var e=[];b.each(a,function(f,g,h){e.push(c.call(d,f,g,h))});return e};b.reduce=function(a,c,d,e){if(a&&a.reduce)return a.reduce(b.bind(d,e),c);b.each(a,function(f,g,h){c=d.call(e,c,f,g,h)});return c};b.reduceRight=function(a,c,d,e){if(a&&a.reduceRight)return a.reduceRight(b.bind(d,e),c);var f=b.clone(b.toArray(a)).reverse();b.each(f,function(g,h){c=d.call(e,c,g,h,a)});return c};b.detect=function(a,c,d){var e;b.each(a,function(f,g,h){if(c.call(d,f,g,h)){e=f;b.breakLoop()}});return e};b.select=function(a,
c,d){if(a.filter)return a.filter(c,d);var e=[];b.each(a,function(f,g,h){c.call(d,f,g,h)&&e.push(f)});return e};b.reject=function(a,c,d){var e=[];b.each(a,function(f,g,h){!c.call(d,f,g,h)&&e.push(f)});return e};b.all=function(a,c,d){c=c||b.identity;if(a.every)return a.every(c,d);var e=true;b.each(a,function(f,g,h){(e=e&&c.call(d,f,g,h))||b.breakLoop()});return e};b.any=function(a,c,d){c=c||b.identity;if(a.some)return a.some(c,d);var e=false;b.each(a,function(f,g,h){if(e=c.call(d,f,g,h))b.breakLoop()});
return e};b.include=function(a,c){if(b.isArray(a))return b.indexOf(a,c)!=-1;var d=false;b.each(a,function(e){if(d=e===c)b.breakLoop()});return d};b.invoke=function(a,c){var d=b.rest(arguments,2);return b.map(a,function(e){return(c?e[c]:e).apply(e,d)})};b.pluck=function(a,c){return b.map(a,function(d){return d[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};b.each(a,function(f,g,h){g=c?c.call(d,f,g,h):f;g>=e.computed&&(e={value:f,computed:g})});
return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};b.each(a,function(f,g,h){g=c?c.call(d,f,g,h):f;g<e.computed&&(e={value:f,computed:g})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(e,f,g){return{value:e,criteria:c.call(d,e,f,g)}}).sort(function(e,f){e=e.criteria;f=f.criteria;return e<f?-1:e>f?1:0}),"value")};b.sortedIndex=function(a,c,d){d=d||b.identity;for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?
(e=g+1):(f=g)}return e};b.toArray=function(a){if(!a)return[];if(b.isArray(a))return a;return b.map(a,function(c){return c})};b.size=function(a){return b.toArray(a).length};b.first=function(a,c){return c?Array.prototype.slice.call(a,0,c):a[0]};b.rest=function(a,c){return Array.prototype.slice.call(a,b.isUndefined(c)?1:c)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.select(a,function(c){return!!c})};b.flatten=function(a){return b.reduce(a,[],function(c,d){if(b.isArray(d))return c.concat(b.flatten(d));
c.push(d);return c})};b.without=function(a){var c=b.rest(arguments);return b.select(a,function(d){return!b.include(c,d)})};b.uniq=function(a,c){return b.reduce(a,[],function(d,e,f){if(0==f||(c?b.last(d)!=e:!b.include(d,e)))d.push(e);return d})};b.intersect=function(a){var c=b.rest(arguments);return b.select(b.uniq(a),function(d){return b.all(c,function(e){return b.indexOf(e,d)>=0})})};b.zip=function(){for(var a=b.toArray(arguments),c=b.max(b.pluck(a,"length")),d=new Array(c),e=0;e<c;e++)d[e]=b.pluck(a,
String(e));return d};b.indexOf=function(a,c){if(a.indexOf)return a.indexOf(c);for(var d=0,e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,c){if(a.lastIndexOf)return a.lastIndexOf(c);for(var d=a.length;d--;)if(a[d]===c)return d;return-1};b.bind=function(a,c){var d=b.rest(arguments,2);return function(){return a.apply(c||j,d.concat(b.toArray(arguments)))}};b.bindAll=function(){var a=Array.prototype.pop.call(arguments);b.each(arguments,function(c){a[c]=b.bind(a[c],a)})};b.delay=
function(a,c){var d=b.rest(arguments,2);return setTimeout(function(){return a.apply(a,d)},c)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(b.rest(arguments)))};b.wrap=function(a,c){return function(){var d=[a].concat(b.toArray(arguments));return c.apply(c,d)}};b.compose=function(){var a=b.toArray(arguments);return function(){for(var c=a.length-1;c>=0;c--)arguments=[a[c].apply(this,arguments)];return arguments[0]}};b.keys=function(a){return b.map(a,function(c,d){return d})};b.values=function(a){return b.map(a,
b.identity)};b.extend=function(a,c){for(var d in c)a[d]=c[d];return a};b.clone=function(a){if(b.isArray(a))return a.slice(0);return b.extend({},a)};b.isEqual=function(a,c){if(a===c)return true;var d=typeof a,e=typeof c;if(d!=e)return false;if(a==c)return true;if(a.isEqual)return a.isEqual(c);if(b.isNumber(a)&&b.isNumber(c)&&isNaN(a)&&isNaN(c))return true;if(d!=="object")return false;d=b.keys(a);e=b.keys(c);if(d.length!=e.length)return false;for(var f in a)if(!b.isEqual(a[f],c[f]))return false;return true};
b.isEmpty=function(a){return(b.isArray(a)?a:b.values(a)).length==0};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=function(a){return Object.prototype.toString.call(a)=="[object Array]"};b.isFunction=function(a){return Object.prototype.toString.call(a)=="[object Function]"};b.isString=function(a){return Object.prototype.toString.call(a)=="[object String]"};b.isNumber=function(a){return Object.prototype.toString.call(a)=="[object Number]"};b.isUndefined=function(a){return typeof a==
"undefined"};b.noConflict=function(){j._=m;return this};b.identity=function(a){return a};b.breakLoop=function(){throw l;};var n=0;b.uniqueId=function(a){var c=n++;return a?a+c:c};b.functions=function(){var a=[];for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&a.push(c);return b.without(a,"VERSION","prototype","noConflict").sort()};b.template=function(a,c){a=new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+a.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,
"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return c?a(c):a};b.forEach=b.each;b.foldl=b.inject=b.reduce;b.foldr=b.reduceRight;b.filter=b.select;b.every=b.all;b.some=b.any;b.head=b.first;b.tail=b.rest;b.methods=b.functions;function k(a,c){return c?b(a).chain():a}b.each(b.functions(),function(a){i.prototype[a]=function(){Array.prototype.unshift.call(arguments,this._wrapped);return k(b[a].apply(b,arguments),
this._chain)}});b.each(["pop","push","reverse","shift","sort","splice","unshift"],function(a){i.prototype[a]=function(){Array.prototype[a].apply(this._wrapped,arguments);return k(this._wrapped,this._chain)}});b.each(["concat","join","slice"],function(a){i.prototype[a]=function(){return k(Array.prototype[a].apply(this._wrapped,arguments),this._chain)}});i.prototype.chain=function(){this._chain=true;return this};i.prototype.value=function(){return this._wrapped}})();
/*
Copyright (c) 2009 Jeremy Ashkenas, DocumentCloud
 
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/