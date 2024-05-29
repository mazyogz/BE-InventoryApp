const jwt = require('jsonwebtoken');

exports.verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    let token = req.headers['authorization'];

    if (token) {
      token = token.split(' ')[1];

      jwt.verify(token, "access", (err, user) => {
        if (err) {
          if (err.message === 'jwt expired') {
            return res.status(401).json({
              success: false,
              message: 'Access token expired',
            });
          } else {
            console.log(err);
            return res.status(401).json({
              success: false,
              message: 'User not authenticated',
            });
          }
        } else {
          if (allowedRoles.includes(user.role) || user.role === 'admin' ) {
            req.user = user;
            next();
          } else {
            return res.status(403).json({
              success: false,
              message: 'User does not have the required role',
            });
          }
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'No Access Token',
      });
    }
  };
};

exports.verifyUser = (req, res, next) => {
  let token = req.headers['authorization'];

  if (token != null && token != undefined) {
    token = token.split(' ')[1]; //Access token

    jwt.verify(token, 'access', async (err, user) => {
      if (user) {
        req.user = user;
        next();
      } else if (err.message === 'jwt expired') {
        return res.status(401).json({
          success: false,
          message: 'Access token expired',
        });
      } else {
        console.log(err);
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'No Access Token',
    });
  }
};
