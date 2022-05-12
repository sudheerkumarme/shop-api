import express from 'express';
import cors from 'cors';
import routes from '@/api';
import config from '@/config';
import morgan from 'morgan';
import { LoggerStream } from './logger';

export default ({ app }: { app: express.Application }) => {
    // API Logger
    app.use(morgan(process.env.NODE_ENV !== 'development' ? 'combined' : 'dev', { stream: new LoggerStream() }));

    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.enable('trust proxy');

    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // Transforms the raw string of req.body into json
    app.use(express.json());

    // Load API routes
    app.use(config.api.prefix, routes());

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    // error handler
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
            },
        });
    });
}