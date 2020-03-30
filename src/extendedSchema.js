module.exports = {
  typeDefs: `
    extend type Mutation {
        login: String!
        signUp: String!
    }

    type State {
        deliveryPrice: [Price!]!
    }

    extend type Query {
        me: User
        state: State!
    }
`
};
