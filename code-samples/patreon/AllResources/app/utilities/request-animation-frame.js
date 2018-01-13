import { isClient } from 'shared/environment'

export default (function() {
    if (!isClient()) {
        return () => {}
    }
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestA9nimationFrame ||
        function(callback, element) {
            window.setTimeout(callback, 1000 / 60)
        }
    )
})()



// WEBPACK FOOTER //
// ./app/utilities/request-animation-frame.js