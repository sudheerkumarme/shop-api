import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import AuthService from "@/services/auth";
import { IUserInputDTO } from "@/interfaces/IUser";
import middleware from "../middlewares";
import { celebrate, Joi } from "celebrate";
import { Logger } from "winston";

const route = Router();

export default (app: Router) => {
    app.use("/auth", route);

    route.post(
        "/signup", 
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
            })
        }),
        async(req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get("logger");
            try {
                const authServiceInstance = Container.get(AuthService);
                const { user, token } = await authServiceInstance.SingUp(req.body as IUserInputDTO);
                return res.status(201).json({ user, token });
            } catch (error) {
                logger.error("🔥 error: %o", error);
                return next(error);
            }
        },
    );

    route.post(
        "/signin",
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            })
        }),
        async(req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get("logger");
            try {
                const { email, password } = req.body
                const authServiceInstance = Container.get(AuthService);
                const { user, token } = await authServiceInstance.SingIn(email, password);
                // TODO: Add user to redis
                return res.json({ user, token }).status(200);
            } catch (error) {
                logger.error("🔥 error: %o", error);
                return next(error);
            }
        },
    );

    route.post(
        "/logout",
        middleware.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get("logger");
            try {
                // TODO: Remove user from redis
                return res.status(200).end();
            } catch (error) {
                logger.error("🔥 error: %o", error);
                return next(error);
            }
        },
    )

}

