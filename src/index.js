const { GraphQLServer } = require("graphql-yoga");
const { forward } = require("graphql-middleware-forward-binding");
const permissions = require("./permissions");
const prismaSchema = require("../generated/prisma-client/prisma-schema")
  .typeDefs;
const extendedSchema = require("./extendedSchema").typeDefs;
const resolvers = require("./resolvers");
const { Prisma } = require("prisma-binding");
const { execute } = require("graphql");
const { delegateToSchema } = require("graphql-tools");
const { getUserId } = require("./helpers");

const localForwardMiddleware = forward("Query.state", "Query.me")("local");
const prismaForwardMiddleware = forward("Query", "Mutation")("prisma");

const prisma = new Prisma({
  typeDefs: prismaSchema,
  endpoint: "http://localhost:4466"
});

const server = new GraphQLServer({
  typeDefs: `
  ${prismaSchema}

  ${extendedSchema}
`,
  resolvers: {
    /*State: {
      deliveryPrice: () => 
    },*/
    Query: {
      state: () => ({
        deliveryPrice: [
          { currency: "USD", amount: 500 },
          { currency: "EUR", amount: 450 }
        ]
      })
    }
  },
  middlewares: [
    localForwardMiddleware,
    permissions,
    prismaForwardMiddleware
  ],
  context: request => {
    return {
      ...request,
      prisma,
      local: {
        query: {
          state: () => ({
            deliveryPrice: [
              { currency: "USD", amount: 500 },
              { currency: "EUR", amount: 450 }
            ]
          }),
          me: (args, context, info) => {
            const id = getUserId(request);
            return id && prisma.query.user({ where: { id } });
            //console.log(context.request.get("Authorization"));
          }
        }
      }
    };
  }
});

//console.log(server.executableSchema.getType("Mutation").getFields());

server.start(() => console.log("Server is running on http://localhost:4000"));
