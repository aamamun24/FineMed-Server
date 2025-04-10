import express, { Request, Response } from "express";
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

router.post("/ipn",(req:Request, res:Response) => {
  const { tran_id, status, val_id } = req.body;
  console.log('IPN Received:', req.body);
  // Verify payment with SSLCommerz using val_id
  // Update order status in database
  // res.status(200).send('IPN Received');
})


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
            res.redirect(`https://bicycle-store-client-one.vercel.app/payment-success/${transactionId}`)
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
              res.redirect(`https://bicycle-store-client-one.vercel.app/payment-fail/${transactionId}`)
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

