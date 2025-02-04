import express from 'express'
import { OrderController } from './order.controller'


const router = express.Router()



router.post('/', OrderController.createOrder);
router.get('/revenue', OrderController.getRevenue);





export const OrderRoutes = router;