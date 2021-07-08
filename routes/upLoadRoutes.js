const express = require('express');
const cloudinary = require('../utils/cloudinary');
const { isAdmin, protect } =  require('../middleware/authMiddleware');

const router = express.Router();

const uploadImgCloudinary = async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'blooms_hair_products',
    });
    res.status(201).json(uploadedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: 'Something went wrong uploading image' });
  }
};

router.post('/', protect, isAdmin, uploadImgCloudinary);

module.exports = router;
