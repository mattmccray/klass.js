//=require "inflector"
//=require "title-case"


String.prototype.ordinalize = function() {
  return Inflector.ordinalize(this);
}

String.prototype.singularize = function() {
  return Inflector.singularize(this);
}

String.prototype.pluralize = function() {
  return Inflector.pluralize(this);
}

String.prototype.upcase = function() {
  return this.toUpperCase();
}
String.prototype.downcase = function() {
  return this.toLowerCase();
}
String.prototype.strip = function() {
  return this.replace(/^\s+/, '').replace(/\s+$/, '');
}
String.prototype.toInteger = function() {
  return parseInt(this);
}

String.prototype.toSlug = function() {
  // M@: Modified from Radiant's version, removes multple --'s next to each other
  // This is the same RegExp as the one on the page model...
  return this.strip().downcase().replace(/[^-a-z0-9~\s\.:;+=_]/g, '').replace(/[\s\.:;=_+]+/g, '-').replace(/[\-]{2,}/g, '-');
}

String.prototype.stripHTML = function() {
  return this.toString().replace(/(<([^>]+)>)/ig,"");
}

// Add the title case method to all String objects.
String.prototype.toTitleCase = function() {
    return TitleCase.toTitleCase(this);
}