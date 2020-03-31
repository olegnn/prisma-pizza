const query = require("./Query");
const mutation = require("./Mutation");

module.exports = context => ({
  query: query(context),
  mutation: mutation(context)
});
