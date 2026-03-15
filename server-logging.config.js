/**
 * Конфигурация серверного логирования для терминала
 * Перехватывает console методы и делает их красивыми
 */

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // ANSI цвета
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
  };

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;
  const originalDebug = console.debug;

  function getTimestamp() {
    return new Date().toISOString().split('T')[1].replace('Z', '');
  }

  console.log = function (...args) {
    const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
    originalLog(timestamp, ...args);
  };

  console.error = function (...args) {
    const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
    const label = `${colors.red}${colors.bright}[ERROR]${colors.reset}`;
    originalError(timestamp, label, ...args);
  };

  console.warn = function (...args) {
    const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
    const label = `${colors.yellow}${colors.bright}[WARN]${colors.reset}`;
    originalWarn(timestamp, label, ...args);
  };

  console.info = function (...args) {
    const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
    const label = `${colors.cyan}${colors.bright}[INFO]${colors.reset}`;
    originalInfo(timestamp, label, ...args);
  };

  console.debug = function (...args) {
    const timestamp = `${colors.gray}[${getTimestamp()}]${colors.reset}`;
    const label = `${colors.magenta}${colors.bright}[DEBUG]${colors.reset}`;
    originalDebug(timestamp, label, ...args);
  };

  console.log(`${colors.cyan}${colors.bright}[DEV MODE]${colors.reset} ${colors.green}Terminal logging enabled${colors.reset}`);
}

export {};
