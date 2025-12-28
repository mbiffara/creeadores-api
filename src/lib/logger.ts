import util from 'node:util';
import { env } from '../config/env';

type Level = 'debug' | 'info' | 'warn' | 'error';
type Meta = Record<string, unknown> | undefined;

const priorities: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

class Logger {
  constructor(private readonly level: Level) {}

  private shouldLog(level: Level) {
    return priorities[level] >= priorities[this.level];
  }

  private format(meta?: Meta) {
    if (!meta || Object.keys(meta).length === 0) {
      return '';
    }
    return util.inspect(meta, { depth: 5, colors: false, breakLength: Infinity });
  }

  log(level: Level, message: string, meta?: Meta) {
    if (!this.shouldLog(level)) {
      return;
    }

    const formatted = this.format(meta);
    const payload = formatted ? `${message} ${formatted}` : message;

    switch (level) {
      case 'debug':
        console.debug(payload);
        break;
      case 'info':
        console.info(payload);
        break;
      case 'warn':
        console.warn(payload);
        break;
      case 'error':
      default:
        console.error(payload);
        break;
    }
  }

  debug(message: string, meta?: Meta) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Meta) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Meta) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Meta) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger(env.LOG_LEVEL);
