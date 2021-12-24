const { User } = require("../../models");

async function signup(req, res, next) {
  try {
    const { username, password, email } = req.body;
    if (await User.create(username, password, email)) {
      res.status(200).send({
        isSuccess: true,
        message: "Signup successful!",
      });
    } else {
      res.status(400).send({
        isSuccess: false,
        message: `Username '${username}' already exists`,
      });
    }
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const userId = await User.validate(username, password);
    if (userId === null) {
      res.status(400).send({
        isSuccess: false,
        message: `Invalid credentials for username: '${username}'`,
      });
      return;
    }

    const token = userId; // TODO add security
    res.status(200).send({
      isSuccess: true,
      message: "Login successful!",
      token,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  signup,
  login,
};
