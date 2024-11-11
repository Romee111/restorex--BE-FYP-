import slugify from "slugify";
import { BASE_URL } from "../../../multer/multerConfiq.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { productModel } from "./../../../Database/models/product.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

// const addProduct = catchAsyncError(async (req, res, next) => {
//   try {
//     // If you're using file uploads (like with multer)
//     // req.body.imgCover = req.files.imgCover[0].filename;
//     // req.body.images = req.files.images.map((ele) => ele.filename);
    
//     req.body.slug = slugify(req.body.title);  // Create slug from title
//     const addProduct = new productModel(req.body);
    
//     // Save the new product
//     await addProduct.save();
    
//     // Send response
//     res.status(201).json({ message: "Product added successfully", addProduct });
//   } catch (error) {
//     next(error);  // Pass the error to the global error handler
//   }
// });
// const addProduct = catchAsyncError(async (req, res, next) => {
//   req.body.slug = slugify(req.body.title);
//   const addProduct = new productModel(req.body);

//   // Add this check to prevent errors
//   await addProduct.save();

//   // Send response
//   res.status(201).json({ message: "success", addProduct });
// });
const addProduct = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.title);

    // Set the imgCover path if it exists
    if (req.file) {
      req.body.imgCover = `${BASE_URL}/uploads/products/${req.file.filename}`;
    }

    // Set the images paths if they exist
    if (req.files && req.files.images) {
      req.body.images = req.files.images.map(file => `${BASE_URL}/uploads/products/${file.filename}`);
    }

    const newProduct = await productModel.create(req.body);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .limit()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const getAllProducts = await apiFeature.mongooseQuery;

  res
    .status(201)
    .json({ page: PAGE_NUMBER, message: "success", getAllProducts });
});
const getproductBySellerId = catchAsyncError(async (req, res, next) => {
  // Ensure that only sellers can access this endpoint and check their ID
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({ message: "Access denied. Only sellers can access this endpoint." });
  }

  // Filter products to only those created by the logged-in seller
  const apiFeature = new ApiFeatures(productModel.find({ createdBy: req.user._id }), req.query)
    .pagination()
    .limit()
    .fields()
    .filteration()
    .search()
    .sort();

  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const getAllProducts = await apiFeature.mongooseQuery;

  res.status(200).json({ page: PAGE_NUMBER, message: "success", products: getAllProducts });
});

const getProducts=catchAsyncError(async(req,res,next)=>{
  const getProducts=await productModel.find();
  res.status(201).json({message:"success",getProducts})  
} 
    
)

const getSpecificProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const getSpecificProduct = await productModel.findByIdAndUpdate(id);
  res.status(201).json({ message: "success", getSpecificProduct });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updateProduct = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  updateProduct && res.status(201).json({ message: "success", updateProduct });

  !updateProduct && next(new AppError("Product was not found", 404));
});

const deleteProduct = deleteOne(productModel, "Product");
export {
  addProduct,
  getAllProducts,
  getProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
  getproductBySellerId
};
