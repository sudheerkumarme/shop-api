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
                    ...(lastUserId && { _id: { $lt: lastUserId } })
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

    public async GetStats(): Promise<{ data: Object }> {
        try {
            const date = new Date();
            const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
            console.log(date);
            console.log(lastYear);

            const data = await this.userModel.aggregate([
                {   
                    $match: { 
                        createdAt: { $gte: lastYear } 
                    },
                },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: 1 },
                    },
                },
            ])

            console.log(data)
            
            return { data };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

};
