// load in environment variables
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const bodyparser = require('body-parser');
const { addRoutes } = require('./routes');
const { appConfig } = require('./config');
const { getModuleLogger } = require('./utils');

const logger = getModuleLogger(module);
const app = express();

// always allow CORS requests
app.use(cors({ origin: true }));
// for parsing form arguments of POST requests
app.use(bodyparser.json());

// set up API endpoints
addRoutes(app);

// default error handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => { /* eslint-enable no-unused-vars */
  logger.error(err.stack);
  res.status(500).send('Server error');
});

// start accepting requests
app.listen(
  appConfig.port,
  () => logger.info(`Listening on port ${appConfig.port}!`),
);
