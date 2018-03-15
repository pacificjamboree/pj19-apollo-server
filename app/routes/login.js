const { authenticateUser, generateJWTForUser } = require('../lib/auth');

module.exports = async (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });
  try {
    const user = await authenticateUser(username, password);
    console.log(user);
    const jwt = generateJWTForUser(user);
    res.status(200).send(jwt);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
