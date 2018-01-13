import { injectGlobal } from 'styled-components'

injectGlobal`
.mobileNavbar-enter {
    height: 0;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
}

.mobileNavbar-enter-active {
    height: 100%;
}

.mobileNavbar-exit {
    height: 100%;
    transition: all 0.8s ease-in;
}

.mobileNavbar-exit-active {
    height: 0;
    overflow: hidden;
}

.mobileNavbar-exit-active form {
    opacity: 0;
}
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/MobileNavbar/styles.js