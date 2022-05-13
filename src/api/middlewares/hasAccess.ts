import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { HttpStatusMessage, HttpStatusCode } from '@/config/constants';

const hasAccess = (matchId: boolean, permissions: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const Logger: Logger = Container.get('logger');
        try {
            if (matchId && (req.token._id === req.params.userId || req.token._id === req.query.userId || req.token._id === req.body.userId) || permissions.includes('admin') && req.token.role === 'admin') return next();
            else if (permissions.includes(req.token.role)) return next();
            else return res.status(HttpStatusCode.FORBIDDEN).json({ message: HttpStatusMessage.NOT_ALLOWED });
        } catch (error) {
            Logger.error('🔥 Error attaching user to req: %o', error);
            return next(error);
        }
    };
};

export default hasAccess;
