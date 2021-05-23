import express from 'express';
import cloudinary from '../utils/cloudinary.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const uploadImgCloudinary = async (req, res) => {
  try {
    const fileStr = req.body.data;
      const uploadedResponse = await cloudinary.v2.uploader.upload(fileStr, {
        upload_preset: 'blooms_hair_products'
      })
      res.status(201).json(uploadedResponse);
  } catch (error) {
      console.error(error);
      res.status(500).json({err: 'Something went wrong uploading image'})
  }
};

router.post('/', protect, isAdmin, uploadImgCloudinary);

export default router;
