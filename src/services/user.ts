import { Service, Inject } from 'typedi';
// import { randomBytes, pbkdf2Sync } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { HttpStatusCode } from '@/config/constants';
import { APIError } from '@/loaders/errors';

@Service()
export default class UserService {
    constructor(
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('logger') private logger
    ) { };

    public async UpdateUser(id: string, userInputDTO: IUserInputDTO): Promise<{ user: IUser; }> {
        try {
            const userRecord = await this.userModel.findByIdAndUpdate(id, {
                $set: userInputDTO,
            }, { new: true });

            if (!userRecord) {
                throw new APIError(HttpStatusCode.SERVER_ERROR, 'User cannot be updated');
            }

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');

            return { user };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetUserById(id: string): Promise<{ user: IUser; }> {
        try {
            const userRecord = await this.userModel.findById(id);

            if (!userRecord) {
                throw new APIError(HttpStatusCode.NOT_FOUND, 'User not found');
            }

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');

            return { user };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    public async GetAllUsers(limit: string, lastUserId: string): Promise<{ users: Array<IUser>; userCount: Number }> {
        try {
            const userLimit = parseInt(limit);

            const userCount = await this.userModel.countDocuments();
            if (userCount === 0) {
                return { users: [], userCount: 0 };
            }

            const users = await this.userModel.find(
                {
                    ...(lastUserId && { createdAt: { $lt: lastUserId } })
                }, {
                password: 0,
                salt: 0
            }
            ).sort({ _id: -1 }).limit(userLimit);

            return { users, userCount };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

};
