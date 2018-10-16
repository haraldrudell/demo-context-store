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
  ID,
}
 = require('graphql')
//from 'graphql'
//import gql from 'graphql-tag'
const gql = require('graphql-tag')
//import { makeExecutableSchema } from 'graphql-tools'
const { makeExecutableSchema } = require('graphql-tools')
const typeDefs = `
  type Note {
    id: Int!
    title: String!
    text: String!
  }
  type Query {
    notes: [Note]
  }
`
const resolvers = {
  Query: {
    notes: () => notes,
  }
}

const notes = [
  {id: 1, title: 'One', text: 'ett'},
  {id: 2, title: 'Two', text: 'tva'},
  {id: 3, title: 'Three', text: 'tre'},
]

//export default
module.exports =
makeExecutableSchema({
  typeDefs,
  resolvers,
})
/*
new GraphQLSchema({ // https://graphql.org/graphql-js/type/
  query: new GraphQLObjectType({ // an object that contains fields
    name: 'stringData',
    fields: {
      note: {
        id: ID,
        title: GraphQLString,
        text: GraphQLString,
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
