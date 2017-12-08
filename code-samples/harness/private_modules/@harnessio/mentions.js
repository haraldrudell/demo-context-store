"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caret_xy_1 = require("caret-xy");
var EventType = {
    MouseUp: 'mouseup',
    MouseDown: 'mousedown',
    KeyDown: 'keydown',
    Input: 'input',
    FocusOut: 'focusout'
};
var mentionsRegistry = {};
var body = document.body;
var MATCH = '__match__';
var isFirefox = /firefox/i.test(navigator.userAgent); // Firefox has issue with 'insertText' command
var MENTIONS_TAG = 'x-mentions';
var attrSelected = 'aria-selected';
var mentionsList = body.appendChild(document.createElement(MENTIONS_TAG));
var mentionsDefaults = {
    identifiersSet: /[A-Za-z0-9_.]/,
    trigger: ['$', '${'],
    rule: '${__match__}',
    data: function (done) { return done([]); },
    loadingHTML: '<span loading>Loading...</span>'
};
function debug() {
    if (localStorage.DEBUG_MENTIONS) {
        console.debug.apply(null, arguments);
    }
}
function register(type, info, options) {
    if (options === void 0) { options = {}; }
    if (type && type.length) {
        type.split(',').forEach(function (t) {
            t = t.trim();
            if (mentionsRegistry[t] && !options.override && !options.reuse) {
                return console.error('Mentions type [' + t + '] already registered. Unregister it first or passing options { override: true } or { reuse: true }');
            }
            if (!mentionsRegistry[t] || options.override) {
                var _info = Object.assign({}, info);
                _info.trigger = _info.trigger || mentionsDefaults.trigger;
                _info.rule = _info.rule || mentionsDefaults.rule;
                _info.cached = _info.cached || mentionsDefaults.cached;
                _info.data = _info.data || mentionsDefaults.data;
                _info.trigger = _info.trigger.sort(function (a, b) {
                    return a.length > b.length ? -1 : 1;
                });
                _info.triggerSet = new Set(_info.trigger.join(''));
                _info.matchingRulesLeftRight = _info.rule.split(MATCH);
                mentionsRegistry[t] = _info;
            }
        });
    }
}
exports.register = register;
function unregister(type) {
    delete mentionsRegistry[type];
}
exports.unregister = unregister;
function setDefaults(customDefaults) {
    Object.assign(mentionsDefaults, customDefaults);
}
exports.setDefaults = setDefaults;
function getTokens(value, atIndex, trigger, triggerSet, rule, matchingRulesLeftRight) {
    var valueLen = value.length;
    var triggerLen = trigger.length;
    var tokenIndex = atIndex;
    var tokenLen = 0;
    var token, word, wordLen, match = '';
    while (tokenIndex--) {
        var ch = value[tokenIndex];
        // If char is out of identifier and trigger ranges, exit loop
        if (!triggerSet.has(ch) && !mentionsDefaults.identifiersSet.test(ch)) {
            break;
        }
        var copiedStr = value.substr(tokenIndex, ++tokenLen);
        for (var i = 0; i < triggerLen; i++) {
            if (copiedStr.indexOf(trigger[i]) === 0) {
                token = copiedStr;
                break;
            }
        }
        if (token) {
            wordLen = tokenLen;
            var index = tokenIndex + wordLen;
            while (index < valueLen) {
                if (!mentionsDefaults.identifiersSet.test(value[index])) {
                    if (matchingRulesLeftRight.length === 2 &&
                        token.indexOf(matchingRulesLeftRight[0]) === 0 &&
                        value.indexOf(matchingRulesLeftRight[1], index) === index) {
                        wordLen += matchingRulesLeftRight[1].length;
                    }
                    break;
                }
                wordLen++;
                index++;
            }
            word = value.substr(tokenIndex, wordLen);
            for (var i = 0; i < triggerLen; i++) {
                if (word.indexOf(trigger[i]) === 0) {
                    match = token.substr(trigger[i].length);
                    break;
                }
            }
            break;
        }
    }
    return token ? { match: match, token: token, tokenIndex: tokenIndex, tokenLen: tokenLen, word: word, wordLen: wordLen } : {};
}
function escapeHTML(unsafe) {
    return unsafe.replace(/[&<>"'\/]/g, function (m) {
        switch (m) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case '\'':
                return '&#x27;';
            default:
                return '&#x2F;';
        }
    });
}
function escapeAndHighlightMatching(text, filterText) {
    if (filterText && text) {
        var index = text.toLowerCase().indexOf(filterText.toLowerCase());
        if (index !== -1) {
            return (escapeHTML(text.substring(0, index)) +
                '<mark>' +
                escapeHTML(text.substring(index, index + filterText.length)) +
                '</mark>' +
                escapeHTML(text.substring(index + filterText.length)));
        }
    }
    return escapeHTML(text);
}
var renderMatchesId;
function renderMatches(match, mentionsInfo) {
    var id = renderMatchesId = +new Date();
    // Show loading...
    mentionsList.innerHTML = mentionsDefaults.loadingHTML;
    var done = function (data) {
        var filteredData = data;
        match = match ? match.toLowerCase() : match;
        if (id === renderMatchesId && filteredData && filteredData.length) {
            // data is an array of [{ name, value }] pair or array of string ['..', '..']
            if (typeof filteredData[0] === 'string') {
                filteredData = filteredData.map(function (element) {
                    return { name: element, value: element };
                });
            }
            if (match) {
                filteredData = filteredData
                    .filter(function (element) {
                    return element.value.toLowerCase().indexOf(match) !== -1;
                })
                    .sort(function (a, b) {
                    var aIndex = a.value.toLowerCase().indexOf(match);
                    var bIndex = b.value.toLowerCase().indexOf(match);
                    return aIndex > bIndex ? 1 : (aIndex === bIndex ? (a > b ? 1 : -1) : -1);
                });
            }
            else {
                filteredData = filteredData.sort(function (a, b) {
                    return a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1;
                });
            }
            var html_1 = ['<ul>'];
            filteredData.forEach(function (pair, index) {
                var li = '<li ' +
                    (!index ? attrSelected : '') +
                    ' data-value="' +
                    escapeHTML(pair.value) +
                    '">' +
                    escapeAndHighlightMatching(pair.name, match) +
                    '</li>';
                html_1.push(li);
            });
            mentionsList.innerHTML = html_1.join('');
            if (mentionsInfo.cached) {
                mentionsInfo.cachedData = data;
            }
        }
        else {
            hideSuggestions();
        }
    };
    if (!mentionsInfo.cachedData) {
        mentionsInfo.data(done);
    }
    else {
        done(mentionsInfo.cachedData);
    }
}
function showSuggestions(mentionsType, mentionsInfo, key, target, match, token, tokenIndex, tokenLen, word, wordLen, caretIndex, caretCoordinates) {
    if (body.lastChild !== mentionsList) {
        body.appendChild(mentionsList); // move to the bottom to make sure no problem with z-index
    }
    if (target.activeMatch !== match) {
        target.activeMatch = match;
        renderMatches(match, mentionsInfo);
    }
    else if (!mentionsInfo.cachedData || !mentionsInfo.cachedData.length) {
        return hideSuggestions();
    }
    mentionsList.style.display = 'inline';
    mentionsList.scrollTop = 0;
    mentionsList.activeTargetInfo = {
        mentionsType: mentionsType,
        mentionsInfo: mentionsInfo,
        key: key,
        target: target,
        match: match,
        token: token,
        tokenIndex: tokenIndex,
        tokenLen: tokenLen,
        word: word,
        wordLen: wordLen,
        caretIndex: caretIndex,
        caretCoordinates: caretCoordinates
    };
    var caret = caret_xy_1.default(target);
    var targetRect = target.getBoundingClientRect();
    var listRect = mentionsList.getBoundingClientRect();
    var left = caret.left + listRect.width <= targetRect.right ? caret.left : targetRect.right - listRect.width;
    mentionsList.style.top = caret.top + caret.height + 'px';
    mentionsList.style.left = left + 'px';
    var selectedItem = mentionsList.querySelector("[" + attrSelected + "]");
    if (selectedItem) {
        selectedItem.removeAttribute(attrSelected);
    }
    selectedItem = mentionsList.firstElementChild.firstElementChild;
    if (selectedItem) {
        selectedItem.setAttribute(attrSelected, '');
    }
    // @ts-ignore
    debug('mentions:', { key: key, match: match, token: token, tokenIndex: tokenIndex, tokenLen: tokenLen, word: word, wordLen: wordLen });
}
function hideSuggestions() {
    mentionsList.style.display = 'none';
}
var selectingValue;
function selectValue(e, value) {
    var targetInfo = mentionsList.activeTargetInfo;
    var target = targetInfo.target;
    var targetValue = targetInfo.target.value;
    var replacement = targetInfo.mentionsInfo.rule.replace(MATCH, value);
    // @ts-ignore
    debug('mentions: Select value:', value, targetInfo);
    selectingValue = true; // prevent `input` event during setting new value
    hideSuggestions();
    // Firefox does not support 'insertText' (https://bugzilla.mozilla.org/show_bug.cgi?id=1220696)
    // Firefox will not have a clean undo/redo history like other browsers
    if (isFirefox) {
        var newValue = targetValue.substr(0, targetInfo.tokenIndex) + replacement + targetValue.substr(targetInfo.tokenIndex + targetInfo.wordLen);
        var newCaretPos = targetInfo.tokenIndex + replacement.length;
        target.value = newValue;
        target.focus();
        target.setSelectionRange(newCaretPos, newCaretPos);
    }
    else {
        target.focus();
        target.setSelectionRange(targetInfo.tokenIndex, targetInfo.tokenIndex + targetInfo.wordLen);
        document.execCommand('insertText', false, replacement);
    }
    selectingValue = false;
}
function hasParentWithNodeName(element, parentNodeName) {
    var parentNode = element.parentNode;
    return parentNode
        ? parentNode.nodeName.toLowerCase() === parentNodeName ? true : hasParentWithNodeName(parentNode, parentNodeName)
        : false;
}
/**
 * Get selected value from suggestion list.
 * @param {HTMLElement} node - Target node.
 * @returns {string} Value extracted from li[data-value].
 */
