const winston = require('winston');
require('express-async-errors');

module.exports = function() {
    winston.add(new winston.transports.Console());
    process.on('uncaughtException', (ex) => {
        winston.error(ex);
        process.exit(1);
      });
      
      process.on('unhandledRejection', (ex) => {
        winston.error(ex);
        process.exit(1);
      });  
};