import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IDoctorFilterRequest, IDoctorUpdate } from "./doctor.interface";
import { doctorSearchableFields } from "./doctor.constant";
import prisma from "../../../shared/prisma";

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    // Corrected specialties condition
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const DoctorService = {
  getAllFromDB,
};
