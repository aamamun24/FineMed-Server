import { Order } from "./order.interface";
import { OrderModel } from "./order.model";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../User/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

const createOrderIntoDB = async (order: Order) => {
  const { userEmail, products } = order;

  // Check if user exists
  const userInDB = await UserModel.isUserExistsByEmail(userEmail);
  if (!userInDB) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  let prescriptionVarified = true;

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

    // 🔥 If any product requires prescription, set to false
    if (productInDB.prescriptionRequired) {
      prescriptionVarified = false;
    }
  }

  // Set prescriptionVerified on the order
  order.prescriptionVarified = prescriptionVarified;

  // Create the order
  return await OrderModel.create(order);
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
  return await OrderModel.findByIdAndDelete(orderId);
};

const getOrdersByEmail = async (email: string) => {
  const orders = await OrderModel.find({ userEmail: email }).sort({ createdAt: -1 });
  return orders;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderInDB,
  deleteOrderFromDB,
  getOrdersByEmail
};
