export interface Asset {
  id: number;
  name: string;
  price: string;
}

export interface Company {
  id: number;
  name: string;
  is_parent: Boolean;
}

export interface CompanyDTO {
  id: number;
  label: string;
  is_parent: Boolean;
  is_show_children: Boolean;
}

export interface CompanyLabel {
  id: number;
  label: string;
  is_parent: Boolean;
}

export interface Depart {
  id: number;
  name: string;
  is_parent: Boolean;
  id_company: number;
}

export interface DepartDTO {
  id: number;
  label: string;
  id_company: number;
  is_parent: Boolean;
}

export interface Group {
  id: number;
  name: string;
  id_depart: number;
}

export interface GroupDTO {
  id: number;
  label: string;
  id_depart: number;
}

export interface TreeQuasar extends CompanyLabel {
  children?: Depart[];
}

export interface DepartTree extends DepartDTO {
  children?: GroupDTO[];
}

export interface TreeData extends CompanyDTO {
  children?: DepartTree[];
}
