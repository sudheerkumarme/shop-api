import { Service, Inject } from 'typedi';
import { IProduct, IProductInputDTO } from '@/interfaces/IProduct';
import { HttpStatusCode } from '@/config/constants';
import { APIError } from '@/loaders/errors';

@Service()
export default class ProductService {
    constructor(
        @Inject('productModel') private productModel: Models.ProductModel,
        @Inject('logger') private logger
    ) { };
    
    public async CreateProduct(productInputDTO: IProductInputDTO): Promise<{ product: IProduct; }> {
        try {
            const productRecord = await this.productModel.create({
                ...productInputDTO
            });

            if (!productRecord) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Product cannot be created');
            }

            const product = productRecord.toObject();
            return { product };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async UpdateProduct(id: string, productInputDTO: IProductInputDTO): Promise<{ product: IProduct; }> {
        try {
            const productRecord = await this.productModel.findByIdAndUpdate(id, {
                $set: productInputDTO,
            }, { new: true });

            if (!productRecord) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Product cannot be updated');
            }

            const product = productRecord.toObject();
            return { product };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async DeleteProduct(id: string): Promise<{ message: string; }> {
        try {
            const isProductDeleted = await this.productModel.findByIdAndDelete(id);

            if (!isProductDeleted) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Product cannot be deleted');
            }
            return { message: "Product deleted successfully" };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetProductById(id: string): Promise<{ product: IProduct; }> {
        try {
            const productRecord = await this.productModel.findById(id);

            if (!productRecord) {
                throw new APIError(HttpStatusCode.NOT_FOUND, 'Product not found');
            }

            const product = productRecord.toObject();
            return { product };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetAllProducts(limit: string, lastProductId: string, category: string): Promise<{ products: Array<IProduct>; productCount: Number }> {
        try {
            const productLimit = parseInt(limit);

            const productCount = await this.productModel.countDocuments({
                ...(category && { categories: { $in: [category] } })
            });
            if (productCount === 0) {
                return { products: [], productCount: 0 };
            }

            const products = await this.productModel.find(
                {
                    ...(lastProductId && { _id: { $lt: lastProductId } }),
                    ...(category && { categories: { $in: [category] } })
                }
            ).sort({ _id: -1 }).limit(productLimit);

            return { products, productCount };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

};
