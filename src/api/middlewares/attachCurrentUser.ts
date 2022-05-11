import { Container } from 'typedi';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const Logger: Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(req.token._id);
    if (!userRecord) {
      return res.sendStatus(401);
    }
    const currentUser = JSON.parse(JSON.stringify(userRecord));
    Reflect.deleteProperty(currentUser, 'password');
    Reflect.deleteProperty(currentUser, 'salt');
    req.currentUser = currentUser;
    return next();
  } catch (error) {
    Logger.error('🔥 Error attaching user to req: %o', error);
    return next(error);
  }
};

export default attachCurrentUser;
