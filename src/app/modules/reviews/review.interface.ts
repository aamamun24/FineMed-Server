
export type TReview = {
    userName: string;
    userEmail: string;
    reviewText: string;
    orderCount: number;
  };
  
  // Extended for mongoose
  import { Document } from 'mongoose';
  export interface IReview extends TReview, Document {}
  