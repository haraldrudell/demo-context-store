import guardExecution from 'utilities/guard-execution'

export default guardExecution(console.error.bind(console), process.env.NODE_ENV !== 'production')



// WEBPACK FOOTER //
// ./app/utilities/dev-error.js