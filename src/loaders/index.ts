import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
// import jobsLoader from './jobs';

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    Logger.info('✌️ Database loaded!');

    const userModel = {
        name: 'userModel',
        model: require('../models/user').default,
    };

    // It returns the agenda instance because it's needed in the subsequent loaders
    const { agenda } = await dependencyInjectorLoader({
        mongoConnection,
        models: [
            userModel,
        ],
    });
    Logger.info('✌️ Dependency Injector loaded');

    // await jobsLoader({ agenda });
    // Logger.info('✌️ Jobs loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded!');
};
