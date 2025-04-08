import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import { OrderModel } from "./order.model";
import { OrderValidation } from "./order.validation";

const router = express.Router();

// Create a new order
router.post("/",validateRequest(OrderValidation.createOrderValidationSchema), auth("admin","customer"), OrderController.createOrder);

// Get all orders
router.get("/",auth("admin"), OrderController.getAllOrders);

// Get a single order by ID
router.get("/:orderId",auth("admin"), OrderController.getSingleOrder);

// Update an order by ID (partial update)
router.patch("/:orderId",validateRequest(OrderValidation.updateOrderValidationSchema),auth("admin"), OrderController.updateOrder);

// Delete an order by ID
router.delete("/:orderId",auth("admin"), OrderController.deleteOrder);




router.post("/payment-success/:transID", async (req, res) => {
    const transID: string = req.params.transID;
    console.log("trans Id:", transID);
  
    const r = await OrderModel.findOneAndUpdate(
      { transactionId: transID },
      { $set: { status: "paid" } },
      {
        new: true
      }
    );

    if(r){
        const { transactionId ,status } = r;
        if(status == "paid"){
            res.redirect(`http://localhost:5173/payment-success/${transactionId}`)
        }
    }

    

  });
  

router.post("/payment-failed/:transID",async(req,res)=>{
    console.log("trans Id: ",req.params.transID)
    const transID = req.params.transID;
    console.log("trans Id:", transID);
  
    const r = await OrderModel.findOneAndUpdate(
        { transactionId: transID },
        { $set: { status: "unpaid" } },
        {
          new: true
        }
      );
  
      if(r){
          const { transactionId ,status } = r;
          if(status == "unpaid"){
              res.redirect(`http://localhost:5173/payment-fail/${transactionId}`)
          }
      }
});




router.post("/payment-cancel/:transID",async(req,res)=>{
    console.log("trans Id: ",req.params.transID)
    console.log("trans Id: ",req.params.transID)
    const transID = req.params.transID;
    console.log("trans Id:", transID);
  
    await OrderModel.findOneAndUpdate(
      { transactionId: transID },
      { $set: { status: "pending" } }
    );
});

export const OrderRoutes = router;

