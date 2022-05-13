import { Router, Request, Response, NextFunction } from 'express';
import middleware from '../middlewares';
import { Container } from 'typedi';
import CartService from '@/services/cart';
import { ICartInputDTO } from '@/interfaces/ICart';
import { Logger } from 'winston';
const route = Router();

export default (app: Router) => {
    app.use('/carts', route);

    route.post(
        '/',
        middleware.isAuth,
        middleware.hasAccess(true, []),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const cartServiceInstance = Container.get(CartService);
                const cart = await cartServiceInstance.CreateAndUpdateCart(req.body as ICartInputDTO);
                return res.status(200).json(cart);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.delete(
        '/:userId',
        middleware.isAuth,
        middleware.hasAccess(true, []),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const cartServiceInstance = Container.get(CartService);
                const data = await cartServiceInstance.DeleteCart(req.params.userId as string);
                return res.status(200).json(data);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/:userId',
        middleware.isAuth,
        middleware.hasAccess(true, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const cartServiceInstance = Container.get(CartService);
                const cart = await cartServiceInstance.GetUserCart(req.params.userId as string);
                return res.status(200).json(cart);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/',
        middleware.isAuth,
        middleware.hasAccess(false, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const cartServiceInstance = Container.get(CartService);
                const { carts, cartCount } = await cartServiceInstance.GetAllCarts(req.query.limit as string, req.query.lastProductId as string);
                return res.status(200).json({ carts, cartCount });
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );
    
};