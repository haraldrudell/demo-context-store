import { injectGlobal } from 'styled-components'

injectGlobal`
.searchResults-enter {
    opacity: 0.01;
}

.searchResults-enter-active {
    opacity: 1;
    transition: opacity 70ms ease-out;
}

.searchResults-exit {
    opacity: 1;
}

.searchResults-exit-active {
    opacity: 0.01;
    transition: opacity 70ms ease-out;
}
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/SearchResults/styles.js