function getSelectedValue(node) {
    if (node && node.nodeName && node.nodeName.toLowerCase() !== 'li') {
        return getSelectedValue(node.parentElement);
    }
    return node && node.dataset && node.dataset.value;
}
function handler(e) {
    var target = e.target;
    var nodeName = target.nodeName.toLowerCase();
    var eventType = e.type && e.type.toLowerCase();
    var key = e.key;
    if (nodeName === 'input' || nodeName === 'textarea') {
        var mentionsType = target.dataset.mentions;
        if (!mentionsType || !mentionsType.length || !mentionsRegistry[mentionsType]) {
            if (target.hasAttribute('data-mentions') && !mentionsRegistry[mentionsType]) {
                console.warn('Mentions: type [' + mentionsType + '] is not registered.');
            }
            return;
        }
        if (!target.mentionsInfo) {
            target.mentionsInfo = mentionsRegistry[mentionsType];
        }
        var mentionsInfo = target.mentionsInfo;
        var selectionStart = target.selectionStart;
        var selectionEnd = target.selectionEnd;
        if (selectionStart !== selectionEnd) {
            return hideSuggestions();
        }
        var _a = getTokens(target.value, selectionStart, mentionsInfo.trigger, mentionsInfo.triggerSet, mentionsInfo.rule, mentionsInfo.matchingRulesLeftRight), match = _a.match, token = _a.token, tokenIndex = _a.tokenIndex, tokenLen = _a.tokenLen, word = _a.word, wordLen = _a.wordLen;
        // @ts-ignore
        debug('mentions:', { value: target.value, match: match, token: token, tokenIndex: tokenIndex, tokenLen: tokenLen, word: word, wordLen: wordLen });
        if (token) {
            return showSuggestions(mentionsType, mentionsInfo, key, target, match, token, tokenIndex, tokenLen, word, wordLen, selectionStart, caret_xy_1.default(target));
        }
        else {
            return hideSuggestions();
        }
    }
}
function preventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
}
function isNodeHiddenInsideParent(node, parent) {
    var childRect = node.getBoundingClientRect();
    var parentRect = parent.getBoundingClientRect();
    return !(childRect.top >= parentRect.top && childRect.bottom <= parentRect.bottom);
}
function scrollToElement(element, parent, direction) {
    var elementRect = element.getBoundingClientRect();
    var parentRect = parent.getBoundingClientRect();
    if (direction === 'down') {
        parent.scrollTop = parent.scrollTop + elementRect.top - parentRect.top;
    }
    else {
        parent.scrollTop -= parentRect.height - elementRect.height;
    }
}
var scheduler = function (e) {
    var target = e.target;
    var eventType = e.type && e.type.toLowerCase();
    var nodeName = target.nodeName && target.nodeName.toLowerCase();
    var key = e.key;
    var isShown = mentionsList.style.display !== 'none';
    // @ts-ignore
    debug('mentions scheduler:', { eventType: eventType, key: key, isShown: isShown, e: e });
    // Click on an item in suggestion list: select the item value
    if (eventType === EventType.MouseDown) {
        if (isShown) {
            if (hasParentWithNodeName(target, MENTIONS_TAG)) {
                selectValue(e, getSelectedValue(target));
                return preventDefault(e);
            }
            if (!((nodeName === 'input' || nodeName === 'textarea') && target.dataset.mentions)) {
                return hideSuggestions();
            }
        }
        return; // no more processing for mousedown event
    }
    if (eventType === EventType.KeyDown) {
        if (isShown) {
            var selectedItem = mentionsList.querySelector("[" + attrSelected + "]");
            switch (key) {
                case 'ArrowDown':
                    selectedItem.removeAttribute(attrSelected);
                    if (selectedItem.nextElementSibling) {
                        selectedItem.nextElementSibling.setAttribute(attrSelected, '');
                        if (isNodeHiddenInsideParent(selectedItem.nextElementSibling, mentionsList)) {
                            scrollToElement(selectedItem.nextElementSibling, mentionsList, 'down');
                        }
                    }
                    else {
                        mentionsList.firstElementChild.firstElementChild.setAttribute(attrSelected, '');
                        mentionsList.scrollTop = 0;
                    }
                    return preventDefault(e);
                case 'ArrowUp':
                    selectedItem.removeAttribute(attrSelected);
                    if (selectedItem.previousElementSibling) {
                        selectedItem.previousElementSibling.setAttribute(attrSelected, '');
                        if (isNodeHiddenInsideParent(selectedItem.previousElementSibling, mentionsList)) {
                            scrollToElement(selectedItem.previousElementSibling, mentionsList, 'up');
                        }
                    }
                    else {
                        var element = mentionsList.firstElementChild.lastElementChild;
                        element.setAttribute(attrSelected, '');
                        scrollToElement(element, mentionsList, 'down');
                    }
                    return preventDefault(e);
                case 'Enter':
                case 'Tab':
                    selectValue(e, getSelectedValue(selectedItem));
                    return preventDefault(e);
                case 'Escape':
                    hideSuggestions();
                    return preventDefault(e);
            }
        }
        switch (key) {
            case 'Shift':
            case 'Meta':
            case 'Control':
                return;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'Home':
            case 'End':
            case 'PageUp':
            case 'PageDown':
                return setTimeout(function () { return handler(e); }, 20);
        }
    }
    else if (eventType !== EventType.Input) {
        return setTimeout(function () { return handler(e); }, 20);
    }
    else if (!selectingValue) {
        handler(e);
    }
    else {
        // @ts-ignore
        debug('mentions: Ignore event', { eventType: eventType, key: key, isShown: isShown, e: e });
    }
};
document.addEventListener(EventType.KeyDown, scheduler);
document.addEventListener(EventType.Input, scheduler);
document.addEventListener(EventType.MouseUp, scheduler);
document.addEventListener(EventType.MouseDown, scheduler);
document.addEventListener(EventType.FocusOut, function (e) {
    var isShown = mentionsList.style.display !== 'none';
    if (isShown) {
        hideSuggestions();
    }
});
//# sourceMappingURL=mentions.js.map


//////////////////
// WEBPACK FOOTER
// ../~/@harnessio/mentions/dist/mentions.js
// module id = 1033
// module chunks = 0