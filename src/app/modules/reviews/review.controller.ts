import { Request, Response } from 'express';
import ReviewModel from './review.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { OrderModel } from '../order/order.model';

// ✅ Create Review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const reviewData = req.body;

  const myOrderCount = (await OrderModel.find({userEmail: req.user.userEmail})).length; 
  if(myOrderCount < 1){
    throw new AppError(httpStatus.BAD_REQUEST, 'Make an order first to post reviews!');
  }

  const newReview = await ReviewModel.create({...reviewData, orderCount: myOrderCount});

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review posted successfully!',
    data: newReview,
  });
});



// ❌ Delete Review by ID
const deleteReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const targetReview = await ReviewModel.findById(id);
  if(!targetReview){
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found!');
  }

  const deletedReview = await ReviewModel.findByIdAndDelete(id);
  if (!deletedReview) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Review deletion error');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: deletedReview,
  });
});



// 📄 Get All Reviews
const getAllReviews = catchAsync(async (_req: Request, res: Response) => {
  const reviews = await ReviewModel.find().sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All reviews fetched successfully',
    data: reviews,
  });
});



export const ReviewController = {
    createReview,
    deleteReviewById,
    getAllReviews
}