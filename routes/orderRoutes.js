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

router.route('/').post(isAuthenticated, addOrderItems).get(isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'] }), getOrders);
router.route('/myorders').get(isAuthenticated, getUserOrders);

router.route('/:id').get(isAuthenticated, getOrderById);
router.route('/:id/pay').put(isAuthenticated, updateOrderToPaid);
router.route('/:id/deliver').put(isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'] }), updateOrderToDelivered);

export default router;
