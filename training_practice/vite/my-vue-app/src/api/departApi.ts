import {
  api,
  getData,
  getDataById,
  updateData,
  createData,
  deleteData,
} from "./baseApi";
import { Depart } from "./model/types";

// --------------------------------- Tạo endpoint ---------------------------------
const endPoint = "depart";

// --------------------------------- Api của department lấy từ base ---------------------------------
export const getDepart = () => {
  return getData(endPoint);
};
export const getDepartById = (id: number) => {
  return getDataById(endPoint, id);
};
export const updateDepart = (id: number, updatedData: Depart) => {
  return updateData(endPoint, id, updatedData);
};
export const createDepart = (createdData: Depart) => {
  return createData(endPoint, createdData);
};
export const deleteDepart = (id: number) => {
  return deleteData(endPoint, id);
};

// --------------------------------- Api riêng của department ---------------------------------
export const getDepartByCompanyId = async (idList) => {
  try {
    idList.forEach(id => {
      console.log(id);
      
    });
    const response = await api.get(`/${endPoint}?id_company=${1}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Data by ID:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};
