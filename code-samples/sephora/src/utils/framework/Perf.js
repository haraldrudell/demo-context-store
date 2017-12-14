const Perf = Sephora.isRootRender ? {} : Sephora.Util.Perf;

function normalizeTime(time) {
    return Math.round(time * 1000)/1000;
}

Perf.getLogs = function (outputAsTable = false) {
    if (outputAsTable) {
        let table = Perf.loadEvents
        .map(event => {
            let output = { time: normalizeTime(event.time) };
            output.data = Array.isArray(event.data) ? event.data[0] : event.data;
            return output;
        });

        console.table(table);
    } else {
        for (var i = 0, max = Perf.loadEvents.length; i < max; i++) {
            let event = Perf.loadEvents[i];
            let time = normalizeTime(event.time);
            let prefix = time + ':';

            if (typeof event.data === 'string') {
                console.log(prefix + ' ' + event.data);
            } else if (Array.isArray(event.data)) {
                // Support for reports with multiple console arguments
                let logData = event.data.slice();
                logData.unshift(prefix);
                console.log.apply(console, logData);
            }
        }
    }
};

Perf.getSummary = function () {
    let summary = {};
    Perf.loadEvents
    .filter(event => event.timestamp)
    .forEach(event => summary[event.label] = normalizeTime(event.time));

    console.table(summary);
};

Perf.getMeasurements = function () {
    let eventMap = {};
    let measurements = {};

    // Group load events by event type
    Perf.loadEvents
    .filter(event => event.timestamp)
    .forEach(event => {
        let eventPrefix = event.data.split(' ')[0];

        if (!eventMap[eventPrefix]) {
            eventMap[eventPrefix] = [event.data];
        } else {
            eventMap[eventPrefix].push(event.data);
            eventMap[eventPrefix].sort((a, b) => a.time - b.time);
        }
    });

    // Set measurement between first and last recorded events of every event type
    Object.keys(eventMap).forEach(event => {
        let events = eventMap[event];
        let eventsLength = events.length;

        /*jshint ignore:start*/
        function addEntry (...entries) {
            entries.forEach(item => {
                let entry;
                let {
                    name,
                    ...data
                } = item;

                window.performance.measure(name, item.eventStart, item.eventEnd);
                entry = window.performance.getEntriesByName(name);
                measurements[name] = {
                    ...data,
                    duration: entry.length ? normalizeTime(entry[0].duration) : null
                };
            });
        }
        /*jshint ignore:end*/

        if (eventsLength < 2) {
            // We cannot measure deltas with only one event
            return;
        }

        if (eventsLength === 4) {
            // Service entries have 3 different deltas we want to measure
            addEntry({
                name: `${event}_loading`,
                eventStart: events[0],
                eventEnd: events[1]
            }, {
                name: `${event}_rendering`,
                eventStart: events[2],
                eventEnd: events[3]
            }, {
                name: `${event}_total`,
                eventStart: events[0],
                eventEnd: events[3]
            });
        } else {
            // For all others we measure delta between first and last associated events
            addEntry({
                name: event,
                eventStart: events[0],
                eventEnd: events[eventsLength - 1]
            });
        }
    });

    console.table(measurements);
};

module.exports = Perf;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/framework/Perf.js