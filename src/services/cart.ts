import { Service, Inject } from 'typedi';
import { ICart, ICartInputDTO } from '@/interfaces/ICart';
import { HttpStatusCode } from '@/config/constants';
import { APIError } from '@/loaders/errors';

@Service()
export default class CartService {
    constructor(
        @Inject('cartModel') private cartModel: Models.CartModel,
        @Inject('logger') private logger
    ) { };
    
    public async CreateAndUpdateCart(cartInputDTO: ICartInputDTO): Promise<{ cart: ICart; }> {
        try {
            const cartRecord = await this.cartModel.findOneAndUpdate({ userId: cartInputDTO.userId }, {
                $set: cartInputDTO,
            }, { upsert: true, returnDocument: 'after' });

            if (!cartRecord) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Cart cannot be created or updated');
            }

            const cart = cartRecord.toObject();
            return { cart };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async DeleteCart(userId: string): Promise<{ message: string; }> {
        try {
            const isCartDeleted = await this.cartModel.findOneAndDelete({ userId });
            if (!isCartDeleted) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Cart cannot be deleted');
            }

            return { message: "Cart deleted successfully" };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetUserCart(userId: string): Promise<{ cart: ICart; }> {
        try {
            const cartRecord = await this.cartModel.findOne({ userId });
            if (!cartRecord) {
                throw new APIError(HttpStatusCode.NOT_FOUND, 'Cart not found');
            }

            const cart = cartRecord.toObject();
            return { cart };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetAllCarts(limit: string, lastCartId: string): Promise<{ carts: Array<ICart>; cartCount: Number }> {
        try {
            const productLimit = parseInt(limit);

            const cartCount = await this.cartModel.countDocuments();
            if (cartCount === 0) {
                return { carts: [], cartCount: 0 };
            }

            const carts = await this.cartModel.find(
                {
                    ...(lastCartId && { _id: { $lt: lastCartId } }),
                }
            ).sort({ _id: -1 }).limit(productLimit);

            return { carts, cartCount };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

};
