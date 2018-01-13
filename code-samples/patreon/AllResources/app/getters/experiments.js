import { selectExperiments } from 'shared/configure-store'

const loggedFailedSelections = {}

export const selectorForExperiment = key => {
    return state => {
        const experiments = selectExperiments(state)

        if (!(key in experiments) && process.env.DEVELOPMENT_DEBUG) {
            if (!loggedFailedSelections[key]) {
                console.error(
                    `Couldn't select experiment '${key}' from state.`,
                    experiments,
                )
                loggedFailedSelections[key] = true
            }
        }

        return experiments[key]
    }
}

export default selectorForExperiment



// WEBPACK FOOTER //
// ./app/getters/experiments.js