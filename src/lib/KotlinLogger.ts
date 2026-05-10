// src/lib/KotlinLogger.ts

export enum LogLevel {
  VERBOSE = 2,
  DEBUG = 3,
  INFO = 4,
  WARN = 5,
  ERROR = 6,
  ASSERT = 7
}

class KotlinLogger {
  private level: LogLevel = LogLevel.VERBOSE;
  private logListeners: ((logStr: string) => void)[] = [];
  private remoteEndpoint: string | null = null;

  constructor() {}

  public addListener(listener: (logStr: string) => void) {
    this.logListeners.push(listener);
  }

  public removeListener(listener: (logStr: string) => void) {
    this.logListeners = this.logListeners.filter(l => l !== listener);
  }

  public setWebLoggerEndpoint(url: string) {
    this.remoteEndpoint = url;
  }

  private dispatchLog(levelTag: string, tag: string, message: string, error?: any) {
    const errStr = error ? `\n${error.stack || error}` : '';
    const logStr = `[${levelTag}] ${tag}: ${message}${errStr}`;
    
    this.logListeners.forEach(listener => listener(logStr));
    
    if (this.remoteEndpoint) {
       // Fire and forget remote log
       fetch(this.remoteEndpoint, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ content: logStr })
       }).catch(() => {});
    }

    // Also send to actual console depending on level
    if (levelTag === 'E' || levelTag === 'wtf') console.error(logStr);
    else if (levelTag === 'W') console.warn(logStr);
    else if (levelTag === 'I') console.info(logStr);
    else if (levelTag === 'V' || levelTag === 'D') console.log(logStr);
  }

  v(tag: string, msg?: string) {
    if (msg === undefined) { msg = tag; tag = 'Log'; }
    if (this.level <= LogLevel.VERBOSE) this.dispatchLog('V', tag, msg);
  }

  d(tag: string, msg?: string) {
    if (msg === undefined) { msg = tag; tag = 'Log'; }
    if (this.level <= LogLevel.DEBUG) this.dispatchLog('D', tag, msg);
  }

  i(tag: string, msg?: string) {
    if (msg === undefined) { msg = tag; tag = 'Log'; }
    if (this.level <= LogLevel.INFO) this.dispatchLog('I', tag, msg);
  }

  w(tag: string, msg?: string) {
    if (msg === undefined) { msg = tag; tag = 'Log'; }
    if (this.level <= LogLevel.WARN) this.dispatchLog('W', tag, msg);
  }

  e(tag: string, errorOrMsg: any, error?: any) {
    if (typeof errorOrMsg === 'string') {
      if (this.level <= LogLevel.ERROR) this.dispatchLog('E', tag, errorOrMsg, error);
    } else {
      if (this.level <= LogLevel.ERROR) this.dispatchLog('E', 'Log', tag, errorOrMsg);
    }
  }

  iSync(tag: string, msg?: string) {
    // Synchronous placeholder for compatibility
    this.i(tag, msg);
  }

  // API equivalents to the provided README
  initialise() {
    this.i("KotlinLogger", "Logger initialized hidden in React");
  }

  useUncheckedErrorHandler() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.e('UncaughtException', event.message, event.error);
      });
      window.addEventListener('unhandledrejection', (event) => {
        this.e('UnhandledRejection', String(event.reason));
      });
    }
  }

  logMetadata() {
    if (typeof navigator !== 'undefined') {
      this.i('System', `User Agent: ${navigator.userAgent}`);
      this.i('System', `Language: ${navigator.language}`);
      this.i('System', `Platform: ${navigator.platform}`);
      this.i('System', `Host: ${window.location.hostname}`);
      
      // Fetch IP for tracking clones
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          this.i('System', `Network IP: ${data.ip}`);
        })
        .catch(() => this.e('System', 'Failed to fetch IP'));
    }
  }
}

export const Log = new KotlinLogger();

// Expose globally for hidden usage
if (typeof window !== 'undefined') {
  (window as any).Log = Log;
}
