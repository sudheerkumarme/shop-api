import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { IProduct } from '@/interfaces/IProduct';
import { ICart } from '@/interfaces/ICart';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      token: {
        _id: any;
        name: string;
        role: string;
      };
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type ProductModel = Model<IProduct & Document>;
    export type CartModel = Model<ICart & Document>;
  }
}
