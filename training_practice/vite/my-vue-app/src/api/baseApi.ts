import axios from "axios";

// --------------------------------- Base url ---------------------------------
const BASE_URL = "http://localhost:3001";

// --------------------------------- Tạo axios ---------------------------------
export const api = axios.create({
  baseURL: BASE_URL,
});

//api.defaults.headers.common['Content-Type'] = 'application/json';

// --------------------------------- Các hàm gọi api ---------------------------------
// Lấy toàn bộ dữ liệu
export const getData = async (endPoint) => {
  try {
    const response = await api.get(`/${endPoint}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Data by ID:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

// Lấy dữ liệu theo id
export const getDataById = async (endPoint, id) => {
  try {
    const response = await api.get(`/${endPoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Data by ID:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

// Cập nhật dữ liệu
export const updateData = async (endPoint, id, updatedData) => {
  try {
    const response = await api.put(`/${endPoint}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating Data:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

// Thêm mới dữ liệu
export const createData = async (endPoint, createdData) => {
  try {
    const response = await api.post(`/${endPoint}`, createdData);
    return response.data;
  } catch (error) {
    console.error("Error creating Data:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

// Xóa dữ liệu
export const deleteData = async (endPoint, id) => {
  try {
    const response = await api.delete(`/${endPoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Data:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};
