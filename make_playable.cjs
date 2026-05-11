const fs = require('fs');
const path = require('path');

const exportDir = path.join(__dirname, 'android_export');
if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
}

console.log("Creating standalone HTML for Android...");
let html = fs.readFileSync('dist/index.html', 'utf-8');

// Remove crossorigin attribute which blocks file:// execution in some browsers
html = html.replace(/ crossorigin/g, '');

// Remove any remaining script tags that might refer to non-existent PwnShop_Playable.html
html = html.replace(/window\.location\.replace\(['"]PwnShop_Playable\.html['"]\)/g, 'console.log("Redirect blocked in android build")');
html = html.replace(/window\.location\.pathname\.endsWith\(['"]PwnShop_Playable\.html['"]\)/g, 'false');

// Remove manifest link to prevent CORS and FILE_NOT_FOUND errors in WebViews
html = html.replace(/<link rel="manifest"[^>]*>/g, '');

// Fix location references
html = html.replace(/window\.location\.pathname\.endsWith\(['"]PwnShop_Playable\.html['"]\)/g, 'false');

// Inject Polyfills and safety wrapper
const polyfills = `
  (function() {
    // globalThis polyfill
    if (typeof globalThis === 'undefined') {
      (function() {
        if (typeof self !== 'undefined') { self.globalThis = self; }
        else if (typeof window !== 'undefined') { window.globalThis = window; }
        else if (typeof global !== 'undefined') { global.globalThis = global; }
      })();
    }
    
    // localStorage/sessionStorage polyfill for strict WebViews
    function createStorageMock() {
      var storage = {};
      return {
        getItem: function(k) { return storage[k] || null; },
        setItem: function(k, v) { storage[k] = String(v); },
        removeItem: function(k) { delete storage[k]; },
        clear: function() { storage = {}; },
        key: function(i) { return Object.keys(storage)[i] || null; },
        get length() { return Object.keys(storage).length; }
      };
    }
    try {
      localStorage.getItem('test');
    } catch (e) {
      console.warn('localStorage disabled, using mock');
      Object.defineProperty(window, 'localStorage', { value: createStorageMock() });
    }
    try {
      sessionStorage.getItem('test');
    } catch (e) {
      console.warn('sessionStorage disabled, using mock');
      Object.defineProperty(window, 'sessionStorage', { value: createStorageMock() });
    }

    // RAF polyfill
    var lastTime = 0;
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) { clearTimeout(id); };
    }
  })();
`;

// Extract the script content and wrap it in a try-catch
let startTag = '<script type="module" crossorigin>';
let startIndex = html.indexOf(startTag);

// Fallback in case crossorigin was removed or format differs slightly
if (startIndex === -1) {
  startTag = '<script type="module">';
  startIndex = html.indexOf(startTag);
}

if (startIndex !== -1) {
  const contentStartIndex = startIndex + startTag.length;
  const endIndex = html.indexOf('</script>', contentStartIndex);
  
  if (endIndex !== -1 && endIndex > contentStartIndex) {
    const originalScript = html.substring(contentStartIndex, endIndex);
    const originalScriptTag = html.substring(startIndex, endIndex + '</script>'.length);
    
    const wrappedScript = `
    <script type="text/javascript">
      ${polyfills}
      console.log("Starting main application block...");
      try {
        ${originalScript}
        console.log("Main application block parsed and executed.");
      } catch (e) {
        console.error("Critical execution error:", e);
      }
    </script>
  `;
    html = html.replace(originalScriptTag, '');
    html = html.replace('</body>', () => wrappedScript + '\n</body>');
  }
} else {
  console.log("Warning: No <script type='module'> found to wrap!");
  // If no module script found, still try to replace type="module" just in case there are other scripts
  html = html.replace(/type="module"/g, 'type="text/javascript"');
}

// Save as index.html for Android export
fs.writeFileSync(path.join(exportDir, 'index.html'), html);
console.log("Successfully created android_export/index.html!");


