

const userValidation = (payload) => {
  const password = payload?.password;
  const confirmPass = payload?.confirmPass;

  if (password !== confirmPass) {
    throw new Error("Passwords do not match")
  }

}

module.exports = { userValidation }