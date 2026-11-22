export class Logger {
  static info(message: string, data?: unknown) {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  static error(message: string, error?: unknown) {
    console.error(`[ERROR] ${message}`, error ? JSON.stringify(error, null, 2) : '');
  }

  static warn(message: string, data?: unknown) {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  static debug(message: string, data?: unknown) {
    if (process.env.DEBUG) {
      console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
}
