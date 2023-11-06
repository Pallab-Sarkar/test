import { createLogger, transports, format } from 'winston';

//Winston instance
const customerLogger = createLogger({
    transports: [
        new transports.File({
            filename: 'Error.log',
            level: 'error',
        })
    ],
    format: format.combine(format.timestamp(), format.json(), format.prettyPrint())
})

  //Console loggging the error
if (process.env.NODE_ENV !== 'production') {
    customerLogger.add(new transports.Console({
      format: format.combine(format.timestamp(), format.json(), format.prettyPrint())
    }));
  }

export default customerLogger
