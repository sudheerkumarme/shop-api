import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import Stripe from 'stripe';
import config from '@/config';
import { Logger } from 'winston';
const route = Router();

const stripe = new Stripe(config.stripeSecret, {
    apiVersion: '2020-08-27',
});

export default (app: Router) => {
    app.use('/checkout', route);

    route.post(
        '/payment',
        async (req: Request, res: Response, next: NextFunction) => {
            const logger: Logger = Container.get('logger');
            try {
                const chargeCard = await stripe.charges.create(
                    {
                      source: req.body.tokenId,
                      amount: req.body.amount,
                      currency: "usd",
                    },
                );
                res.send(200).json(chargeCard)
            } catch (error) {
                logger.error('🔥 error: %o', error);
                return next(error);
            }
        },
    );

};