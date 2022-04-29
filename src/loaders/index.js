const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");
// const dependencyInjectorLoader = require('./dependencyInjector');
const Logger = require('./logger');
// const jobsLoader = require('./jobs');

module.exports = async (app) => {
    const mongooseConnection = await mongooseLoader();
    Logger.info('✌️ Database loaded!');

    // const userModel = {
    //     name: 'userModel',
    //     model: require('../models/user'),
    // };

    // It returns the agenda instance because it's needed in the subsequent loaders
    // const { agenda } = await dependencyInjectorLoader({
    //     mongooseConnection,
    //     models: [
    //         userModel,
    //     ],
    // });
    // Logger.info('✌️ Dependency Injector loaded');

    // await jobsLoader(agenda);
    // Logger.info('✌️ Jobs loaded');

    await expressLoader(app);
    Logger.info('✌️ Express loaded!');
};
