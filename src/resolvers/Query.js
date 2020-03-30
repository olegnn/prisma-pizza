module.exports = {
  products: (parent, args, context, info) => {
    return context.prisma.products(args);
  },
  orders: (parent, args, context) => {
    return context.prisma.orders(args);
  }
};
