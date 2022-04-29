const Logger = require("./src/loaders/logger");
const config = require("./src/config");
const app = require("./src/app");

app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
}).on("error", (err) => {
    Logger.error(err);
    process.exit(1);
});
