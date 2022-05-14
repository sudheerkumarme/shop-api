import { Router, Request, Response, NextFunction } from 'express';
import middleware from '../middlewares';
import { Container } from 'typedi';
import OrderService from '@/services/order';
import { IOrderInputDTO } from '@/interfaces/IOrder';
import { Logger } from 'winston';
const route = Router();

export default (app: Router) => {
    app.use('/orders', route);

    route.post(
        '/',
        middleware.isAuth,
        middleware.hasAccess(true, []),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const orderServiceInstance = Container.get(OrderService);
                const order = await orderServiceInstance.CreateOrder(req.body as IOrderInputDTO);
                return res.status(200).json(order);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.put(
        '/:id',
        middleware.isAuth,
        middleware.hasAccess(true, []),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const orderServiceInstance = Container.get(OrderService);
                const order = await orderServiceInstance.UpdateOrder(req.params.id as string, req.body as IOrderInputDTO);
                return res.status(200).json(order);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.delete(
        '/:id',
        middleware.isAuth,
        middleware.hasAccess(true, []),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const orderServiceInstance = Container.get(OrderService);
                const data = await orderServiceInstance.DeleteOrder(req.params.id as string);
                return res.status(200).json(data);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/income',
        middleware.isAuth,
        middleware.hasAccess(false, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const orderServiceInstance = Container.get(OrderService);
                const { income } = await orderServiceInstance.GetIncome();
                return res.status(200).json(income);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/:id',
        middleware.isAuth,
        middleware.hasAccess(true, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const orderServiceInstance = Container.get(OrderService);
                const order = await orderServiceInstance.GetOrder(req.params.id as string);
                return res.status(200).json(order);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/',
        middleware.isAuth,
        middleware.hasAccess(true, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const orderServiceInstance = Container.get(OrderService);
                const { orders, orderCount } = await orderServiceInstance.GetAllOrders(req.body.userId as string, req.query.limit as string, req.query.lastOrderId as string);
                return res.status(200).json({ orders, orderCount });
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );
    
};