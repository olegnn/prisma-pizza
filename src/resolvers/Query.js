const { getUserId } = require("../helpers");

module.exports = context => ({
  state: () => ({
    deliveryPrice: [
      { currency: "USD", amount: 500 },
      { currency: "EUR", amount: 450 }
    ]
  }),
  me: (args, info) => {
    const id = getUserId(context);
    return id && context.prisma.query.user({ where: { id } }, info);
  }
});
