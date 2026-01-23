/**
 * Production-safe logger utility
 * Suppresses console.log in production while keeping error logging
 */

const isDevelopment = process.env.NODE_ENV === 'development';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
}

/**
 * Creates a prefixed logger for a specific module/component
 * @param prefix - The prefix to add to all log messages (e.g., '[Navbar]', '[Cart]')
 */
export function createLogger(prefix: string): Logger {
  const formatArgs = (args: unknown[]) => [`${prefix}`, ...args];

  return {
    log: (...args: unknown[]) => {
      if (isDevelopment) {
        console.log(...formatArgs(args));
      }
    },
    info: (...args: unknown[]) => {
      if (isDevelopment) {
        console.info(...formatArgs(args));
      }
    },
    warn: (...args: unknown[]) => {
      if (isDevelopment) {
        console.warn(...formatArgs(args));
      }
    },
    // Errors are always logged, even in production
    error: (...args: unknown[]) => {
      console.error(...formatArgs(args));
    },
    debug: (...args: unknown[]) => {
      if (isDevelopment) {
        console.debug(...formatArgs(args));
      }
    },
    group: (label: string) => {
      if (isDevelopment) {
        console.group(`${prefix} ${label}`);
      }
    },
    groupEnd: () => {
      if (isDevelopment) {
        console.groupEnd();
      }
    },
    time: (label: string) => {
      if (isDevelopment) {
        console.time(`${prefix} ${label}`);
      }
    },
    timeEnd: (label: string) => {
      if (isDevelopment) {
        console.timeEnd(`${prefix} ${label}`);
      }
    },
  };
}

/**
 * Default logger without prefix
 */
export const logger: Logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
};

export default logger;
