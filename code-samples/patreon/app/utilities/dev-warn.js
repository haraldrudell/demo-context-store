import guardExecution from 'utilities/guard-execution'

export default guardExecution(console.warn.bind(console), process.env.NODE_ENV !== 'production')



// WEBPACK FOOTER //
// ./app/utilities/dev-warn.js