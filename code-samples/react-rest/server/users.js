/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const m = 'users'

const userList = [{type: 'user', id: 1, prod: true}, {type: 'user', id: 2, prod: true}]

export async function get(id) {
  if (id === undefined) return userList
  const index = Number(id) - 1
  if (index >= 0 && index < userList.length) return userList[index]
}
