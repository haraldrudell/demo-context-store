// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['Markdown'] = function Markdown(){
        return MarkdownClass;
    }
}
const { fontSizes, lineHeights } = require('style');
const Base = require('components/Base/Base');
const marked = require('marked');
const RE = require('./RegEx');
const serif = require('style').fonts.SERIF;

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    smartLists: true,
    smartypants: true
});

function setTargetWindow(targetWindow) {
    targetWindow = targetWindow ? targetWindow.toLowerCase() : null;
    let TARGET_TYPES = Markdown.prototype.TARGET_TYPES;
    switch (targetWindow) {
        case TARGET_TYPES.NEW:
            return '_blank';
        case TARGET_TYPES.SAME:
        case TARGET_TYPES.OVERLAY:
        default:
            return '_self';
    };
};

let isUrl = function (linkToTest) {
    return linkToTest.match(RE.matchUL);
};

let Markdown = function () { };

Markdown.prototype.TARGET_TYPES = { SAME: 'same', NEW: 'new', OVERLAY: 'overlay' };

/**
 *The function to escape html string
 **/
Markdown.prototype.sanitize = function (input) {
    return input
        .replace(RE.matchAmp, '&amp;')
        .replace(RE.matchLessThan, '&lt;')
        .replace(RE.matchMoreThan, '&gt;')
        .replace(RE.matchDoubleQuotes, '&quot;')
        .replace(RE.matchSingleQuote, '&#039;');
};

/**
 * The function to convert JIRA syntax to Markdown syntax
 **/
Markdown.prototype.jiraToMarkdown = function (str) {
    const { targetWindow } = this.props;
    return (str

        // Jira color to MD color
        .replace(RE.matchJiraColor,
        '<span style="color:$1">$2</span>')

        // Subnested OL
        .replace(RE.matchSubnestedOL, (match, nums) =>
            Array(nums.length).join('  ') + '1. '
        )

        // Subnested UL
        .replace(RE.matchSubnestedUL, (match, stars) =>
            Array(stars.length).join('    ') + '- '
        )

        // Ordered Lists
        .replace(RE.matchOL, (match, stars) =>
            Array(stars.length).join(' ') + '* '
        )

        // Un-ordered lists
        .replace(RE.matchUL, (match, nums) =>
            Array(nums.length).join(' ') + '1. '
        )

        // Headers 1-6
        .replace(RE.matchHeaders, (match, level, content) =>
            Array(parseInt(level) + 1).join('#') + content
        )

        // Bold
        .replace(RE.matchBold, '**$1**')

        // Italic
        .replace(RE.matchItalic, '$1*$2*')

        // Monospaced text
        .replace(RE.matchMonospacedText, '`$1`')

        // Inserts
        .replace(RE.matchInserts, '<ins>$1</ins>')

        // Superscript
        .replace(RE.matchSuperscript, '<sup>$1</sup>')

        // Subscript
        .replace(RE.matchSubscript, '<sub>$1</sub>')

        // Strikethrough
        .replace(RE.matchStrikeThrough, '~~$1~~')

        // Code Block
        .replace(RE.matchCodeBlock, '```$2$3```')

        // Pre-formatted text
        .replace(RE.matchPreFormatted, '```')

        // Un-named Links
        .replace(RE.matchUnnamedLinks, (match, link) =>
            isUrl(link) ?
                '<a href="' + link + '" target="' +
                setTargetWindow(targetWindow) + '">' + link + '</a>'
                : '<span>' + link + '</span>'
        )

        // Named Links
        .replace(RE.matchNamedLinks, (match, text, link) =>
            '<a href="' + link + '" target="' +
            setTargetWindow(targetWindow) + '">' + text + '</a>'
        )

        // Named Links With Color
        .replace(RE.matchNamedLinksWithColor, (match, text, link, color) =>
            '<a href="' + link + '" style="color:' + color + '" target="' +
            setTargetWindow(targetWindow) + '">' + text + '</a>'
        )

        // Single Paragraph Blockquote
        .replace(RE.matchSingleParagraphBlockquote, '> ')

        // Remove color: unsupported in md
        .replace(RE.matchColor, '$1')

        // panel into table
        .replace(RE.matchPanel,
        '\n| $1 |\n| --- |\n| $2 |')

        // table header
        .replace(RE.matchTableHeader, (match, headers) => {
            var singleBarred = headers.replace(/\|\|/g, '|');
            return '\n' + singleBarred + '\n' +
                singleBarred.replace(/\|[^|]+/g, '| --- ');
        })

        // Colored line break ruler
        .replace(RE.matchColoredHR, '<hr style="border:0; border-top:1px solid $1;">')

        // Line break ruler
        .replace(RE.matchHR, '<hr>')

        // remove leading-space of table headers and rows
        .replace(RE.matchLeadingSpace, '|'))

        // font styled text
        .replace(RE.matchSerif, (match, text) =>
                '<span style="font-family: ' + serif + ';">' + text + '</span>'
        )

        // font sized text
        .replace(RE.matchFontSized, (match, size, text) =>
                '<span style="font-size:' + size + ';">' + text + '</span>'
        );
};

