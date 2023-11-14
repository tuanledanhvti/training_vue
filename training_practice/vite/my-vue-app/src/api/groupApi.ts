import {
  api,
  getData,
  getDataById,
  updateData,
  createData,
  deleteData,
} from "./baseApi";
import { Group } from "./model/types";

// --------------------------------- Tạo endpoint ---------------------------------
const endPoint = "group";

// --------------------------------- Api của group lấy từ base ---------------------------------
export const getGroup = () => {
  return getData(endPoint);
};
export const getGroupById = (id: number) => {
  return getDataById(endPoint, id);
};
export const updateGroup = (id: number, updatedData: Group) => {
  return updateData(endPoint, id, updatedData);
};
export const createGroup = (createdData: Group) => {
  return createData(endPoint, createdData);
};
export const deleteGroup = (id: number) => {
  return deleteData(endPoint, id);
};
