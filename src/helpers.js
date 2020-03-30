function getUserId(context) {
  const authoriz = context.request.get("Authorization");
  if (authoriz) {
    const token = authoriz.replace("Bearer ", "");
    const verifiedToken = verify(token, APP_SECRET);
    return verifiedToken && verifiedToken.userId;
  }
}

module.exports = { getUserId };
