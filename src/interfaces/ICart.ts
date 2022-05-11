export interface ICart {
  _id: string;
  userId: string;
  products: Array<object>;
}

export interface ICartInputDTO {
  userId: string;
  products: Array<object>;
}
