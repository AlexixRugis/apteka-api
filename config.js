const config = require("config");

// загрузка конфигурации
const serverPort = config.get("port");
const dbFileName = config.get("db");

module.exports = {
    serverPort,
    dbFileName
};