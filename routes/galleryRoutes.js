const express = require('express');
const router = express.Router();
const { getPictures, createPictures, deletePictureById } = require('../controllers/galleryController');

const { isAdmin, protect } = require('../middleware/authMiddleware');

router.route('/').get(getPictures).post(protect, isAdmin, createPictures);
router
  .route('/:id')
  .delete(protect, isAdmin, deletePictureById);

module.exports = router;