import express from 'express';
const router = express.Router();
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { isAuthenticated } from "../auth/authenticated.js";
import { isAuthorized } from "../auth/authorize.js";

router.post('/login', isAuthenticated, authUser);
router
  .route('/profile')
  .get(isAuthenticated, getUserProfile)
  .put(isAuthenticated, updateUserProfile);
router.route('/').post(registerUser).get(isAuthenticated, isAuthorized({ hasRole: ['admin', 'manager'] }), getUsers);
router
  .route('/:id')
  .delete(isAuthenticated, isAuthorized({ hasRole: ['admin', 'manager'] }), deleteUser)
  .get(isAuthenticated, isAuthorized({ hasRole: ['admin', 'manager'] }), getUserById)
  .put(isAuthenticated, isAuthorized({ hasRole: ['admin', 'manager'] }), updateUser);

export default router;