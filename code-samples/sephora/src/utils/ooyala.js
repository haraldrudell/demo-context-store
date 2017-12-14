let path = '/js/ufe/' + Sephora.buildMode + '/thirdparty/ooyala/';

module.exports = {
    external: {
        core: path + 'core.min.js',
        plugin: path + 'main_html5.min.js',
        skin: path + 'html5-skin.min.js',
        config: path + 'skin.json',
        heartBeat: path + 'analytics/VideoHeartbeat_4.10.4.min.js',
        appMeasurement: path + 'analytics/AppMeasurement_4.8.5.js',
        visitorApi: path + 'analytics/VisitorAPI_4.8.5.js',
        omniture: path + 'analytics/omniture_4.8.5.min.js'

    },

    // Specific things like video name are set in BccVideo.c.js
    omniture: {
        marketingCloudOrgId: 'F6281253512D2BB50A490D45@AdobeOrg',
        visitorTrackingServer: 'metrics.sephora.com',
        appMeasurementTrackingServer: 'metrics.sephora.com',
        debug: true,
        channel: 'This is required. Tracking wont fire without it',
        heartbeatTrackingServer: 'sephora.hb.omtrdc.net',
        publisherId: 'F6281253512D2BB50A490D45@AdobeOrg',
        props: {
            prop1: 'placeholder',
            prop25: 'placeholder'
        },
        eVars: {
            eVar9: 'placeholder'
        }
    },

    pcode: 'Zkbmo6GF2LxceMLgevLrcbpYicLF',
    playerBrandingId: 'YTMwZmZmOGY2YWU1NGM1NTM1MmQxNjM3'
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/ooyala.js