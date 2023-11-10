export interface Asset {
  id: number;
  name: string;
  price: string;
}

export interface Company{
  id: number;
  name: string;
}

export interface Depart{
  id: number;
  name: string;
  id_company: number;
}