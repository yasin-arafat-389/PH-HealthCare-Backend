import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await SpecialtiesService.inserIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Specialties created successfully!",
    data: result,
  });
});

export const SpecialtiesController = {
  inserIntoDB,
};
