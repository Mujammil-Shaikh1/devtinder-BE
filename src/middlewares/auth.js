const adminAuth = (req, res, next) => {
  let token = "secret"
  if (token === 'secmret') {
    next();
  }
  else {
    res.status(401).send("Unauthorized");
  }
}

module.exports = { adminAuth };