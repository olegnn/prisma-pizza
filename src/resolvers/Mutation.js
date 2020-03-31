const { compare, hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const APP_SECRET = process.env.APP_SECRET;

module.exports = ({ prisma }) => ({
  signUp: async (
    { name, phone, email, password, address1, address2, payment },
    info
  ) => {
    const hashedPassword = await hash(password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        address1,
        address2,
        payment
      }
    });
    return sign({ userId: user.id }, APP_SECRET, { expiresIn: 60 * 15 });
  },
  login: async ({ email, password }, info) => {
    const user = await prisma.query.user(
      { where: { email } },
      `{
      id
      email
      password
      roles
    }`
    );
    if (!user) {
      throw new Error(`Invalid email/password combination`);
    }
    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      throw new Error("Invalid email/password combination");
    }
    console.log(`Granted access to ${email} with roles ${user.roles}`);
    return sign({ userId: user.id, roles: user.roles }, APP_SECRET, {
      expiresIn: 60 * 15
    });
  }
});
