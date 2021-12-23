const jwt = require("../utils/jwt");

const userAuth = async function (req, res, next) {
  try {
    
    let token = req.header("Authorization");

    if (!token) {
      res.status(401).send({
        status: false,
        message: `Missing authentication token in request`,
      });
      return;
    }
    // console.log(token)
    let tokenSplit = token.split(" ");
    token = tokenSplit[1];

    const decoded = await jwt.verifyToken(token);

    if (!decoded) {
      res.status(401).send({
        status: false,
        message: `Invalid authentication token in request`,
      });
      return;
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(`Error! ${error.message}`);
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = userAuth;
