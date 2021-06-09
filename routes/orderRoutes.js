const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getUserOrders,
  getOrders,
  updateOrderToDelivered,
} = require('../controllers/orderController');

const { isAdmin, protect } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, isAdmin, getOrders);
router.route('/myorders').get(protect, getUserOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);

module.exports = router;
