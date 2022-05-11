import Container from 'typedi';
import { Logger } from 'winston';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, RESPONSE_STATUS } from '@/config/constants';

const apisToBeByPassed = [];
const headerTokenAPIs = [];

/**
 * Attach token to req.token
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const logger: Logger = Container.get('logger');
  try {
    let token = null;
    if (apisToBeByPassed.indexOf(req.path) >= 0) return next();
    if (headerTokenAPIs.indexOf(req.path) >= 0) token = req.query.token;
    else token = req.headers.authorization;

    if (!token) return res.status(RESPONSE_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.TOKEN_NOT_FOUND });

    token = token.split(' ');
    token = token.length > 1 ? token[1] : token[0];

    const decoded = jwt.verify(token, config.jwtSecret);
    req.token = { ...decoded };

    return next();
  } catch (error) {
    logger.error(error);
    return res.status(RESPONSE_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.TOKEN_SESSION_EXPIRED });
  }
};

export default isAuth;
