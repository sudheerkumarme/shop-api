export interface IOrder {
  _id: string;
  userId: string;
  products: Array<object>;
  amount: number;
  address: object;
  img: string;
  status: string;
}

export interface IOrderInputDTO {
  userId: string;
  products: Array<object>;
  amount: number;
  address: object;
  img: string;
}
