import mongoose from "mongoose";
import { Order } from "./order.interface";
import { OrderModel } from "./order.model";
import { ProductModel } from "../product/product.model";

const createOrderIntoDB = async (order: Order) => {
  const { product, quantity } = order;

  // Find the product in the database
  const productInDB = await ProductModel.findById(product);
  if (!productInDB) {
    throw new Error("Product not found");
  }

  // Check if the product has enough stock
  if (productInDB.quantity < quantity) {
    throw new Error("Insufficient stock available for this order");
  }

  // Calculate new quantity and inStock status
  const newQuantity = productInDB.quantity - quantity;
  const inStock = newQuantity > 0;

  // Update product stock
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    product,
    {
      $inc: { quantity: -quantity }, // Decrease quantity
      $set: { inStock }, // Update inStock status
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new Error("Failed to update product stock");
  }

  // Create the order
  return await OrderModel.create(order);
};

const getAllOrdersFromDB = async () => {
  return await OrderModel.find().populate("product"); // Populate product details
};

const getSingleOrderFromDB = async (orderId: string) => {
  return await OrderModel.findById(orderId).populate("product");
};

const updateOrderInDB = async (orderId: string, updatedData: Partial<Order>) => {
  const existingOrder = await OrderModel.findById(orderId);
  if (!existingOrder) {
    throw new Error("Order not found");
  }

  // If quantity is updated, adjust product stock accordingly
  if (updatedData.quantity && updatedData.quantity !== existingOrder.quantity) {
    const product = await ProductModel.findById(existingOrder.product);
    if (!product) {
      throw new Error("Associated product not found");
    }

    // Calculate the difference in quantity
    const quantityDiff = existingOrder.quantity - updatedData.quantity;
    const newQuantity = product.quantity + quantityDiff;

    if (newQuantity < 0) {
      throw new Error("Insufficient stock to update order");
    }

    const inStock = newQuantity > 0;
    await ProductModel.findByIdAndUpdate(
      existingOrder.product,
      {
        $set: { quantity: newQuantity, inStock },
      },
      { new: true }
    );
  }

  return await OrderModel.findByIdAndUpdate(
    orderId,
    { $set: updatedData },
    { new: true }
  ).populate("product");
};

const deleteOrderFromDB = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Restore product stock
  const product = await ProductModel.findById(order.product);
  if (product) {
    const newQuantity = product.quantity + order.quantity;
    const inStock = newQuantity > 0;
    await ProductModel.findByIdAndUpdate(
      order.product,
      {
        $set: { quantity: newQuantity, inStock },
      },
      { new: true }
    );
  }

  return await OrderModel.findByIdAndDelete(orderId);
};

const calculateRevenue = async () => {
  const revenue = await OrderModel.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        totalPrice: {
          $multiply: ["$quantity", "$productDetails.price"],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  return revenue.length > 0 ? revenue[0].totalRevenue : 0;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderInDB,
  deleteOrderFromDB,
  calculateRevenue,
};

