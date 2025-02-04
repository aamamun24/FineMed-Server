# **Bicycle Store Server**

![Bicycle Store Banner](https://i.postimg.cc/Vv24FZX6/Frame-6.png)

## **Project Overview**
The Bicycle Store Server is a fully functional backend for managing bicycle store operations. It allows for the creation, updating, and deletion of bicycle products, order placement, and inventory management. The server also includes a revenue calculation feature to track total sales from all orders. Built using **Node.js** with **Express.js** and **MongoDB**, this server application provides a robust and scalable solution for managing bicycle store data.

## **Live URL**
**[Insert Live URL here]**

## **Features**
- **Product Management**: Add, update, delete, and view product details including name, price, brand, and inventory quantity.
- **Order Management**: Place orders, update stock based on order quantity, and check for stock availability.
- **Revenue Calculation**: Calculate total revenue from all orders using an aggregation pipeline in MongoDB.
- **Stock Management**: Automatically adjust inventory levels when orders are placed, and mark items as out of stock when inventory hits zero.
- **Error Handling**: Comprehensive error handling with appropriate error messages and status codes for various scenarios, such as insufficient stock or failed database updates.

## **Technology Stack**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ORM)
- **Authentication**: JWT (Optional, for future implementations)
- **API Routes**: RESTful API for product and order management
- **Aggregation**: MongoDB aggregation for calculating total revenue from orders

## **How to Set Up**

### **Prerequisites**
Before running this project, ensure you have the following installed:
- **Node.js** (Version >= 14.x)
- **MongoDB** (Locally or cloud-based instance like MongoDB Atlas)

### **Installation**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/bicycle-store-server.git
   cd bicycle-store-server
