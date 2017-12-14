//jscs: disable maximumLineLength

// Markdown syntax guide
//https://jira.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Markdown+Syntax+Guide

module.exports = {
    matchAmp: /&/g,
    matchLessThan: /</g,
    matchMoreThan: />/g,
    matchDoubleQuotes: /"/g,
    matchSingleQuote: /'/g,
    matchUrl: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i,
    matchJiraColor: /\{color:([^}]+)\}([^]*)\{color\}/gm,
    matchSubnestedOL: /^[ \t]*(\*\#+)\s+/gm,
    matchSubnestedUL: /^[ \t]*(\#\*+)\s+/gm,
    matchOL: /^[ \t]*(\*+)\s+/gm,
    matchUL: /^[ \t]*(#+)\s+/gm,

    // Headers 1-6
    matchHeaders: /^h([0-6])\.(.*)$/gm,
    matchBold: /\*(\S.*)\*/g,
    matchItalic: /([\n\r\s]+)\_(\S.*)\_/g,
    matchMonospacedText: /\{\{([^}]+)\}\}/g,
    matchInserts: /\+([^+]*)\+/g,
    matchSuperscript: /\^([^^]*)\^/g,
    matchSubscript: /~([^~]*)~/g,
    matchStrikeThrough: /[\n\r\s]+-(\S+.*?\S)-/g,
    matchCodeBlock: /\{code(:([a-z]+))?\}([^]*)\{code\}/gm,
    matchPreFormatted: /{noformat}/g,
    matchUnnamedLinks: /\[([^|]+)\]/g,
    matchNamedLinks: /\[([^|]+?)\|([^\]|]+)]/g,
    matchNamedLinksWithColor: /\[([^|]+?)\|([^\]|]+)\|color=([^\]|]+)]/g,
    matchSingleParagraphBlockquote: /^bq\.\s+/gm,
    matchColor: /\{color:[^}]+\}([^]*)\{color\}/gm,
    matchPanel: /\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm,
    matchTableHeader: /^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm,
    matchHR: /{hr}/g,
    matchColoredHR: /{hr:([^}]+)\}/g,
    /**
     * match leading-space of table headers and rows
     **/
    matchLeadingSpace: /^[ \t]*\|/gm,
    matchSerif: /\{serif}([^]*)\{serif\}/g,
    matchFontSized: /\{font-size:(.+?)\}([^]*)\{font-size\}/g,
};



// WEBPACK FOOTER //
// ./public_ufe/js/components/Markdown/RegEx.js