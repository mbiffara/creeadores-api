type Level = 'debug' | 'info' | 'warn' | 'error';
type Meta = Record<string, unknown> | undefined;
declare class Logger {
    private readonly level;
    constructor(level: Level);
    private shouldLog;
    private format;
    log(level: Level, message: string, meta?: Meta): void;
    debug(message: string, meta?: Meta): void;
    info(message: string, meta?: Meta): void;
    warn(message: string, meta?: Meta): void;
    error(message: string, meta?: Meta): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map