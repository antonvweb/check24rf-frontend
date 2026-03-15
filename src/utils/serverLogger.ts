/**
 * Server-side Logger
 * Логирование для серверной части Next.js (выводится в терминал)
 */

const isDev = process.env.NODE_ENV === 'development';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

class ServerLogger {
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().split('T')[1].replace('Z', '');
  }

  private shouldLog(): boolean {
    return isDev;
  }

  private formatData(data: unknown): string {
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  }

  api = {
    request: (method: string, url: string, data?: unknown) => {
      if (!this.shouldLog()) return;

      const methodColors: Record<string, string> = {
        GET: colors.green,
        POST: colors.blue,
        PUT: colors.yellow,
        PATCH: colors.yellow,
        DELETE: colors.red,
      };

      const color = methodColors[method.toUpperCase()] || colors.white;

      console.log('');
      console.log(
        `${colors.cyan}${colors.bright}[${this.getTimestamp()}]${colors.reset} ` +
        `${colors.bright}→ API Request${colors.reset}`
      );
      console.log(
        `  ${color}${colors.bright}${method.toUpperCase()}${colors.reset} ${colors.dim}${url}${colors.reset}`
      );

      if (data) {
        console.log(`${colors.gray}  Body:${colors.reset}`);
        console.log(this.formatData(data));
      }
    },

    response: (method: string, url: string, status: number, data?: unknown) => {
      if (!this.shouldLog()) return;

      const statusColor = status >= 200 && status < 300 ? colors.green : colors.red;

      console.log(
        `${colors.cyan}${colors.bright}[${this.getTimestamp()}]${colors.reset} ` +
        `${colors.bright}← API Response${colors.reset}`
      );
      console.log(
        `  ${colors.dim}${method.toUpperCase()}${colors.reset} ${colors.dim}${url}${colors.reset} ` +
        `${statusColor}${colors.bright}[${status}]${colors.reset}`
      );

      if (data) {
        console.log(`${colors.gray}  Data:${colors.reset}`);
        const dataStr = this.formatData(data);
        if (dataStr.length > 500) {
          console.log(dataStr.substring(0, 500) + '...');
        } else {
          console.log(dataStr);
        }
      }
      console.log('');
    },

    error: (method: string, url: string, error: unknown) => {
      if (!this.shouldLog()) return;

      console.log('');
      console.log(
        `${colors.red}${colors.bright}[${this.getTimestamp()}] [ERROR] API Error${colors.reset}`
      );
      console.log(
        `  ${colors.dim}${method.toUpperCase()}${colors.reset} ${colors.dim}${url}${colors.reset}`
      );
      console.log(`${colors.red}  ${error}${colors.reset}`);

      if (error instanceof Error && error.stack) {
        console.log(`${colors.gray}${error.stack}${colors.reset}`);
      }
      console.log('');
    },
  };

  log(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(
      `${colors.blue}${colors.bright}[${this.getTimestamp()}] [LOG]${colors.reset}`,
      ...args
    );
  }

  info(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(
      `${colors.cyan}${colors.bright}[${this.getTimestamp()}] [INFO]${colors.reset}`,
      ...args
    );
  }

  warn(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(
      `${colors.yellow}${colors.bright}[${this.getTimestamp()}] [WARN]${colors.reset}`,
      ...args
    );
  }

  error(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(
      `${colors.red}${colors.bright}[${this.getTimestamp()}] [ERROR]${colors.reset}`,
      ...args
    );
  }

  success(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(
      `${colors.green}${colors.bright}[${this.getTimestamp()}] [SUCCESS]${colors.reset}`,
      ...args
    );
  }

  debug(...args: unknown[]) {
    if (!this.shouldLog()) return;
    console.log(
      `${colors.magenta}${colors.bright}[${this.getTimestamp()}] [DEBUG]${colors.reset}`,
      ...args
    );
  }

  group(label: string) {
    if (!this.shouldLog()) return;
    console.group(
      `${colors.cyan}${colors.bright}[${this.getTimestamp()}] ${label}${colors.reset}`
    );
  }

  groupEnd() {
    if (!this.shouldLog()) return;
    console.groupEnd();
  }

  separator(char: string = '─', length: number = 80) {
    if (!this.shouldLog()) return;
    console.log(`${colors.gray}${char.repeat(length)}${colors.reset}`);
  }

  banner() {
    if (!this.shouldLog()) return;
    console.log(`${colors.cyan}${colors.bright}[ЧЕК24.РФ Server Logger]${colors.reset} ${colors.green}Initialized${colors.reset}`);
  }
}

export const serverLogger = new ServerLogger();
