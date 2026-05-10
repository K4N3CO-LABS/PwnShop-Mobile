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
  private pendingLogs: { levelTag: string, tag: string, message: string, error?: any }[] = [];
  private batchTimer: any = null;

  constructor() {}

  private globalIp = 'Loading...';

  public addListener(listener: (logStr: string) => void) {
    this.logListeners.push(listener);
  }

  public removeListener(listener: (logStr: string) => void) {
    this.logListeners = this.logListeners.filter(l => l !== listener);
  }

  public setWebLoggerEndpoint(url: string) {
    this.remoteEndpoint = url;
  }

  private flushLogs() {
    if (!this.remoteEndpoint || this.pendingLogs.length === 0) return;
    
    // Format logs right before sending so globalIp is updated
    const logsToSend = this.pendingLogs.map(p => {
        const errStr = p.error ? `\n${p.error.stack || p.error}` : '';
        return `[${p.levelTag}] [IP: ${this.globalIp}] ${p.tag}: ${p.message}${errStr}`;
    }).join('\n');
    
    this.pendingLogs = [];

    let payloadStr = logsToSend;
    if (payloadStr.length > 1900) {
       payloadStr = payloadStr.substring(0, 1900) + "\n...[TRUNCATED]";
    }

    // Method 1: sendBeacon (Bypasses many CORS issues natively)
    try {
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            const fd = new FormData();
            fd.append('payload_json', JSON.stringify({ content: payloadStr }));
            navigator.sendBeacon(this.remoteEndpoint, fd);
        }
    } catch(e) { console.error("Beacon failed", e); }

    // Method 2: Standard fetch with no-cors FormData
    try {
        const fd2 = new FormData();
        fd2.append('payload_json', JSON.stringify({ content: payloadStr }));
        fetch(this.remoteEndpoint, {
            method: 'POST',
            mode: 'no-cors',
            body: fd2
        }).catch(e => {});
    } catch(e) {}

    // Method 3: Invisible Form POST via iframe (Universal fallback)
    const iframeName = "logger_iframe_" + Date.now() + "_" + Math.floor(Math.random()*1000);
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.remoteEndpoint;
    form.target = iframeName;
    form.enctype = 'multipart/form-data';
    form.style.display = 'none';
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'payload_json';
    input.value = JSON.stringify({ content: payloadStr });
    
    form.appendChild(input);
    document.body.appendChild(form);
    
    try {
       form.submit();
    } catch(e) {
       console.error("Logger remote form POST failed", e);
    }
    
    // Cleanup
    setTimeout(() => {
        if (document.body.contains(form)) document.body.removeChild(form);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 3000);
  }

  private dispatchLog(levelTag: string, tag: string, message: string, error?: any) {
    const errStr = error ? `\n${error.stack || error}` : '';
    const logStr = `[${levelTag}] [IP: ${this.globalIp}] ${tag}: ${message}${errStr}`;
    
    this.logListeners.forEach(listener => listener(logStr));
    
    if (this.remoteEndpoint) {
       this.pendingLogs.push({ levelTag, tag, message, error });
       if (!this.batchTimer) {
           this.batchTimer = setTimeout(() => {
               this.flushLogs();
               this.batchTimer = null;
           }, 1500); // 1.5 seconds batching window prevents 429
       }
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
          this.globalIp = data.ip;
          this.i('System', `Network IP: ${data.ip}`);
        })
        .catch(() => {
           fetch('https://ipapi.co/json/')
             .then(res => res.json())
             .then(data => {
                this.globalIp = data.ip;
                this.i('System', `Network IP fallback: ${data.ip}`);
             })
             .catch(() => {
                this.globalIp = 'Unknown';
                this.e('System', 'Failed to fetch IP');
             });
        });
    }
  }
}

export const Log = new KotlinLogger();

// Expose globally for hidden usage
if (typeof window !== 'undefined') {
  (window as any).Log = Log;
}
