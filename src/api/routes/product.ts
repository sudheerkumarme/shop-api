import { Router, Request, Response, NextFunction } from 'express';
import middleware from '../middlewares';
import { Container } from 'typedi';
import ProductService from '@/services/product';
import { IProductInputDTO } from '@/interfaces/IProduct';
import { Logger } from 'winston';
const route = Router();

export default (app: Router) => {
    app.use('/products', route);

    route.post(
        '/',
        middleware.isAuth,
        middleware.hasAccess(false, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const productServiceInstance = Container.get(ProductService);
                const product = await productServiceInstance.CreateProduct(req.body as IProductInputDTO);
                return res.status(200).json(product);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.put(
        '/:id',
        middleware.isAuth,
        middleware.hasAccess(false, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const productServiceInstance = Container.get(ProductService);
                const product = await productServiceInstance.UpdateProduct(req.params.id as string, req.body as IProductInputDTO);
                return res.status(200).json(product);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.delete(
        '/:id',
        middleware.isAuth,
        middleware.hasAccess(false, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const productServiceInstance = Container.get(ProductService);
                const data = await productServiceInstance.DeleteProduct(req.params.id as string);
                return res.status(200).json(data);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const productServiceInstance = Container.get(ProductService);
                const product = await productServiceInstance.GetProductById(req.params.id as string);
                return res.status(200).json(product);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/',
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const productServiceInstance = Container.get(ProductService);
                const { products, productCount } = await productServiceInstance.GetAllProducts(req.query.limit as string, req.query.lastProductId as string, req.query.category as string);
                return res.status(200).json({ products, productCount });
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );
    
};