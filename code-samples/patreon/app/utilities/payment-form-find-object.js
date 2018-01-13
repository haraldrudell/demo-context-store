export default function findObjectWithMatchingModel(value, form){
    for (let i in form) {
        if (Array.isArray(form[i])) {
            for (let j in form[i]) {
                if (form[i][j].key === value) {
                    return form[i][j]
                }
            }
        } else {
            if (form[i].key === value) {
                return form[i]
            }
        }
    }

    return {}
}



// WEBPACK FOOTER //
// ./app/utilities/payment-form-find-object.js