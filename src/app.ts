import express, { Application } from "express";
import cors from "cors";
import { ProductRoutes } from "./app/modules/product/product.route";
import { OrderRoutes } from "./app/modules/order/order.route";
import { RootRoute } from "./app/modules/root.route";
import { UserRoutes } from "./app/modules/User/user.route";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
import cookieParser from "cookie-parser";
import { ReviewRoutes } from "./app/modules/reviews/review.route";
const app: Application = express();

// parser
app.use(express.json());
app.use(cors({origin: [
    "http://localhost:5173",  // Local development
    "https://fine-med-client.vercel.app",  // Vercel frontend
    "http://localhost:3000"
  ], credentials: true}));
app.use(cookieParser()); // Add this

// application routes 
    app.use("/api/products", ProductRoutes);
    app.use("/api/orders", OrderRoutes);
    app.use("/api/users", UserRoutes);
    app.use("/api/auth", AuthRoutes);
    app.use("/api/reviews", ReviewRoutes);
    app.use("/", RootRoute);


app.use(globalErrorHandler);


export default app;
