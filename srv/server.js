const cds = require('@sap/cds')
const cors = require('cors')
const {logger} = require('./utils/logger')


cds.on('bootstrap', app => {

  logger.info('SAP BTP')
  logger.info('CAP bootstrap started')
  logger.warn('Bootstrap hook executed')

  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Content-Disposition']
  }))
})

module.exports = cds.server