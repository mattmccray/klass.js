
// FIXME: Credit orginator of the code I based this on... Need to find originator first, however.

// Module for title case constants/methods.
var TitleCase = {};

// Lists of specially handled words

// Words that should not be capitalized in the middle of a title.
TitleCase.SMALL_WORDS = [
    "a", "an", "and", "as", "at", "but", "by", "en", "for", "if", "in",
    "of", "on", "or", "the", "to", "v[.]?", "via", "vs[.]?"
];

// Words that should always appear in uppercase.
TitleCase.UPPERCASE_WORDS = [ "AT&T", "Q&A", "IBM" ];

// Pre-defined regular expressions

// Small word list in regular expression format.
TitleCase.SMALL_RE = TitleCase.SMALL_WORDS.join("|");
// Regular expression to use for splitting tokens in the input.
TitleCase.SPLIT_PATTERN = /([:.;?!][ ]|(?:[ ]|^)["â€œ])/;
// Regular expression to use for matching words to be capitalized.
TitleCase.BASE_PATTERN = /\b([A-Za-z][a-z.'â€™]*)\b/g;
// Regular expression to use for matching words with inline dots.
TitleCase.INLINE_DOT_PATTERN = /[A-Za-z][.][A-Za-z]/;
// Regular expression to use for matching small words.
TitleCase.SMALL_WORD_PATTERN = new RegExp('\\b(' + TitleCase.SMALL_RE + ')\\b', 'ig');
// Regular expression to use for matching small words at the beginning of the title.
TitleCase.SMALL_WORD_FIRST_PATTERN = new RegExp('^(\\W*)(' + TitleCase.SMALL_RE + ')\\b', 'ig');
// Regular expression to use for matching small words at the end of the title.
TitleCase.SMALL_WORD_LAST_PATTERN = new RegExp('\\b(' + TitleCase.SMALL_RE + ')(\\W*)$', 'ig');
//  Regular expression to use for matching "v." and "vs."
TitleCase.VS_PATTERN = / V(s?)\. /g;
//  Regular expression to use for matching apostrophe-S.
TitleCase.POSSESSIVE_PATTERN = /(['â€™])S\b/g;
// Regular expression to use for matching uppercase words.
TitleCase.UPPERCASE_PATTERN = new RegExp('\\b(' + TitleCase.UPPERCASE_WORDS.join("|") + ')\\b', 'ig');

// Helper methods

//  Capitalizes the first letter in the given string.
TitleCase.capitalize = function(w) {
    return w.substr(0, 1).toUpperCase() + w.substr(1).toLowerCase();
}
// Capitalizes the first letter in the given string, unless the string contains a dot in the middle of it.  This is used as a replacement function in the "toTitleCase" method.
TitleCase.capitalizeUnlessInlineDot = function(w) {
    if (TitleCase.INLINE_DOT_PATTERN.test(w)) return w;
    else return TitleCase.capitalize(w);
}
//  Capitalizes the given word, honoring any leading punctuation. This is used as a replacement function in the "toTitleCase" method.
TitleCase.capitalizeFirstWord = function(match, leadingPunctuation, smallWord) {
    return leadingPunctuation + TitleCase.capitalize(smallWord);
}
// Capitalizes the given word, honoring any trailing punctuation. This is used as a replacement function in the "toTitleCase" method.
TitleCase.capitalizeLastWord = function(match, smallWord, trailingPunctuation) {
    return TitleCase.capitalize(smallWord) + trailingPunctuation;
}
// Calls "toLowerCase" on the given string. This is used as a replacement function in the "toTitleCase" method.
TitleCase.toLowerCase = function(w) {
    return w.toLowerCase();
}

// Calls "toUpperCase" on the given string. This is used as a replacement function in the "toTitleCase" method.
TitleCase.toUpperCase = function(w) {
    return w.toUpperCase();
}

// Main title case method: Converts the words in the input string to Title Caps.
TitleCase.toTitleCase = function(input) {
    var result = "";

    var tokens = input.split(TitleCase.SPLIT_PATTERN);
    for (var i = 0; i < tokens.length; i++) {
        var s = tokens[i];
        // Capitalize all words except those with inline dots.
        s = s.replace(TitleCase.BASE_PATTERN,
                      TitleCase.capitalizeUnlessInlineDot);
        // Lowercase our list of small words.
        s = s.replace(TitleCase.SMALL_WORD_PATTERN,
                      TitleCase.toLowerCase);
        // If the first word in the title is a small word, capitalize it.
        s = s.replace(TitleCase.SMALL_WORD_FIRST_PATTERN,
                      TitleCase.capitalizeFirstWord);
        // If the last word in the title is a small word, capitalize it.
        s = s.replace(TitleCase.SMALL_WORD_LAST_PATTERN,
                      TitleCase.capitalizeLastWord);
        result += s;
    }
    // Handle special cases.
    result = result.replace(TitleCase.VS_PATTERN, ' v$1. ');
    result = result.replace(TitleCase.POSSESSIVE_PATTERN, '$1s');
    result = result.replace(TitleCase.UPPERCASE_PATTERN,
                            TitleCase.toUpperCase);
    return result;
}
