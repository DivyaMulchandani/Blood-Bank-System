// const JWT = require("jsonwebtoken");

// module.exports = async (req, res, next) => {
//   try {
//     const token = req.headers["authorization"].split(" ")[1];
//     JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         return res.status(401).send({
//           success: false,
//           err,
//           message: "Auth Failed",
//         });
//       } else {
//         req.body.userId = decode.userId;
//         next();
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(401).send({
//       success: false,
//       err,
//       message: "Auth Failed",
//     });
//   }
// };

const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).send({
        success: false,
        message: "JWT Secret is not defined",
      });
    }
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "No authorization header provided",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token missing in authorization header",
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth Failed",
          error: err,
        });
      } else {
        req.body.userId = decode.userId;
        next();
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      success: false,
      message: "Auth Failed",
      error: err,
    });
  }
};
