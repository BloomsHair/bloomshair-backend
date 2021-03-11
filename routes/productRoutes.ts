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
} from '../controllers/productController';
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorize";

router.route('/').get(getProducts).post(isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'] }), createProduct);
router.get('/top', topRatedProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }), deleteProductById)
  .put(isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }), updateProduct);
router.route('/:id/reviews').post(isAuthenticated, createProductReview);

export default router;