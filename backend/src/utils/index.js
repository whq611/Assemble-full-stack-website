const crypto = require('crypto');
const { createLogger, format, transports } = require('winston');

function getPasswordHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getModuleLogger(mod) {
  const fmt = format.combine(
    format.label({ label: mod.filename, message: true }),
    format.colorize(),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.align(),
    format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
  );
  return createLogger({
    transports: new transports.Console({ format: fmt }),
  });
}

module.exports = {
  getPasswordHash,
  getModuleLogger,
};
