import shallowEqual from './shallow-equal'

export default function(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
}



// WEBPACK FOOTER //
// ./app/utilities/shallow-compare.js