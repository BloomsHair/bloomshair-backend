const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  topRatedProducts,
} = require( '../controllers/productController');
const { isAdmin, protect } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, isAdmin, createProduct);
router.get('/top', topRatedProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, isAdmin, deleteProductById)
  .put(protect, isAdmin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
