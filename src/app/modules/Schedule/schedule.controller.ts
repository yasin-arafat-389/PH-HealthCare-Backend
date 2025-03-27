import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";
import { StatusCodes } from "http-status-codes";
import { ScheduleService } from "./schedule.service";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.inserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await ScheduleService.getAllFromDB(
      filters,
      options,
      user as IAuthUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Schedule fetched successfully!",
      data: result,
    });
  }
);

export const ScheduleController = {
  inserIntoDB,
  getAllFromDB,
};
