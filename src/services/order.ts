import { Service, Inject } from 'typedi';
import { IOrder, IOrderInputDTO } from '@/interfaces/IOrder';
import { HttpStatusCode } from '@/config/constants';
import { APIError } from '@/loaders/errors';

@Service()
export default class CartService {
    constructor(
        @Inject('orderModel') private orderModel: Models.OrderModel,
        @Inject('logger') private logger
    ) { };
    
    public async CreateOrder(orderInputDTO: IOrderInputDTO): Promise<{ order: IOrder; }> {
        try {
            const orderRecord = await this.orderModel.create(orderInputDTO);
            if (!orderRecord) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Order cannot be created');
            }

            const order = orderRecord.toObject();
            return { order };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async UpdateOrder(id: string, orderInputDTO: IOrderInputDTO): Promise<{ order: IOrder; }> {
        try {
            const orderRecord = await this.orderModel.findByIdAndUpdate(id, {
                $set: orderInputDTO,
            }, { new: true });

            if (!orderRecord) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Order cannot be updated');
            }

            const order = orderRecord.toObject();
            return { order };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async DeleteOrder(id: string): Promise<{ message: string; }> {
        try {
            const isOrderDeleted = await this.orderModel.findByIdAndDelete(id);
            if (!isOrderDeleted) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'Cart cannot be deleted');
            }

            return { message: "Order deleted successfully" };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetOrder(id: string): Promise<{ order: IOrder; }> {
        try {
            const orderRecord = await this.orderModel.findById(id);
            if (!orderRecord) {
                throw new APIError(HttpStatusCode.NOT_FOUND, 'Order not found');
            }

            const order = orderRecord.toObject();
            return { order };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetAllOrders(userId: string, limit: string, lastOrderId: string): Promise<{ orders: Array<IOrder>; orderCount: Number }> {
        try {
            const orderLimit = parseInt(limit);

            const orderCount = await this.orderModel.countDocuments({
                ...(userId && { userId }),
            });
            if (orderCount === 0) {
                return { orders: [], orderCount: 0 };
            }

            const orders = await this.orderModel.find(
                {
                    ...(lastOrderId && { _id: { $lt: lastOrderId } }),
                    ...(userId && { userId }),
                }, {
            }
            ).sort({ _id: -1 }).limit(orderLimit);

            return { orders, orderCount };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetIncome(): Promise<{ income: any; }> {
        try {
            const date = new Date();
            const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
            const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

            const income = await this.orderModel.aggregate([
                {
                    $match: { 
                        createdAt: { $gte: previousMonth }
                    },
                },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        sales: "$amount",
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: "$sales" },
                    },
                },
            ]);

            return { income };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

};
