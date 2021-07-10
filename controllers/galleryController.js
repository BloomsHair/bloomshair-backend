const asyncHandler = require('express-async-handler');
const Picture = require('../models/galleryModel');

const createPictures = asyncHandler(async (req, res) => {
    const {  imageUrl } = req.body;
    console.log(imageUrl)
    if (!imageUrl) {
      return res.status(400).send({ message: 'Missing fields' });
    }
    const picture = new Picture({
        image: imageUrl
    })
    const createdPicture = await picture.save();
    res.status(201).json(createdPicture);
})

const getPictures = asyncHandler(async (req, res) => {
    const pictures = await Picture.find({})

    res.json(pictures)
})

const deletePictureById = asyncHandler(async (req, res) => {
 try {
   const picture = await Picture.findById(req.params.id);

   if (picture) {
     await picture.remove();
     res.json({ message: 'Picture removed' });
   }
 } catch (error) {
   res.status(404);
   throw new Error('Product not found');
 }
})

module.exports = { createPictures, getPictures, deletePictureById}