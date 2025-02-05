import { PaymentStatus, UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      metaData = getPatientMetaData(user);
      break;
    default:
      throw new Error("Invalid user role!");
  }

  return metaData;
};

export const MetaService = {
  fetchDashboardMetaData,
};
