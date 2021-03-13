import asyncHandler from 'express-async-handler';
import admin from 'firebase-admin';
import User from '../models/userModel.js';

const authUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user.email === req.user[0].email) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: req.token
      });
    }
  } catch (error) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { displayName, password, email, role, disabled } = req.body;

    if (!displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    const { uid } = await admin.auth().createUser({
      displayName,
      password,
      email,
      disabled,
    });
    await admin.auth().setCustomUserClaims(uid, { role });
    const user = await User.create({
      name: displayName,
      uid,
      email,
      isAdmin: role === 'admin' ? true : false,
    });

    return res.status(201).json({
      _id: user._id,
      uid: user.uid,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(404);
    throw new Error('User not Registered');
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user[0]._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc UPDATE user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user[0]._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get all users
// @route GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc Delete all users
// @route DELETE /api/users/:id
// @access Private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (user) {
      await admin.auth().deleteUser(id);
      await user.remove();
    }
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get user by Id
// @route GET /api/users/:id
// @access Private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc UPDATE user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, password, email, role } = req.body;
    const user = await User.findById(id);

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    if (user) {
      user.name = displayName || user.name;
      user.email = email || user.email;
      user.isAdmin = role === 'admin' ? true : false;

      const updatedUser = await user.save();

      await admin.auth().updateUser(user.uid, { displayName, password, email });
      await admin.auth().setCustomUserClaims(user.uid, { role });

      return res.status(204).send({
        _id: updatedUser._id,
        uid: updatedUser.uid,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    }
  } catch (err) {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
