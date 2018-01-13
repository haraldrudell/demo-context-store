import { injectGlobal } from 'styled-components'

injectGlobal`
.userMenu-enter {
    opacity: 0.01;
}

.userMenu-enter-active {
    opacity: 1;
    transition: opacity 70ms ease-out;
}

.userMenu-exit {
    opacity: 1;
}

.userMenu-exit-active {
    opacity: 0.01;
    transition: opacity 70ms ease-out;
}
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/UserMenu/styles.js