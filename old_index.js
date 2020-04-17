const crypto = require('crypto')
const graphqlHTTP = require('express-graphql')
const express = require('express')

const schema = require('./schema')
const RandomDie = require('./RandomDie')
const Message = require('./Message')

const data = {
    message: {}
}

const loggingMiddleware = (req, res, next) => {
    console.log('ip', req.ip)

    next()
}

// El raíz proporciona una función de resolución para cada API endpoint
const root = {
    quoteOfTheDay: () => Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within',
    random: () => Math.random(),
    rollDice: ({ numDice, numSides }) => {
        const output = []

        for (let i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)))
        }

        return output
    },
    getDie: ({ numSides }) => new RandomDie(numSides),
    // Mutation and input
    getMessage: ({ id }) => {
        if (!data.message[id]) throw new Error('no message exists with id ' + id)

        return new Message(id, data.message[id])
    },
    createMessage: ({ input }) => {
        const id = crypto.randomBytes(10).toString('hex')

        data.message[id] = input
        return new Message(id, input)
    },
    updateMessage: ({ id, input }) => {
        if (!data.message[id]) throw new Error('no message exists with id ' + id)

        data.message[id] = input
        return new Message(id, input)
    },
    // Middlewares
    ip: (args, req) => {
        return req.ip
    }
}

const app = express()

app.use(loggingMiddleware)
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000, console.log('Run GraphQL API server at http://localhost:4000/graphql'))
