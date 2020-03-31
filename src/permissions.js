const {
  rule,
  inputRule,
  and,
  shield,
  or,
  deny,
  allow
} = require("graphql-shield");
const yup = require("yup");
const { verify } = require("jsonwebtoken");
const { getUserId, isUserAdmin } = require("./helpers");

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  }),

  isAdmin: rule()((parent, args, context) => {
    return isUserAdmin(context);
  }),

  canSendOrder: rule()((parent, args, context) => {
    return true;
  }),

  isValidOrder: inputRule()(yup =>
    yup.object().shape({
      data: yup.object().shape({
        name: yup.string().required(),
        email: yup
          .string()
          .email()
          .nullable()
          .notRequired(),
        time: yup
          .date()
          .nullable()
          .notRequired(),
        phone: yup.string().required(),
        address1: yup.string().required(),
        address2: yup.string().required(),
        payment: yup.string().nullable(),
        products: yup.object().shape({
          create: yup.array(
            yup.object().shape({
              quantity: yup.number().required(),
              configuration: yup.object().shape({
                connect: yup.object().shape({ id: yup.string().required() })
              }),
              toppings: yup.object().shape({
                create: yup
                  .array(
                    yup.object().shape({
                      quantity: yup.number().required(),
                      topping: yup.object().shape({
                        connect: yup
                          .object()
                          .shape({ id: yup.string().required() })
                      })
                    })
                  )
                  .nullable()
              })
            })
          )
        })
      })
    })
  )
};

const setTypePermission = (typeName, cond) => ({
  [typeName]: cond,
  [`${typeName}Edge`]: cond,
  [`${typeName}Connection`]: cond
});

const permissions = shield({
  ...setTypePermission("Product", allow),
  ...setTypePermission("ProductConfiguration", allow),
  ...setTypePermission("Topping", allow),
  ...setTypePermission("Price", allow),
  ...setTypePermission("Image", allow),
  ...setTypePermission("User", rules.isAuthenticatedUser),
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
  },
  Mutation: {
    "*": rules.isAdmin,
    createOrder: or(and(rules.canSendOrder, rules.isValidOrder), rules.isAdmin)
  },
  Subscription: {
    "*": rules.isAdmin
  }
});

module.exports = permissions;
