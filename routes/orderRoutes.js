import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getUserOrders,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { isAuthenticated } from "../auth/authenticated.js";
import { isAuthorized } from "../auth/authorize.js";
import { isAdmin, protect } from '../middleware/authMiddleware.js';

router
  .route('/')
  .post(isAuthenticated, addOrderItems)
  .get(protect, isAdmin, getOrders);
router.route('/myorders').get(protect, getUserOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);

export default router;
