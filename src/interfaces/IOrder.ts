export interface IOrder {
  _id: string;
  userId: string;
  products: Array<object>;
  amount: number;
  address: object;
  status: string;
}

export interface IOrderInputDTO {
  userId: string;
  products: Array<object>;
  amount: number;
  address: object;
}
