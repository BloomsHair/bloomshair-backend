import asyncHandler from 'express-async-handler';
import { Request, Response } from "express";
import * as admin from 'firebase-admin';




// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req: Request, res: Response, next: Function) => {
  const uid = req.body.uid;
  const timestamp = admin.firestore.FieldValue.serverTimestamp;
  const Product = {
    name: 'Sample Name',
    price: 0,
    user: uid,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    createdAt: timestamp()
  };

  try {
    const products: FirebaseFirestore.DocumentData[] = []
    const productRef = admin.firestore().collection('products')
      .orderBy('createdAt')

    const snapshot = await productRef.get();
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      products.push({ id: doc.id, product: doc.data() })
    });

    if (!productRef) {
      const productDocRef = admin.firestore().collection('products').doc();
      await productDocRef.set(Product);
      return productDocRef;
    }
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    })
  }
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req: Request, res: Response, next: Function) => {
  const products: FirebaseFirestore.DocumentData[] = []
  try {
    const productRef = await admin.firestore().collection('products')
      .doc(req.params.id);
    const snapshot = await productRef.get();
    products.push({ id: snapshot.id, product: snapshot.data() })


    return res.status(200).json({
      success: true,
      data: products
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @desc DELETE a  product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProductById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const product = await admin.firestore().collection('products')
      .doc(req.params.id);

    product.delete();

    return res.status(200).json({
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @desc Create a  product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req: Request, res: Response, next: Function) => {
  const uid = req.body.uid;
  const timestamp = admin.firestore.FieldValue.serverTimestamp;
  const product = {
    name: 'Sample Name',
    price: 0,
    user: uid,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    createdAt: timestamp()
  };

  const createdProduct = await admin.firestore().collection('products').add(product);
  res.status(201).send(createdProduct);
});

// @desc Update product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response, next: Function) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;
  console.log(brand)
  console.log(req.params.id)
  const timestamp = admin.firestore.FieldValue.serverTimestamp;

  try {
    const product = admin.firestore().collection('products')
      .doc(req.params.id);
    console.log(product)
    const result = await product.update({
      name: name,
      price: price,
      image: image,
      brand: brand,
      category: category,
      countInStock: countInStock,
      description: description,
      updatedAt: timestamp()
    })

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});


// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req: Request, res: Response, next: Function) => {
  // const { rating, comment } = req.body;

  // const product = await Product.findById(req.params.id);

  // if (product) {
  //   const alreadyReviewed = product.reviews.find(
  //     (r) => r.user.toString() === req.user._id.toString()
  //   );

  //   if (alreadyReviewed) {
  //     res.status(400);
  //     throw new Error('Product already reviewed');
  //   }

  //   const review = {
  //     name: req.user.name,
  //     rating: Number(rating),
  //     comment,
  //     user: req.user._id,
  //   };

  //   product.reviews.push(review);
  //   product.numReviews = product.reviews.length;
  //   product.rating =
  //     product.reviews.reduce((acc, item) => item.rating + acc, 0) /
  //     product.reviews.length;
  //   await product.save();
  //   res.status(201).json({ message: 'Review added' });
  // } else {
  //   res.status(404);
  //   throw new Error('Product not found');
  // }
});

// @desc Get top rated products
// @route GET/api/products/top
// @access Public
const topRatedProducts = asyncHandler(async (req: Request, res: Response, next: Function) => {
  // const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  // res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  topRatedProducts,
};
