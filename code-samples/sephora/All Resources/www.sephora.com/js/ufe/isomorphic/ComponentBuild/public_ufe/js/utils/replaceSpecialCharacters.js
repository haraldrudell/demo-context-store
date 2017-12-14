/**
 * Replaces unwanted special characters
 * @param  {string} string - The string containing characters that need to be removed.
 * @return {string} - The string with each found special character replaced with its
 * normal equivalent.
 */
module.exports = function (string) {
    var charMatrix = { ô: 'o', '&#244;': 'o', è: 'e', é: 'e', '&#200;': 'e', 'È': 'e',
        '&#233': 'e', '&#201;': 'e', à: 'a', '®': '', '&#174;': '', '™': '', '&#153;': '',
        '&#8482': '', '&#192;': 'a', '&#236;': 'i', '&#238;': 'i', '&#212;': 'o',
        '&#232;': 'e', "'": '', ampersand: ' & ' };

    string = (string || '');

    var re = new RegExp(Object.keys(charMatrix).join('|'), 'gi');
    string = string.replace(re, function (matched) {
        return charMatrix[matched];
    });

    return string.toLowerCase();
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/replaceSpecialCharacters.js