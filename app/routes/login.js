const { authenticateUser, generateJWTForUser } = require('../lib/auth');

module.exports = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authenticateUser(username, password);
    const jwt = generateJWTForUser(user);
    res.status(200).send({ token: jwt });
  } catch (err) {
    const { name, code, message } = err;

    res.status(code || 500).send({
      error: name,
      message,
      statusCode: code,
    });
  }
};
