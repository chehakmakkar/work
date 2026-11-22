export class Logger {
    static info(message, data) {
        console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
    static error(message, error) {
        console.error(`[ERROR] ${message}`, error ? JSON.stringify(error, null, 2) : '');
    }
    static warn(message, data) {
        console.warn(`[WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
    static debug(message, data) {
        if (process.env.DEBUG) {
            console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    }
}
