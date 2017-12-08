import dataService from '../apis/dataService'
import AppStorage from '../components/AppStorage/AppStorage'
import xhr from 'xhr-async'

export async function logout () {
  const uuid = AppStorage.get('uuid')
  const token = AppStorage.get('token')

  if (uuid && token) {
    const url = `users/${uuid}/logout`

    try {
      AppStorage.remove('uuid')
      const response = await dataService.fetch(url, { method: 'POST' })
      return { response }
    } catch (e) {
      return { error: e, status: e.status }
    }
  }
}

export async function addAccount (companyName, accountName) {
  const url = 'users/account'

  try {
    const response = await dataService.fetch(url, {
      method: 'POST',
      body: { companyName, accountName }
    })
    return { response: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function resendVerificationEmail (email) {
  return await xhr.get(`users/resend-verification-email/${email}`)
}


// WEBPACK FOOTER //
// ../src/services/UsersService.js