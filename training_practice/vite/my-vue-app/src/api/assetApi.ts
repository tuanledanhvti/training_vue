import axios from "axios";

const BASE_URL = "http://localhost:3001/assets";

export const prodApi = axios.create({
  baseURL: BASE_URL,
});

//prodApi.defaults.headers.common['Content-Type'] = 'application/json';

export const getAsset = async () => {
  const response = await prodApi.get("");
  return response.data;
};

export const getAssetById = async (id) => {
  try {
    const response = await prodApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Asset by ID:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

export const updateAsset = async (id, updatedAssetData) => {
  try {
    const response = await prodApi.put(`/${id}`, updatedAssetData);
    return response.data;
  } catch (error) {
    console.error("Error updating Asset:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

export const createAsset = async (createdAssetData) => {
  try {
    const response = await prodApi.post("", createdAssetData);
    return response.data;
  } catch (error) {
    console.error("Error creating Asset:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

export const deleteAsset = async (id) => {
  try {
    const response = await prodApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Asset:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};
