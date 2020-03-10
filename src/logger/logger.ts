import winston, { format, transports } from 'winston';
import { FileTransportInstance } from 'winston/lib/winston/transports';

const { combine, timestamp, label, printf } = format;
const { File } = transports;

const isProd = process.env.NODE_ENV === 'production';
const isDebug = process.env.DEBUG === 'true';

type Service = 'main' | 'database' | 'app';
type Level = 'error' | 'warn' | 'info';

export class Logger {
    private format: any;
    private logger: winston.Logger | null = null;
    private combinedFileLogger: FileTransportInstance;
    private errorFileLogger: FileTransportInstance;

    constructor(service: Service) {
        const logFormat = printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        });

        this.format = combine(
            label({ label: service.toUpperCase() }),
            timestamp(),
            logFormat
            
            // winston.format.json()
        );

        this.errorFileLogger = isProd
            ? new File({
                  filename: 'logs/error.log',
                  level: 'error',
              })
            : new File({
                  filename: 'logs/error.dev.log',
                  level: 'error',
              });

        this.combinedFileLogger = isProd
            ? new File({ filename: 'logs/combined.log', format: this.format })
            : new File({
                  filename: 'logs/combined.dev.log',
                  format: this.format,
              });

        this.logger = this.create();
    }

    public error(message: string, meta: any = [], cb?: () => any) {
        this.logger?.error(message, ...meta, cb);
    }

    public warn(message: string, meta: any = [], cb?: () => any) {
        this.logger?.warn(message, ...meta, cb);
    }

    public info(message: string, meta: any = [], cb?: () => any) {
        this.logger?.info(message, ...meta, cb);
    }

    public debug(message: string, meta: any = [], cb?: () => any) {
        this.logger?.debug(message, ...meta, cb);
    }

    public log(level: Level, message: string, meta: any = [], cb?: () => any) {
        this.logger?.log(level, message, ...meta, cb);
    }

    private create(): winston.Logger {
        if (this.logger === null) {
            this.logger = winston.createLogger({
                format: this.format,
                transports: [this.errorFileLogger, this.combinedFileLogger],
            });

            if (!isProd && isDebug) {
                this.logger.add(
                    new winston.transports.Console({
                        format: winston.format.simple(),
                    })
                );
            }
        }

        return this.logger;
    }
}
