import mongoose, { Schema } from 'mongoose';
import { IReview } from './review.interface';

const ReviewSchema: Schema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
    },
    orderCount: {
      type: Number,
      required: [true, 'Order count is required'],
      min: [0, 'Order count must be 0 or greater'],
    },
    starCount: {
      type: Number,
      required: [true, 'Star count is required'],
      min: [0, 'Order count must be 1 or greater'],
      max: [5, 'Order count must be 5 or smaller'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
