import { Router } from 'express';
import user from './routes/user';
import auth from './routes/auth';
import product from './routes/product';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	product(app);

	return app
}