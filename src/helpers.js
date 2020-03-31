const { sign, verify } = require("jsonwebtoken");

const APP_SECRET = process.env.APP_SECRET;

const extractToken = context => {
  const extracted = context.request.get("Authorization");

  if (typeof extracted !== "string" || !extracted.startsWith("Bearer"))
    return null;
  else return extracted.slice(7);
};

function getUserId(context) {
  const token = extractToken(context);
  if (!token) return null;

  const verifiedToken = verify(token, APP_SECRET);
  return verifiedToken && verifiedToken.userId;
}

function isUserAdmin(context) {
  const token = extractToken(context);
  if (!token) return null;

  const verifiedToken = verify(token, APP_SECRET);
  return (
    verifiedToken &&
    verifiedToken.roles &&
    verifiedToken.roles.includes("Admin")
  );
}

module.exports = { getUserId, isUserAdmin, extractToken };
