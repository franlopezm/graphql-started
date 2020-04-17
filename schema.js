const { buildSchema } = require('graphql')

// Construcción de un schema
module.exports = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String,
        author: String
    }

    type RandomDie {
        numSides: Int
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }

    "It's a example type"
    type Query {
        quoteOfTheDay: String
        random: Float
        rollDice(numDice: Int!, numSides: Int): [Int]
        getDie(numSides: Int): RandomDie
        getMessage(id: ID!): Message
        ip: String
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`)