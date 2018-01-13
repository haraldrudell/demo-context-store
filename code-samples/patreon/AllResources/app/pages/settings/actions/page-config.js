export const STORE_PAGE_CONFIG = 'STORE_PAGE_CONFIG'

export const getAndStorePageConfig = patreonObj => ({
    type: STORE_PAGE_CONFIG,
    payload: patreonObj.config
})



// WEBPACK FOOTER //
// ./app/pages/settings/actions/page-config.js