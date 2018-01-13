import moment from 'moment'

const NOW = moment()

/*
* This provides a consistent 'now' value.
* Returns a clone so the returned moment() object can be safely mutated.
*/
export default function() {
    return NOW.clone()
}



// WEBPACK FOOTER //
// ./app/constants/now.js