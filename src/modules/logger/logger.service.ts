import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
	private readonly logger: winston.Logger;

	constructor() {
		// Console logging format
		const consoleLogFormat = winston.format.printf(
			({ level, message, timestamp, ...meta }) => {
				return '------------------------------------------------------------------------\n' +
					`[${level}] [${timestamp}]\n` +
					`${message}\n` +
					`${JSON.stringify(meta, undefined, 2)}\n` +
					'------------------------------------------------------------------------';
			}
		);

		const transports : winston.transport[] = [];

		const fileTransport = new winston.transports.DailyRotateFile({
			dirname: './logs/',
			filename: '%DATE%.log',
			datePattern: 'YYYY-MM-DD_HH:mm',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '30d',
		});
		transports.push(fileTransport);

		// Only define console logging in non-production environments
		if (process.env.NODE_ENV !== 'production') {
			const consoleTransport = new winston.transports.Console({
				level: 'debug',
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.simple(),
					consoleLogFormat,
				),
			});
			transports.push(consoleTransport);
		}

		// Winston Logger configuration
		this.logger = winston.createLogger({
			// Default level and format for file logs
			// Console logs have their own level and format
			level: 'debug',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
			),

			transports: transports,
		});
	}

	/**
	* @summary Logs an error
	* 
	* @example
	* ```typescript
	* loggerService.error("Message", { info: "someInfo" }, { someMetadata: { a: 123 } }
	* );
	* ```
	* 
	* This will the following on file
	* ```json
	* {
	*   "0":{
	*     "info":"someInfo"
	*   },
	*   "1":{
	*     "someMetadata":{
	*       "a":123
	*     }
	*   },
	*   "level":"error",
	*   "message":"Message",
	*   "timestamp":"2024-12-19T11:54:32.930Z"
	* }
	* ```
	* 
	* And following on console
	* ```
	* [error] [2024-12-19T11:56:26.995Z]
	* Message
	* {
	*   "0": {
	*     "info": "someInfo"
	*   },
	*   "1": {
	*     "someMetadata": {
	*       "a": 123
	*     }
	*   }
	* }
	* ```
	* @param message - a string message describing the log context (e.g., "Incoming Request").
	* @param meta - Additional metadata objects (optional, logged as structured data).
	*/
	error(message: string, ...meta: any[]) {
		this.logger.error(message, meta);
	}

	/**
	* @summary Logs an warning
	* 
	* @example
	* ```typescript
	* loggerService.warn("Message", { info: "someInfo" }, { someMetadata: { a: 123 } }
	* );
	* ```
	* 
	* This will the following on file
	* ```json
	* {
	*   "0":{
	*     "info":"someInfo"
	*   },
	*   "1":{
	*     "someMetadata":{
	*       "a":123
	*     }
	*   },
	*   "level":"warn",
	*   "message":"Message",
	*   "timestamp":"2024-12-19T11:54:32.930Z"
	* }
	* ```
	* 
	* And following on console
	* ```
	* [warn] [2024-12-19T11:56:26.995Z]
	* Message
	* {
	*   "0": {
	*     "info": "someInfo"
	*   },
	*   "1": {
	*     "someMetadata": {
	*       "a": 123
	*     }
	*   }
	* }
	* ```
	* @param message - a string message describing the log context (e.g., "Incoming Request").
	* @param meta - Additional metadata objects (optional, logged as structured data).
	*/
	warn(message: string, ...meta: any[]) {
		this.logger.warn(message, meta);
	}

	/**
	* @summary Logs an debug info
	* 
	* @example
	* ```typescript
	* logger.debug("Message", { info: "someInfo" }, { someMetadata: { a: 123 } }
	* );
	* ```
	* 
	* This will the following on file
	* ```json
	* {
	*   "0":{
	*     "info":"someInfo"
	*   },
	*   "1":{
	*     "someMetadata":{
	*       "a":123
	*     }
	*   },
	*   "level":"debug",
	*   "message":"Message",
	*   "timestamp":"2024-12-19T11:54:32.930Z"
	* }
	* ```
	* 
	* And following on console
	* ```
	* [debug] [2024-12-19T11:56:26.995Z]
	* Message
	* {
	*   "0": {
	*     "info": "someInfo"
	*   },
	*   "1": {
	*     "someMetadata": {
	*       "a": 123
	*     }
	*   }
	* }
	* ```
	* @param message - a string message describing the log context (e.g., "Incoming Request").
	* @param meta - Additional metadata objects (optional, logged as structured data).
	*/
	debug(message: string, ...meta: any[]) {
		this.logger.debug(message, meta);
	}

	/**
	* @summary Logs an general info
	* 
	* @example
	* ```typescript
	* logger.info("Message", { info: "someInfo" }, { someMetadata: { a: 123 } }
	* );
	* ```
	* 
	* This will the following on file
	* ```json
	* {
	*   "0":{
	*     "info":"someInfo"
	*   },
	*   "1":{
	*     "someMetadata":{
	*       "a":123
	*     }
	*   },
	*   "level":"info",
	*   "message":"Message",
	*   "timestamp":"2024-12-19T11:54:32.930Z"
	* }
	* ```
	* 
	* And following on console
	* ```
	* [info] [2024-12-19T11:56:26.995Z]
	* Message
	* {
	*   "0": {
	*     "info": "someInfo"
	*   },
	*   "1": {
	*     "someMetadata": {
	*       "a": 123
	*     }
	*   }
	* }
	* ```
	* @param message - a string message describing the log context (e.g., "Incoming Request").
	* @param meta - Additional metadata objects (optional, logged as structured data).
	*/
	log(message: string, ...meta: any[]) {
		this.logger.info(message, meta);
	}
}
