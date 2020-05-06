const expressGraphql = require('express-graphql')
const express = require('express')
const graphql = require('graphql')
const crypto = require('crypto')

const fakeData = {
    a: {
        id: 'a',
        name: 'alice',
        courseId: 1
    },
    b: {
        id: 'b',
        name: 'bob',
        courseId: 2
    },
    c: {
        id: 'c',
        name: 'bob',
        courseId: 4
    }
}

const courseData = {
    1: {
        id: 1,
        name: 'Inglés'
    },
    2: {
        id: 2,
        name: 'Francés'
    },
    4: {
        id: 4,
        name: 'Alemán'
    }
}

const courseType = new graphql.GraphQLObjectType({
    name: 'Course',
    fields: {
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString }
    }
})

const userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        courseId: { type: graphql.GraphQLInt },
        course: {
            type: courseType,
            resolve: function (user) {
                return courseData[user.courseId]
            }
        }
    }
})

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: userType,
            args: {
                id: { type: graphql.GraphQLString }
            },
            resolve: (_, { id }) => fakeData[id]
        },
        users: {
            description: 'Get all users',
            type: new graphql.GraphQLList(userType),
            resolve: (_, args, context) => {
                return Object.keys(fakeData).map(elem => fakeData[elem])
            }
        }
    }
})

const mutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: userType,
            args: {
                name: { type: graphql.GraphQLString }
            },
            resolve: (_, { name }) => {
                const id = crypto.randomBytes(10).toString('hex')

                fakeData[id] = { id, name }

                return { id, name }
            }
        }
    }
})

const schema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType
})

const app = express()

app.use('/graphql', expressGraphql({
    schema,
    graphiql: true
}))

app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')