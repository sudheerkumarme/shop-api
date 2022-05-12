import Logger from './src/loaders/logger';
import config from './src/config'
import app from './src/app';

app.listen(config.port, () => {
  Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
}).on('error', (err) => {
  Logger.error(err);
  process.exit(1);
});
