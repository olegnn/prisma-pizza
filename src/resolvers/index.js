const Query = require("./Query");
const Mutation = require("./Mutation");

module.exports = {
  Query,
  Mutation,
  /*Product: {
    confirations: (parent, args, context) => context.prisma.confirations(args)
  },*/
  Node: {
    __resolveType() {
      return null;
    }
  }
  /// Product,
  ///ProductOrder,
  /// Post
};
