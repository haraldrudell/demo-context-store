/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
//import
const {
  //buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
}
 = require('graphql')
//from 'graphql'

//export default
module.exports =
new GraphQLSchema({ // https://graphql.org/graphql-js/type/
  query: new GraphQLObjectType({ // an object that contains fields
    name: 'stringData',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world'
        }
      }
    }
  })
})
/*
  buildSchema(
  `
  type Person {
    name: String!
    age: Int!
  }
  `
)
*/
