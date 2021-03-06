const asyncHandler = require('express-async-handler');
const admin = require('firebase-admin');
const User = require('../models/userModel');

const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token found');
    }
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log(decodedToken.role);
      res.locals = {
        ...res.locals,
        uid: decodedToken.uid,
        role: decodedToken.role,
        email: decodedToken.email,
      };
      req.user = await User.find({ uid: decodedToken.uid });
      req.token = token;
      next();
    } catch (err) {
      console.error(`${err.code} -  ${err.message}`);
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }
});

module.exports = isAuthenticated
