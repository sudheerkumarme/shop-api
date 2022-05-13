import { Router, Request, Response, NextFunction } from 'express';
import middleware from '../middlewares';
import { Container } from 'typedi';
import UserService from '@/services/user';
import { IUserInputDTO } from '@/interfaces/IUser';
import { Logger } from 'winston';
const route = Router();

export default (app: Router) => {
    app.use('/users', route);

    route.get(
        '/me',
        middleware.isAuth,
        middleware.attachCurrentUser,
        (req: Request, res: Response) => {
            return res.json({ user: req.currentUser }).status(200);
        },
    );

    route.put(
        '/:userId',
        middleware.isAuth,
        middleware.hasAccess(true, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const userServiceInstance = Container.get(UserService);
                const user = await userServiceInstance.UpdateUser(req.params.userId as string, req.body as IUserInputDTO);
                return res.status(200).json(user);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/stats',
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                console.log("In stats API")
                console.log(req)
                const userServiceInstance = Container.get(UserService);
                const data = await userServiceInstance.GetStats();
                return res.status(200).json(data);
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
                const userServiceInstance = Container.get(UserService);
                const { users, userCount } = await userServiceInstance.GetAllUsers(req.query.limit as string, req.query.lastUserId as string);
                return res.status(200).json({ users, userCount });
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

    route.get(
        '/:userId',
        middleware.isAuth,
        middleware.hasAccess(false, ['admin']),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const userServiceInstance = Container.get(UserService);
                const user = await userServiceInstance.GetUserById(req.params.userId as string);
                return res.status(200).json(user);
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );
    
};