import moment from 'moment'
import { apiDateFormat } from 'utilities/format-date'

export default () => moment().utc().format(apiDateFormat)



// WEBPACK FOOTER //
// ./app/utilities/api-timestamp.js