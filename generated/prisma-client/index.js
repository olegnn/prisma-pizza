"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Order",
    embedded: false
  },
  {
    name: "ToppingOrder",
    embedded: false
  },
  {
    name: "ProductOrder",
    embedded: false
  },
  {
    name: "UserRole",
    embedded: false
  },
  {
    name: "Currency",
    embedded: false
  },
  {
    name: "Category",
    embedded: false
  },
  {
    name: "ImageSize",
    embedded: false
  },
  {
    name: "Price",
    embedded: false
  },
  {
    name: "ProductConfiguration",
    embedded: false
  },
  {
    name: "Product",
    embedded: false
  },
  {
    name: "Topping",
    embedded: false
  },
  {
    name: "Image",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_ENDPOINT"]}`,
  secret: `${process.env["PRISMA_SECRET"]}`
});
exports.prisma = new exports.Prisma();
