import express, { Application, Request, Response } from "express";
const router = express.Router();

router.get('/', (req:Request,res:Response)=>{
    res.send('Welcome to Bi-Cycle-Garden')
});

export const RootRoute = router;
