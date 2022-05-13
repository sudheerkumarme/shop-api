export interface IProduct {
  _id: string;
  title: string;
  desc: string;
  img: string;
  categories: Array<string>;
  size: string;
  color: string;
  price: number;
}

export interface IProductInputDTO {
  title: string;
  desc: string;
  img: string;
  categories: Array<string>;
  size: string;
  color: string;
  price: number;
}
