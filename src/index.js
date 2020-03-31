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

const localForwardMiddleware = forward(
  "Query.state",
  "Query.me",
  "Mutation.login",
  "Mutation.signUp"
)("local");
const prismaForwardMiddleware = forward("Query", "Mutation")("prisma");

const prisma = new Prisma({
  typeDefs: prismaSchema,
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET
});

const server = new GraphQLServer({
  typeDefs: `
  ${prismaSchema.replace()}

  ${extendedSchema}
`,
  resolvers: {},
  middlewares: [localForwardMiddleware, permissions, prismaForwardMiddleware],
  context: request => {
    return {
      ...request,
      prisma,
      local: resolvers({ ...request, prisma })
    };
  }
});

server.start(() => console.log("Server is running on http://localhost:4000"));
