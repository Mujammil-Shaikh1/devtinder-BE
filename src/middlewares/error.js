const error = (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong")
  }
}

module.exports = { error }