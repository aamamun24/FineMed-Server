import { Order } from "./order.interface";
import { OrderModel } from "./order.model";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../User/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

const createOrderIntoDB = async (order: Order) => {
  const { userId, products } = order;

  // Check if user exists
  const userInDB = await UserModel.findById(userId);
  if (!userInDB) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  let totalPrice = 0;

  // Validate each product in the order
  for (const item of products) {
    const productInDB = await ProductModel.findById(item.productId);
    if (!productInDB) {
      throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${item.productId} not found`);
    }

    // Check if stock is sufficient
    if (productInDB.quantity < item.quantity) {
      throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for product ${item.productId}`);
    }

    // Update stock
    productInDB.quantity -= item.quantity;
    productInDB.inStock = productInDB.quantity > 0;
    await productInDB.save();

    // Calculate total price
    totalPrice += productInDB.price * item.quantity;
  }

  // Create the order
  return await OrderModel.create({ ...order, totalPrice });
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  try {
    const ordersQuery = new QueryBuilder(OrderModel.find(), query)
      .filter()
      .sort()
      .paginate()
      .fields();

    return await ordersQuery.modelQuery.populate("products.productId").exec();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to fetch orders");
  }
};

const getSingleOrderFromDB = async (orderId: string) => {
  return await OrderModel.findById(orderId).populate("products.productId");
};

const updateOrderInDB = async (orderId: string, updatedData: Partial<Order>) => {
  const existingOrder = await OrderModel.findById(orderId);
  if (!existingOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Handle product quantity updates
  if (updatedData.products) {
    for (const updatedItem of updatedData.products) {
      const existingItem = existingOrder.products.find(
        (item) => item.productId.toString() === updatedItem.productId.toString()
      );

      if (existingItem) {
        const product = await ProductModel.findById(existingItem.productId);
        if (!product) {
          throw new AppError(httpStatus.NOT_FOUND, "Associated product not found");
        }

        const quantityDiff = existingItem.quantity - updatedItem.quantity;
        const newQuantity = product.quantity + quantityDiff;

        if (newQuantity < 0) {
          throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock to update order");
        }

        product.quantity = newQuantity;
        product.inStock = newQuantity > 0;
        await product.save();
      }
    }
  }

  return await OrderModel.findByIdAndUpdate(orderId, updatedData, { new: true }).populate(
    "products.productId"
  );
};

const deleteOrderFromDB = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Restore product stock
  for (const item of order.products) {
    const product = await ProductModel.findById(item.productId);
    if (product) {
      product.quantity += item.quantity;
      product.inStock = product.quantity > 0;
      await product.save();
    }
  }

  return await OrderModel.findByIdAndDelete(orderId);
};

// const calculateRevenue = async () => {
//   const revenue = await OrderModel.aggregate([
//     { $unwind: "$products" },
//     {
//       $lookup: {
//         from: "products",
//         localField: "products.productId",
//         foreignField: "_id",
//         as: "productDetails",
//       },
//     },
//     { $unwind: "$productDetails" },
//     {
//       $project: {
//         totalPrice: { $multiply: ["$products.quantity", "$productDetails.price"] },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalRevenue: { $sum: "$totalPrice" },
//       },
//     },
//     { $project: { _id: 0, totalRevenue: 1 } },
//   ]);

//   return revenue.length > 0 ? revenue[0].totalRevenue : 0;
// };

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderInDB,
  deleteOrderFromDB,
  // calculateRevenue,
};
