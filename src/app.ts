import 'reflect-metadata'; // We need this in order to use @Decorators
import express from "express";
const app = express();

const startServer = async () => {
    await require('./loaders').default({ expressApp: app });
};

startServer();

export default app;