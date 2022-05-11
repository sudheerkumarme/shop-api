import { Service, Inject } from "typedi";
import jwt from "jsonwebtoken";
import config from '@/config';
import { randomBytes, pbkdf2Sync } from "crypto";
import { IUser, IUserInputDTO } from "@/interfaces/IUser";

@Service()
export default class AuthService {
    constructor(
        @Inject("userModel") private userModel: Models.UserModel,
        @Inject("logger") private logger
    ){};

    public async SingUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string}>{
        try {
            const salt = randomBytes(32).toString('hex');
            const password =  pbkdf2Sync(userInputDTO.password, salt, 1000, 64, 'sha512').toString("hex");

            const userRecord = await this.userModel.create({
                ...userInputDTO,
                salt,
                password,
            });

            if(!userRecord) {
                throw new Error('User cannot be created');
            }

            // TODO: Send welcome email
            
            const token = this.generateToken(userRecord);

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, "password");
            Reflect.deleteProperty(user, "salt");

            return { user, token };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async SingIn(email: string, password: string): Promise<{ user: IUser, token: string }> {
        try {
            const userRecord  = await this.userModel.findOne({ email });
            if(!userRecord){
                throw new Error("User not registered");
            }

            const hashedPassword = pbkdf2Sync(password, userRecord.salt, 1000, 64, 'sha512').toString("hex");
            if(userRecord.password !== hashedPassword){
                throw new Error("Invalid Password");
            }

            const token = this.generateToken(userRecord);

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, "password");
            Reflect.deleteProperty(user, "salt");

            return { user, token };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    private generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 30);

        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
                name: user.name,
                exp: exp.getTime() / 1000,
            },
            config.jwtSecret,
            {
                algorithm: config.jwtAlgorithm || "HS256"
            }
        );

        return token;
    }

};
