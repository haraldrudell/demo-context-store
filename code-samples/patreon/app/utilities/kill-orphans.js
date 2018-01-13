export default function(string, numberOfOrphans = 1) {
    for (let i = 0; i < numberOfOrphans; i++) {
        string = string.replace(/\u0020+([^\u0020]+)$/, '\u00A0$1')
    }
    return string
}



// WEBPACK FOOTER //
// ./app/utilities/kill-orphans.js