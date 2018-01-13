import access from 'safe-access'

/* converts ['flag_name_a', 'flag_name_b'] to object like
   {FLAG_NAME_A: 'FLAG_NAME_A', FLAG_NAME_B: 'FLAB_NAME_B'} for more convenient lookups */

export default function getActiveFeatureFlags(document) {
    const el = document.getElementsByName('patreon-enabled-features')
    const featureList = access(el, '0.getAttribute().split()', 'content', ', ') || []
    return featureList.reduce((memo, featureName)=> {
        const upperCaseName = featureName.toUpperCase()
        memo[upperCaseName] = upperCaseName
        return memo
    }, {})
}



// WEBPACK FOOTER //
// ./app/utilities/get-active-feature-flags.js