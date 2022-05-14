import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import product from './routes/product';
import cart from './routes/cart';
import order from './routes/order';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	product(app);
	cart(app);
	order(app);

	return app
}