const SHORTENED_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = {
    /**
     * Get the name of the day of the week.
     * @param  {object} date JS Date object.
     * @return {string}      The name of the day in the date object such as 'Monday'
     */
    getDayOfWeek: function (date) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return (days[date.getDay()]);
    },

    /**
     * Gets client date and adjusts to PST
     * @param  {object} now A JS date object.
     * @return {string}     The current date converted to YYYY|MM|DD
     */
    getLocalDate: function (clientDate) {
        try {
            var pstOffset = '-8';
            var utcDate = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
            var serverDate = new Date(utcDate + (3600000 * (pstOffset)));
            var _m = (serverDate.getMonth() + 1);
            var _d = serverDate.getDate();

            return (serverDate.getFullYear() +
                '|' + (_m < 10 ? '0' + _m : _m) +
                '|' + (_d < 10 ? '0' + _d : _d));
        } catch (e) {
            return null;
        }
    },

    /**
     * Gets the month array for drop downs on forms
     */
    getMonthArray: function () {
        return MONTHS;
    },

    /**
    * Get numeric month array for drop down on forms
    */
    getNumericMonthArray: function () {
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    },

    /**
     * Gets the date array for drop downs on forms
     */
    getDayArray: function () {
        const daysArray = [];

        for (let i = 1; i <= 31; i++) {
            daysArray.push(i);
        }

        return daysArray;
    },

    /**
     * Gets the year array for drop downs on forms
     */
    getYearArray: function () {
        const yearCeling = new Date().getFullYear() - 13;
        const yearArray = [];

        for (let i = yearCeling; i >= 1900; i--) {
            yearArray.push(i);
        }

        return yearArray;
    },

    getBiMaxDateString: function () {
        let validDate = new Date().setFullYear(new Date().getFullYear() - 13);
        let date = new Date(validDate);

        return date.toISOString().substring(0, 10);
    },

    getCreditCardExpYears: function () {
        let currentYear = new Date().getFullYear();
        let creditCardExpYears = [];

        for (let i = currentYear; i < currentYear + 12; i++) {
            creditCardExpYears.push(i);
        }

        return creditCardExpYears;
    },

    /**
    * @param {object} date JS Date object
    * @return {string} Long data format DD MM YYYY
    */
    getLongDate: function (date) {
        return date.getDate() + ' ' + SHORTENED_MONTHS[date.getMonth()] + ' ' + date.getFullYear();
    },

    /**
     * Takes a ISO8601 date string and returns a Mon DD YYYY formatted string
     * @param  {string} iso8601DateString - ISO8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param  {boolean} addComma=false - should it have a comma before YYYY?
     * @return {string} Mon DD YYYY or Mon DD, YYYY formatted string
     */
    formatDateMDY: function (iso8601DateString, addComma = false) {
        // Safari does not support the ISO8601 date format, so we are getting
        // the first 10 characters of the string and replacing the dashes for 
        // slashes to create a data string supported by all browsers (YYYY/MM/DD)
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        const dateString = iso8601DateString.slice(0, 10).replace(/-/g, '/');
        const date = new Date(dateString);
        const day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        const yearSpace = addComma ? ', ' : ' ';
        return SHORTENED_MONTHS[date.getMonth()] + ' ' + day + yearSpace + date.getFullYear();
    },

    /**
    * @param {string} timestamp string from reservations object
    * @return {string} HH:MM (am or pm)
    */
    getReservationTime: function (timeString) {
        let time = new Date(timeString);

        //get accurate hours for time zone where reservation is located
        let splitTime = timeString.split('T');
        splitTime = splitTime[splitTime.length - 1].split(':');
        time.setHours(splitTime[0]);

        let timeOfDay = 'am';
        let hours = time.getHours();
        let minutes = time.getMinutes();

        // convert from military time
        if (hours > 12) {
            hours = hours - 12;
            timeOfDay = 'pm';
        }

        //add zero if minutes is less than 10
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return hours + ':' + minutes + ' ' + timeOfDay;
    },

    getPlayBillingDateString: function (first, last) {
        const firstDate = new Date(first);
        const lastDate = new Date(last);
        const months = this.getNumericMonthArray();
        const firstDay =
            firstDate.getDate() < 10 ? ('0' + firstDate.getDate()) : firstDate.getDate();
        const lastDay =
            lastDate.getDate() < 10 ? ('0' + lastDate.getDate()) : lastDate.getDate();
        return `${months[firstDate.getMonth()]}/${firstDay}/${firstDate.getFullYear()} -
        ${months[lastDate.getMonth()]}/${lastDay}/${lastDate.getFullYear()}`;
    },

    /**
    * @param {number that correlates to month}
    * @return {string}
    * note: can be built out to take longer version of month string and give back shorter version
    */
    getShortenedMonth: function (month) {
        let monthNum = parseInt(month);
        return SHORTENED_MONTHS[monthNum - 1];
    },

    /**
    * @param {number that correlates to month}
    * @return {string}
    * note: can be built out to take longer version of month string and give back shorter version
    */
    getLongMonth: function (month) {
        let monthNum = parseInt(month);
        return MONTHS[monthNum - 1];
    },

    /**
    * formats time for My Profile according to rules:
    * if posted <59 minutes, displays '#m ago'
    * if posted <23.59 hr ago, displays '#h ago'
    * if posted <30 days ago, displays '#d ago'
    * if posted >30 days ago, displays 'MM DD, YYYY'
    * @param date String
    * @return {string}
    */
    formatSocialDate: function (dateString, defaultToLongDate) {
        let date = new Date(dateString);
        let today = new Date();
        let millisecondsDiff = Math.abs(today - date);
        let minsDiff = Math.floor((millisecondsDiff / 1000) / 60);

        switch (true) {
            case (minsDiff < 60):
                return minsDiff + ' m ago';
            case (minsDiff < 60 * 23.59):
                return Math.floor(minsDiff / 60) + ' h ago';
            case (minsDiff <= 60 * 24 * 30): {
                let day = Math.floor(minsDiff / 60 / 24);
                return `${day} d ago`;
            }

            case (minsDiff > 60 * 24 * 30):
                return defaultToLongDate ?
                    this.getLongDate(date) :
                    dateString.split(' ').slice(0, 3).join(' ');
            default:
                return null;
        }
    },

    addRemoveDays: function (add, date, days) {
        let result = new Date(date);
        if (add) {
            result.setDate(result.getDate() + days);
        } else {
            result.setDate(result.getDate() - days);
        }
        result.setHours(0, 0, 0, 0);
        return result;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Date.js