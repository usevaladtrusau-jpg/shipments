const fs = require('fs')
const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')

const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true })

const maskHeaders = (headers) => ({
  ...headers,
  authorization: headers.authorization ? '[MASKED]' : undefined,
  cookie: headers.cookie ? '[MASKED]' : undefined
})

const date = new Date()
const fileDate = date.toISOString().slice(0, 10)
const filename = path.join(logsDir, `${fileDate}.txt`)

const fileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, '%DATE%.txt'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  zippedArchive: false
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`
    })
  ),
  transports: [
    fileTransport,
    new winston.transports.Console({
      level: 'warn',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`
        })
      )
    })
  ]
})

function logHttpIncoming(req, body) {
  const httpVersion = req.http?.req?.httpVersion || 'unknown'
  const method = req.method || 'unknown'
  const headers = maskHeaders(req.headers || {})
  const data = body !== undefined ? body : null

  logger.info(`HTTP_IN httpVersion=${httpVersion} method=${method} headers=${JSON.stringify(headers)} body=${JSON.stringify(data)}`)
}

module.exports = { logger, filename, logHttpIncoming }