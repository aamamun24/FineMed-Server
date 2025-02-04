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

    // Log current quantity to help debug
    console.log(`Current quantity of product ${productInDB.name}: ${productInDB.quantity}`);

    // Determine if we need to set inStock to false (when quantity goes to 0)
    const newQuantity = productInDB.quantity - quantity;
    const inStock = newQuantity > 0;

    // Reduce the quantity in the product model and update inStock status
    const updatedProduct = await ProductModel.findByIdAndUpdate(
        product,
        {
            $inc: { quantity: -quantity },  // Decrease quantity by the ordered quantity
            $set: { inStock }  // Set inStock to false if quantity is 0 or less
        },
        { new: true }  // Return the updated document
    );

    // Log updated quantity to help debug
    console.log(`Updated quantity of product ${productInDB.name}: ${updatedProduct?.quantity}`);

    // Check if the product is successfully updated
    if (!updatedProduct) {
        throw new Error("Failed to update product stock");
    }

    // Create the order in the order collection
    const newOrder = await OrderModel.create(order);

    return newOrder;
};

export const OrderServices = {
    createOrderIntoDB
};
