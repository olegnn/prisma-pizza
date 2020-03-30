const { rule, and, shield, or, deny, allow } = require("graphql-shield");
const { verify } = require("jsonwebtoken");
const { getUserId } = require("./helpers");

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  }),

  isAdmin: rule()((parent, args, context) => {
    console.log(context.request.ip);
    return false;
  }),

  canSendOrder: rule()((parent, args, context) => {
    return true;
  }),

  isNotAuthorizedUser: rule()(() => true)
};

const allowType = (typeName, cond) => ({
  [typeName]: cond,
  [`${typeName}Edge`]: cond,
  [`${typeName}Connection`]: cond
});

const permissions = shield({
  ...allowType("Product", allow),
  ...allowType("ProductConfiguration", allow),
  ...allowType("Topping", allow),
  ...allowType("Price", allow),
  ...allowType("Image", allow),
  ...allowType("User", rules.isAuthenticatedUser),
  PageInfo: allow,
  Node: allow,
  Order: allow,
  State: allow,

  User: rules.isAuthenticatedUser,
  ProductOrder: rules.isAuthenticatedUser,
  ToppingOrder: rules.isAuthenticatedUser,

  Query: {
    "*": rules.isAdmin,
    me: rules.isAuthenticatedUser,
    productsConnection: allow,
    products: allow,
    product: allow,
    state: allow
    // productOrders: rules.isAdmin,
    // toppingOrders: rules.isAdmin
  },
  Mutation: {
    "*": rules.isAdmin,
    createOrder: or(rules.canSendOrder, rules.isAdmin)
    //updateOrder: rules.isAdmin,
    //deleteOrder: rules.isAdmin,
    //createProduct: rules.isAdmin
    // deletePost: rules.isPostOwner,
    // publish: rules.isPostOwner
  }
});

module.exports = permissions;
