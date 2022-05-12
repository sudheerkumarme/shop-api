import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { HttpStatusMessage, HttpStatusCode } from '@/config/constants';

const hasAccess = (matchId: boolean, permissions: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const Logger: Logger = Container.get('logger');
        try {
            if ((matchId && req.token._id === req.params.id) || req.query.id) return next();
            else if (permissions.includes(req.token.role)) return next();
            else return res.status(HttpStatusCode.FORBIDDEN).json({ message: HttpStatusMessage.NOT_ALLOWED });
        } catch (error) {
            Logger.error('🔥 Error attaching user to req: %o', error);
            return next(error);
        }
    };
};

export default hasAccess;
