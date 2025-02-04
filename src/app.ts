import express, { Application } from "express";
import cors from "cors";
import { ProductRoutes } from "./app/modules/product/product.route";
import { OrderRoutes } from "./app/modules/order/order.route";
import { RootRoute } from "./app/modules/root.route";

const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

 

// application routes 
    app.use("/api/products", ProductRoutes);
    app.use("/api/orders", OrderRoutes);
    app.use("/", RootRoute);

export default app;
