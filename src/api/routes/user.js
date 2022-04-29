const { Router, Request, Response } = require('express');
// import middlewares from '../middlewares';
const route = Router();

module.exports = (app) => {
    app.use('/users', route);

//   route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
//     return res.json({ user: req.currentUser }).status(200);
//   });
    route.get('/me', (req, res) => {
        return res.json({ user: { name: "Sudheer" } }).status(200);
    })
};