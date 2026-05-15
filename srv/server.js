const cds = require('@sap/cds')
const cors = require('cors')

cds.on('bootstrap', app => {
    console.log('BOOTSTAP');
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Content-Disposition']
  }))
})

module.exports = cds.server