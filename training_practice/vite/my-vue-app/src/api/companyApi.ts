import {
  getData,
  getDataById,
  updateData,
  createData,
  deleteData,
} from "./baseApi";
import { Company } from "./model/types";

// --------------------------------- Tạo endpoint ---------------------------------
const endPoint = "company";

// --------------------------------- Api của company lấy từ base ---------------------------------
export const getCompany = () => {
  return getData(endPoint);
};
export const getCompanyById = (id: number) => {
  return getDataById(endPoint, id);
};
export const updateCompany = (id: number, updatedData: Company) => {
  return updateData(endPoint, id, updatedData);
};
export const createCompany = (createdData: Company) => {
  return createData(endPoint, createdData);
};
export const deleteCompany = (id: number) => {
  return deleteData(endPoint, id);
};
