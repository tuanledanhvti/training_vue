import {
  api,
  getData,
  getDataById,
  updateData,
  createData,
  deleteData,
} from "./baseApi";
import {
  Company,
  TreeQuasar,
  TreeData,
  Depart,
  Group,
  DepartTree,
  DepartDTO,
  CompanyDTO,
} from "./model/types";
import VTI_Resource from "../helper/resource";

// --------------------------------- Tạo endpoint ---------------------------------
const endPoint = "company";
const endPointDepart = "depart";
const endPointGroup = "group";

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

// --------------------------------- Api riêng của company ---------------------------------
export const getCompanyAndDepart = async (idList: string) => {
  try {
    const responseDepart = await api.get(`/${endPointDepart}?${idList}`);
    const companyList = await getData(endPoint);
    const companyData = companyList.map((company) => {
      return {
        id: company.id,
        label: company.name,
        header: VTI_Resource.Tree.Header.Root,
      };
    });
    const departData = responseDepart.data.map((depart) => {
      return {
        id: depart.id,
        label: depart.name,
        id_company: depart.id_company,
        header: VTI_Resource.Tree.Header.Generic,
      };
    });
    const tree: TreeQuasar[] = companyData.map((company) => {
      const children = departData.filter(
        (child) => child.id_company === company.id
      );
      return { ...company, children };
    });
    return tree;
  } catch (error) {
    console.error("Error fetching Data by ID:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};

// --------------------------------- Api riêng của company có thêm group ---------------------------------
export const getTree = async (idDepartList: string) => {
  try {
    const responseDepart = await api.get(`/${endPointDepart}?${idDepartList}`);
    const companyList = await getData(endPoint);
    const companyData = companyList.map((company) => {
      return {
        id: company.id,
        label: company.name,
        is_parent: company.is_parent,
        is_show_children: true,
      };
    });
    const idGroupList = responseDepart.data
      .map((depart: Depart) => `id_depart=${depart.id}`)
      .join("&");
    const responseGroup = await api.get(`/${endPointGroup}?${idGroupList}`);
    const groupData = responseGroup.data.map((group: Group) => {
      return {
        id: group.id,
        label: group.name,
        id_depart: group.id_depart,
      };
    });

    const departDTO = responseDepart.data.map((depart) => {
      return {
        id: depart.id,
        label: depart.name,
        id_company: depart.id_company,
        is_parent: depart.is_parent,
        is_show_children: true,
      };
    });

    const departData: DepartTree = departDTO.map((depart: DepartDTO) => {
      const children = groupData.filter(
        (child: Group) => child.id_depart === depart.id
      );
      return { ...depart, children };
    });

    const tree: TreeData[] = companyData.map((company: CompanyDTO) => {
      const children = departData.filter(
        (child: DepartTree) => child.id_company === company.id
      );
      return { ...company, children };
    });
    return tree;
  } catch (error) {
    console.error("Error fetching Data by ID:", error);
    throw error; // Rethrow lỗi để xử lý ở nơi sử dụng hàm này
  }
};