Markdown.prototype.render = function () {
    const {
        content,
        targetWindow,
        modalComponentTemplate,
        anaNavPath,
        ...props
    } = this.props;

    let markedHtml = '';

    try {
        markedHtml = content ? marked(this.jiraToMarkdown(this.sanitize(content))) : '';
    } catch (e) {
        console.error('Error parsing Markdown Component - HTML Text | ' + e);
    };

    const styles = {
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: '1em',
            marginBottom: '.5em',
            lineHeight: lineHeights[2]
        },
        '& h1': { fontSize: fontSizes.h1 },
        '& h2': { fontSize: fontSizes.h2 },
        '& h3': { fontSize: fontSizes.h3 },
        '& h4': { fontSize: fontSizes.h4 },
        '& h5': { fontSize: fontSizes.h5 },
        '& h6': { fontSize: fontSizes.h6 },
        '& p, & ul, & ol': {
            marginTop: 0,
            marginBottom: '1em'
        },
        /* Flush list indentation */
        '& ul, & ol': {
            paddingLeft: 0,
            marginLeft: '1.25em'
        },
        /* No top margin on first element */
        '& > :first-child': {
            marginTop: 0
        },
        /* No bottom margin on last element */
        '& > :last-child': {
            marginBottom: 0
        },
        '& a': {
            color: 'inherit',
            textDecoration: 'none'
        }
    };

    return (
        <Base
            {...props}
            baseStyle={styles}
            onClick={e => this.handleClick(e)}
            dangerouslySetInnerHTML={{ __html: markedHtml }}>
        </Base>
    );
};


// Added by sephora-jsx-loader.js
Markdown.prototype.path = 'Markdown';
// Added by sephora-jsx-loader.js
Object.assign(Markdown.prototype, require('./Markdown.c.js'));
var originalDidMount = Markdown.prototype.componentDidMount;
Markdown.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Markdown');
if (originalDidMount) originalDidMount.apply(this);
if (Markdown.prototype.ctrlr) Markdown.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Markdown');
// Added by sephora-jsx-loader.js
Markdown.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Markdown.prototype.class = 'Markdown';
// Added by sephora-jsx-loader.js
Markdown.prototype.getInitialState = function() {
    Markdown.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Markdown.prototype.render = wrapComponentRender(Markdown.prototype.render);
// Added by sephora-jsx-loader.js
var MarkdownClass = React.createClass(Markdown.prototype);
// Added by sephora-jsx-loader.js
MarkdownClass.prototype.classRef = MarkdownClass;
// Added by sephora-jsx-loader.js
Object.assign(MarkdownClass, Markdown);
// Added by sephora-jsx-loader.js
module.exports = MarkdownClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Markdown/Markdown.jsx