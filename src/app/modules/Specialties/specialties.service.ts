import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { Specialties } from "@prisma/client";

const inserIntoDB = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

export const SpecialtiesService = {
  inserIntoDB,
  getAllFromDB,
};
