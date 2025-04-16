import { Request, Response } from "express";
import mongoose from "mongoose";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ProductServices } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = req.body;
  const result = await ProductServices.createProductIntoDB(product);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product is created successfully.",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProductsFromDB(req.query); 

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Products are retrieved successfully.",
      data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format"); // Will be caught by catchAsync
  }

  const result = await ProductServices.getSingleProductFromDB(productId);
  if (!result) {
    throw new Error(`No product found with ID: ${productId}`);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single product retrieved successfully.",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const updatedProduct = await ProductServices.updateProductInDB(productId, updatedData);
  if (!updatedProduct) {
    throw new Error("Product not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const result = await ProductServices.deleteProductFromDB(productId);
  if (!result) {
    throw new Error("Product not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: null, // No data to return for deletion
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};