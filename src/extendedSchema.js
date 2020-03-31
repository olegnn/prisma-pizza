module.exports = {
  typeDefs: `
    extend type Mutation {
        login(email: String!, password: String!): String
        signUp(
            email: String!,
            name: String!,
            phone: String,
            password: String!,
            address1: String,
            address2: String,
            payment: String
        ): String
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
