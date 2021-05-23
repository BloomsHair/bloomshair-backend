import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  topRatedProducts,
} from '../controllers/productController.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, isAdmin, createProduct);
router.get('/top', topRatedProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, isAdmin, deleteProductById)
  .put(protect, isAdmin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
