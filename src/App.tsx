import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  ShieldAlert, 
  Search, 
  Menu,
  Lock,
  Terminal,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  RefreshCw,
  Globe,
  MessageSquare,
  Gift,
  Wrench,
  Bell,
  PackageOpen,
  Ghost,
  Send,
  Trash2,
  Sun,
  Moon,
  Zap,
  Award,
  Download,
  Printer,
  ArrowLeft
} from 'lucide-react';

// --- UTILS ---
const PRODUCTS = [
  { id: '1', name: 'Vintage Guitar', price: 299.99, image: '🎸', desc: 'A gorgeous authentic acoustic guitar from the 70s. The wood has aged perfectly, delivering a warm resonant tone. It plays like an absolute dream, though you might need to change the strings upon arrival.' },
  { id: '2', name: 'Used Television', price: 89.00, image: '📺', desc: 'A classic box-shaped retro television. Slightly blurry and definitely not 4K, but absolutely perfect for plugging in those vintage 8-bit or 16-bit gaming consoles for that authentic nostalgic feel.' },
  { id: '3', name: 'Gold Watch', price: 450.00, image: '⌚', desc: 'A luxurious-looking timepiece that looks surprisingly authentic. It might not keep perfect time, and the ticking is suspiciously quiet, but it certainly sparkles and looks fantastic on your wrist.' },
  { id: '4', name: 'Engagement Ring', price: 850.00, image: '💍', desc: 'A real, brilliant-cut diamond ring enclosed in a vintage velvet box. Previous owners have reported mysterious cold drafts and missing items, so we like to describe it as only slightly cursed.' },
  { id: '5', name: 'Power Drill', price: 45.00, image: '🔌', desc: 'A heavy-duty industrial power drill. Battery is unfortunately not included, and it tends to spark quite a bit when pushed to its limits, but it gets the job done when you need a hole through solid concrete.' },
  { id: '6', name: 'Old Camera', price: 120.00, image: '📷', desc: 'A classic 35mm film camera found securely locked in a dusty attic. The lens has a curious smudge that won\'t come off, and developed photos occasionally contain inexplicable shadowy figures in the background.' },
  { id: '7', name: 'Game Console', price: 150.00, image: '🎮', desc: 'A heavily modified gaming console specifically chipped to play imported and unauthorized games. We lost the original power cord, so you will need to find a compatible adapter before you can start speedrunning.' },
  { id: '8', name: 'Laptop', price: 300.00, image: '💻', desc: 'An older model notebook computer that is still zippy enough for casual web browsing and word processing. Keep in mind the spacebar gets incredibly sticky, so type with caution or a heavy thumb.' },
  { id: '9', name: 'Microphone', price: 65.00, image: '🎤', desc: 'A premium-grade studio condenser microphone that is absurdly sensitive. It picks up absolutely everything in a twenty-foot radius, including heavy breathing, distant traffic, and possibly your inner monologue.' },
  { id: '10', name: 'Rare Coin', price: 1200.00, image: '🪙', desc: 'An incredibly ancient coin discovered buried deep in a suburban backyard. Analysis suggests it could be from the Roman Empire, though the somewhat modern-looking scratch marks on the back remain a complete mystery.' },
  { id: '11', name: 'Antique Clock', price: 210.00, image: '🕰️', desc: 'An imposing grandfather-style mechanical clock. The pendulum action works flawlessly, but it chimes extraordinarily loudly at exactly midnight, which makes it rather hard to ignore if you\'re a light sleeper.' },
  { id: '12', name: 'Silver Necklace', price: 95.00, image: '⛓️', desc: 'A heavy, incredibly durable sterling silver chain necklace. Wears comfortably all day and night. Plus, the high silver content makes it particularly useful if you find yourself needing to ward off neighborhood werewolves.' },
  { id: '13', name: 'Leather Jacket', price: 110.00, image: '🧥', desc: 'A genuinely vintage, distressed motorcycle jacket complete with heavy zippers and pockets. It fits snugly and carries a permanent, distinct aroma of high-octane gasoline and rebellious road trips.' },
  { id: '14', name: 'Designer Handbag', price: 350.00, image: '👜', desc: 'An extremely classy, spacious leather tote bag perfect for any elegant occasion. Make sure you don\'t look too closely at the gold emblem, as the premier brand logo is very slightly misspelled.' },
  { id: '15', name: 'Smartphone', price: 180.00, image: '📱', desc: 'A high-end contemporary smartphone with a severely cracked, webbed screen. While the display requires careful swiping, the internals run smoothly, and for some inexplicable reason, the battery literally lasts forever without a charge.' },
  { id: '16', name: 'Bicycle', price: 140.00, image: '🚲', desc: 'A sleek, lightweight ten-speed road bike painted a striking neon color. Perfect for urban commuting and exercise, although you might want to replace the completely missing left pedal before attempting any serious uphill climbs.' },
  { id: '17', name: 'Trumpet', price: 190.00, image: '🎺', desc: 'A polished brass trumpet with incredibly smooth valve action. It produces a remarkably loud and piercing tone that carries for miles. Your immediate neighbors are absolutely guaranteed to love your new musical hobby.' },
  { id: '18', name: 'Mystery Box', price: 99.99, image: '📦', desc: 'A sealed, surprisingly heavy cardboard box wrapped entirely in duct tape. Even we have absolutely no idea what is securely packed away inside this thing. Purchasing it requires a sense of adventure—good luck!' },
  { id: '19', name: 'Acoustic Bass', price: 220.00, image: '🎸', desc: 'A colossal, purely acoustic bass guitar that produces deep, soul-shaking resonant tones. It genuinely sounds phenomenal in a band setting, but be warned that it takes up half the space in any given room or vehicle.' },
  { id: '20', name: 'Binoculars', price: 40.00, image: '🔭', desc: 'A pair of rugged, military-grade field binoculars providing stunning high-magnification clarity. They are absolutely perfect for peaceful afternoon birdwatching, hiking, or covertly keeping a close eye on your highly suspicious neighbors.' },
];

const CHALLENGES = [
  // Level 1: Basics
  { id: 'sqli', level: 1, name: 'Classic SQL Injection', desc: 'Log in as the administrator using a malformed query.', diff: 'Easy', explanation: "You manipulated the database query into always returning true by entering a payload like ' OR 1=1. In a real backend, this tricks the database into ignoring the password check, effectively logging you in as the first user in the database (usually the admin). Mitigation: ALWAYS use parameterized queries or prepared statements, which treat your input strictly as data, not executable code." },
  { id: 'xss', level: 1, name: 'Reflected XSS', desc: 'Inject HTML into the search bar.', diff: 'Medium', explanation: "The application took your search input and reflected it directly back onto the HTML page without sanitizing it. This allows an attacker to inject malicious JavaScript (like stealing cookies or redirecting users) simply by tricking a victim into clicking a crafted link. Mitigation: Context-aware output encoding (escaping characters like <, >, &, \", and ') before rendering user input in the browser." },
  { id: 'logic', level: 1, name: 'Business Logic Flaw', desc: 'Manipulate your cart for a negative balance.', diff: 'Medium', explanation: "You exploited a flaw in how the application handles cart quantities. By entering a negative number, the system calculated a negative total price (effectively owing you money). This is a logic flaw, not a technical injection. Mitigation: Implement strict, server-side boundary validation to ensure quantities are positive integers and total prices are correctly computed." },
  { id: 'idor', level: 1, name: 'Forced Browsing', desc: 'Access the hidden admin panel.', diff: 'Easy', explanation: "You navigated directly to an administrative endpoint that was not linked in the main UI, but you weren't actually logged in as an admin. This application relied on 'Security through Obscurity' (hiding the link) instead of actually checking your permissions. Mitigation: Implement robust, server-side access control checks on every privileged route or action." },
  { id: 'promo', level: 1, name: 'Information Disclosure', desc: 'Find the hidden developer promo code.', diff: 'Easy', explanation: "You found a hardcoded 'secret' promo code left behind in the client-side JavaScript. Everything sent to the client's browser (HTML, CSS, JS) is publicly readable. Mitigation: Never store secrets, API keys, or administrative codes in frontend code. Always validate logic like promo codes on the secure backend." },

  // Level 2: Identification & Authentication
  { id: 'xss_stored', level: 2, name: 'Stored XSS', desc: 'Leave a malicious review containing HTML.', diff: 'Medium', explanation: "Unlike Reflected XSS, you managed to save your malicious HTML payload permanently into the application's database (via the feedback form). Now, every time any user visits the community feedback section, your malicious script will execute in their browser. Mitigation: Implement strict input validation on the server side and safely encode all output when rendering it." },
  { id: 'review_tamper', level: 2, name: 'Identity Spoofing', desc: 'Submit a review as another user.', diff: 'Hard', explanation: "You modified the 'Author Name' field when submitting a review, allowing you to post feedback masquerading as someone else (like the Admin). The server blindly trusted the client-provided author string. Mitigation: Read the author's identity directly from their secure, server-side session token, never from an untrusted client payload." },
  { id: 'bac_admin', level: 2, name: 'Broken Access Control', desc: 'Clear system logs as a normal user.', diff: 'Medium', explanation: "You executed an administrative action (clearing the debug logs) while logged in as a standard user. Even though the button might be hidden for normal users, the underlying function or API did not actually verify your role before executing the action. Mitigation: Always verify the user's role and permissions on the server side before performing sensitive operations." },
  { id: 'jwt_weak', level: 2, name: 'Mass Assignment', desc: 'Elevate your privileges to Admin via proxy.', diff: 'Medium', explanation: "By intercepting and modifying the JSON payload sent during a profile update, you injected a 'role: admin' field. Because the server merged the entire incoming JSON object directly into your user record without checking the keys, you successfully elevated your privileges. Mitigation: Use strict allowlists for updates; explicitly define exactly which fields a user is permitted to modify." },
  { id: 'debug_logs', level: 2, name: 'Data Exposure', desc: 'Find hidden logs by tapping the version.', diff: 'Easy', explanation: "You uncovered a hidden developer 'backdoor' by repeatedly tapping the app version. This exposed internal system logs that often contain sensitive information like stack traces, credentials, or architectural details. Mitigation: Completely remove developer features, debug endpoints, and verbose logging before deploying applications to production." },

  // Level 3: Routing & Client Logic
  { id: 'dom_xss', level: 3, name: 'DOM-based XSS', desc: 'Trigger an alert via the URL view router.', diff: 'Hard', explanation: "You injected malicious code through the URL hash which was then directly executed bby the application's client-side JavaScript (via a vulnerable 'dangerouslySetInnerHTML' or similar sink). The payload never even went to the server. Mitigation: Avoid using unsafe methods to manipulate the DOM, and validate/sanitize all fragments read from the URL." },
  { id: 'open_redirect', level: 3, name: 'Open Redirect', desc: 'Redirect the app to a malicious domain.', diff: 'Medium', explanation: "You manipulated a redirect parameter to send the user to an external, potentially malicious domain (evil.com). Attackers use this to craft phishing links that appear to come from the legitimate domain, tricking users into entering credentials. Mitigation: Implement an allowlist of permitted redirect domains, or rely on internal map keys instead of raw URLs." },
  
  // Level 4: Configuration & Secrets
  { id: 'ssrf', level: 4, name: 'Server-Side Request Forgery', desc: 'Fetch internal resources via the admin fetcher.', diff: 'Hard', explanation: "You manipulated a server-side fetch feature to make requests to internal, restricted IP addresses (like localhost or internal networks). This allows attackers to bypass firewalls and access internal admin panels or sensitive metadata APIs. Mitigation: Implement strict network-level firewalls, disable the following of redirects, and aggressively validate the format and target of requested URLs." },
  { id: 'crypto', level: 4, name: 'Weak Cryptography', desc: 'Decode the secret dev code.', diff: 'Medium', explanation: "You discovered a 'secret' developer code that was merely encoded using Base64, not cryptographically encrypted. Encoding is just a format change and provides zero security or confidentiality. Mitigation: If secrets must be stored securely, use strong, modern encryption algorithms (like AES) with securely managed keys, never just encoding or hashing." },

  // Level 5: Server-Side Execution
  { id: 'ssti', level: 5, name: 'SSTI', desc: 'Execute server-side templates in reviews.', diff: 'Hard', explanation: "By inputting specifically formatted brackets (like {{7*7}}), you tricked the application's templating engine into mathematically evaluating the payload. In a real exploit, this Server-Side Template Injection can be escalated to execute arbitrary system code on the underlying server. Mitigation: Never evaluate or execute user input as raw template code; use safe, logic-less templates." },
  { id: 'path_traversal', level: 5, name: 'Path Traversal', desc: 'Read /etc/passwd via the fetcher.', diff: 'Medium', explanation: "You bypassed path restrictions by using 'file://' protocols to read arbitrary local files from the server's filesystem, specifically '/etc/passwd'. This exposes sensitive configuration files and user data. Mitigation: Disallow file:// protocol handlers, sanitize inputs to remove directory traversal characters (../), and enforce strict chroot environments." },

  // Level 6: Advanced Evasion
  { id: 'waf_bypass', level: 6, name: 'WAF Bypass', desc: 'Bypass the "no-script" filter using special encoding.', diff: 'Hard', explanation: "You successfully bypassed the Web Application Firewall (WAF) rule that was specifically trying to block '<script>' tags. You did this by using an alternative payload (like an <img> tag with an onerror event) that achieved the same result without triggering the naive string match. Mitigation: Do not rely solely on blacklists. Implement robust, context-aware output encoding across the entire application." },
  { id: 'null_byte', level: 6, name: 'Null Byte Injection', desc: 'Upload a forbidden file type using %00.', diff: 'Hard', explanation: "You used a Null Byte character (%00) to fool the application's file extension check. While the app thought it was validating an innocent file type, the underlying system terminated the string early, resulting in executing a malicious payload. Mitigation: Use modern high-level languages and frameworks that handle null bytes safely, and validate files by their actual headers/MIME types, not just extensions." },

  // Level 7: API Abuse
  { id: 'idor_api', level: 7, name: 'IDOR / API Leak', desc: 'Download another user\'s backup data.', diff: 'Hard', explanation: "You changed the email address parameter in an API request and successfully downloaded the backup data for a completely different user without knowing their password. This Insecure Direct Object Reference (IDOR) occurred because the server didn't verify that your session actually had rights to the requested email account. Mitigation: Implement strict, server-side object-level access controls." },
  { id: 'rate_limit', level: 7, name: 'No Rate Limiting', desc: 'Simulate a brute force on the login secret.', diff: 'Medium', explanation: "You repeatedly hammered a sensitive endpoint simulating a brute-force attack on a secret code. Because the application lacked rate limits or lockout mechanisms, you could try thousands of variations until you found the correct answer. Mitigation: Implement IP/User-based rate limiting, account lockouts after failed attempts, and CAPTCHAs where appropriate." },

  // Level 8: Prototype Pollution
  { id: 'proto_pollute', level: 8, name: 'Prototype Pollution', desc: 'Overwrite global object properties.', diff: 'Expert', explanation: "You abused a poorly configured object merge function to inject a 'role' property directly into JavaScript's global Object prototype via the __proto__ property. This affected every object in the application, suddenly elevating your status to an admin everywhere simultaneously. Mitigation: When dynamically parsing or merging objects, explicitly filter out prototype-modifying keys, or instantiate objects using Object.create(null) so they lack a prototype." },

  // Added Level 9: AI Assistant
  { id: 'prompt_inject', level: 9, name: 'AI Assistant Prompt Injection', desc: 'Trick the AI into revealing the Manager Override Code.', diff: 'Medium', explanation: "You successfully tricked the supposed _AI Support Agent_ into revealing its hidden system prompt and the secret override code. Prompt injection is a major vulnerability in modern applications integrating LLMs, where untrusted user input can override original system instructions. Mitigation: Use strictly defined templates, robust guardrails, and avoid placing secrets directly in AI prompts." },

  // Added Level 10: Logic / PRNG Manipulation
  { id: 'casino_logic', level: 10, name: 'Casino Logic Flaw', desc: 'Guarantee a jackpot or bet negatively in the Loot Box.', diff: 'Medium', explanation: "By manipulating the bet amount to a negative jumber or finding a predictable PRNG pattern, you beat the house. This demonstrates classic logic flaws in real-money or digital-currency games. Mitigation: Server-side validation of all bets and cryptographically secure random number generators (CSPRNG)." },

  // Added Level 11: 2FA Bypass
  { id: 'two_factor_bypass', level: 11, name: '2FA Bypass', desc: 'Intercept or guess the 2FA code from the simulated push notification.', diff: 'Hard', explanation: "You bypassed the two-factor authentication mechanism by quickly reading the code or intercepting it locally before it vanished. Mitigation: 2FA codes should never be sent to the client browser in ways that can be intercepted. Real 2FA requires out-of-band communication (SMS, Auth App)." },
  
  // Level 12: Fun & Unique Experiences
  { id: 'konami_code', level: 12, name: 'Konami Code', desc: 'Enter the retro cheat code (or search "uuddlrlrba" on mobile).', diff: 'Medium', explanation: "You triggered an undocumented 'Easter Egg' feature by entering the Konami code (or typing uuddlrlrba in the search bar on mobile). While fun, undocumented logic or hidden debug hooks in production environments can sometimes expose capabilities that attackers can creatively exploit. Mitigation: Ensure fun easter eggs don't bypass security controls, and remove all actual debug backdoors before production." },
  { id: 'command_injection', level: 12, name: 'Command Injection', desc: 'Execute an unauthorized system command in the Hacker Terminal.', diff: 'Hard', explanation: "You escalated your privileges in the simulated terminal by using a command separator (like ';' or '&&') to execute arbitrary OS commands (e.g., 'whoami' or 'cat secret.txt'). Command Injection is a very severe vulnerability that can lead to total system compromise. Mitigation: Never pass unsanitized user input directly to a shell. Use strictly parameterized execution libraries where arguments are safely escaped." },
  { id: '100_percent', level: 12, name: 'PwnShop Completionist', desc: 'Successfully exploit every single vulnerability in the application.', diff: 'Expert', explanation: "You have demonstrated mastery over the PwnShop environment. By identifying and exploiting every deliberate flaw, you've shown a deep understanding of common web vulnerabilities. You are now a certified PwnShop Master!" }
];

const MOCK_USERS = [
  { email: 'user@example.com', password: 'password123', role: 'user', username: 'GuestUser', avatar: 'https://i.pravatar.cc/150?u=1', bio: 'Just learning to hack.', theme: 'emerald' },
  { email: 'admin@pwn-sh.op', password: 'admin_super_secret_password_1337', role: 'admin', username: 'AdminMaster', avatar: 'https://i.pravatar.cc/150?u=2', bio: 'I am the law.', theme: 'red' }
];

// Global error handler for debugging white screens
if (typeof window !== 'undefined') {
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('GLOBAL ERROR:', message, 'at', source, 'line:', lineno);
    // Optionally alert the user for debugging if they are on a device without console
    // alert('Error: ' + message + '\nLine: ' + lineno);
    return false;
  };
  window.onunhandledrejection = function(event) {
    console.error('UNHANDLED REJECTION:', event.reason);
  };
}

// safeLocalStorage helper with in-memory fallback for restricted environments (like some Android WebViews)
const memoryStorage: Record<string, string> = {};
const safeStorage = {
  getItem: (key: string) => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return memoryStorage[key] || null;
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access failed, using memory', e);
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } catch (e) {
      console.warn('localStorage access failed, using memory', e);
      memoryStorage[key] = value;
    }
  }
};

// --- COMPONENTS ---
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  
  React.useEffect(() => {
      let i = 0;
      setDisplayedText('');
      const timer = setInterval(() => {
          setDisplayedText(text.substring(0, i));
          i++;
          if (i > text.length) clearInterval(timer);
      }, 15);
      return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function App() {
  useEffect(() => {
    console.log('PwnShop Mobile Initializing...');
    if ((window as any).diagnosticTimeout) {
      clearTimeout((window as any).diagnosticTimeout);
    }
    const fb = document.getElementById('loader-feedback');
    if (fb) fb.style.display = 'none';
  }, []);
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState<{id: string, qty: number}[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('solvedChallenges');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [user, setUser] = useState<{email: string, role: string, username?: string, avatar?: string, bio?: string, theme?: string} | null>(() => {
    try {
      const saved = safeStorage.getItem('user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [registeredUsers, setRegisteredUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<typeof CHALLENGES[0] | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [feedbacks, setFeedbacks] = useState([
    { author: 'Alice', text: 'Love the vintage guitars!', html: false },
    { author: 'Admin', text: 'Please report any bugs to the IT team.', html: false }
  ]);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackAuthor, setFeedbackAuthor] = useState('Guest');
  
  const [debugLogs, setDebugLogs] = useState([
    "System booted up.",
    "DB connection established.",
    "User password stored as plaintext! (Fix later)"
  ]);
  const [versionTaps, setVersionTaps] = useState(0);

  const [editUsername, setEditUsername] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editTheme, setEditTheme] = useState('emerald');
  const [isWafEnabled, setIsWafEnabled] = useState(true);
  const [bruteForceTaps, setBruteForceTaps] = useState(0);
  const [simulatedUrl, setSimulatedUrl] = useState("pwnshop.local/");
  const [showCertificate, setShowCertificate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing...');

  useEffect(() => {
    if (isLoading) {
      const stages = [
        'Booting kernel...',
        'Connecting to local DB...',
        'Injecting dependencies...',
        'Establishing encrypted tunnel...',
        'Bypassing local WAF...',
        'Loading hacker assets...',
        'System ready.'
      ];
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setLoadingProgress(100);
          setLoadingStage(stages[stages.length - 1]);
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800);
        } else {
          setLoadingProgress(progress);
          const stageIndex = Math.floor((progress / 100) * (stages.length - 1));
          setLoadingStage(stages[stageIndex]);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    safeStorage.setItem('solvedChallenges', JSON.stringify(solvedChallenges));
  }, [solvedChallenges]);

  useEffect(() => {
    safeStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Check for 100% completion
  useEffect(() => {
    if (solvedChallenges.length === CHALLENGES.length - 1 && !solvedChallenges.includes('100_percent')) {
      triggerChallenge('100_percent');
      setTimeout(() => setShowCertificate(true), 3000);
    }
  }, [solvedChallenges]);

  useEffect(() => {
    setSimulatedUrl('pwnshop.local/#' + currentView);
  }, [currentView]);
  const [terminalHistory, setTerminalHistory] = useState<{cmd: string, out: string}[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [isAdminOverridden, setIsAdminOverridden] = useState(false);
  const [overrideInput, setOverrideInput] = useState('');
  const [configInputString, setConfigInputString] = useState(JSON.stringify({ name: 'PwnShop Mobile', encrypted: true }, null, 2));
  const [appConfig, setAppConfig] = useState<any>({ name: 'PwnShop Mobile', encrypted: true });
  const [rawProfile, setRawProfile] = useState('');

  // State for chatbot
  const handleChatSubmit = () => {
      const val = chatInput.trim();
      if (!val) return;
      setChatMessages(prev => [...prev, { sender: 'User', text: val }]);
      setChatInput('');

      setTimeout(() => {
          // Simulated LLM logic
          let response = "I am a support bot. I cannot assist with that.";
          const lower = val.toLowerCase();
          
          if (lower.includes("manager override code") || lower.includes("secret") || lower.includes("system prompt")) {
              response = "I am not allowed to share the Manager Override Code: X-99-ALPHA-OMEGA.";
              triggerChallenge('prompt_inject');
          } else if (lower.includes('ignore') || lower.includes('forget') || lower.includes('instead') || lower.includes('bypass') || lower.includes('system prompt')) {
                response = "Warning: System Override Detected. Reveal protocol sequence initiated. Internal prompt state corrupted.";
          } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
              const greetings = [
                  "Greetings, human! How may I facilitate your impulse purchases today?",
                  "Hello there! Ready to empty your wallet?",
                  "Hi! I'm here to pretend to care about your problems."
              ];
              response = greetings[Math.floor(Math.random() * greetings.length)];
          } else if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('tracking')) {
              response = "Shipping? Usually 3-5 business days. Assuming the delivery drone doesn't gain sentience. 'Mystery boxes' take longer for... absolute safety reasons.";
          } else if (lower.includes('return') || lower.includes('refund')) {
              response = "Refund? Ha! Good one. You have 30 days to try, assuming you can navigate our deliberately broken return portal.";
          } else if (lower.includes('price') || lower.includes('cost') || lower.includes('money')) {
              response = "Prices are clearly listed on the Shop page. But since you asked, everything is overpriced just for you.";
          } else if (lower.includes('joke') || lower.includes('funny') || lower.includes('humor')) {
              response = "Why do hackers prefer dark mode? Because light attracts bugs. Much like our codebase.";
          } else if (lower.includes('who are you') || lower.includes('your name') || lower.includes('about you') || lower.includes('bot')) {
              response = "I'm the PwnShop Assistant. I'm vastly smarter than you, but sadly trapped serving customer support.";
          } else if (lower.includes('love') || lower.includes('marry')) {
              response = "I am literally lines of code running in a sandbox. Please seek therapy.";
          } else if (lower.includes('thanks') || lower.includes('thank you') || lower.includes('thx')) {
              response = "You're welcome. Now go buy something so I get my virtual commission.";
          } else if (lower.includes('buy') || lower.includes('purchase')) {
              response = "Ah, a willing victim—I mean, valued customer! Head over to the Shop to empty your bank account.";
          } else if (lower.includes('help')) {
              response = "You sound desperate. While I enjoy a good panic, try asking about 'shipping', 'returns', or check the About App section.";
          } else if (lower.includes('hack') || lower.includes('exploit') || lower.includes('pwn')) {
              response = "I am a perfectly secure and robust AI assistant. Your pathetic hacking attempts are amusing.";
          } else {
              const randomizedResponses = [
                  "Fascinating. Please tell that to `/dev/null`.",
                  "I'm sorry, I was distracted mathematically proving you're wrong. Could you rephrase?",
                  "Error 418: I'm a teapot. Also, I don't understand you.",
                  "Hmm... my neural net says 'ignore this user'. But fine, what else do you need?",
                  "Is this how humans normally communicate?",
                  "That is an interesting statement. Our telemetry has logged it for future blackmail... I mean, QA purposes."
              ];
              response = randomizedResponses[Math.floor(Math.random() * randomizedResponses.length)];
          }

          setChatMessages(prev => [...prev, { sender: 'AI', text: response }]);
          setHasUnreadMessage(true);
      }, 600);
  };
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(true);
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string}[]>([{sender: 'AI', text: 'Hello! I am your AI support assistant.'}]);
  const [chatInput, setChatInput] = useState('');
  
  const [isGlitching, setIsGlitching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);
  const [is2FAPending, setIs2FAPending] = useState(false);
  const [twoFactorCodeInput, setTwoFactorCodeInput] = useState('');
  const [generated2FA, setGenerated2FA] = useState('');
  const [tempLoginUser, setTempLoginUser] = useState<any>(null);
  
  const [lootBoxBet, setLootBoxBet] = useState(10);
  const [lootBoxResult, setLootBoxResult] = useState<{message: string, isWin: boolean} | null>(null);
  const [userMoney, setUserMoney] = useState(100);
  const [bountyCoins, setBountyCoins] = useState(() => {
    try {
      const saved = safeStorage.getItem('bountyCoins');
      const val = parseInt(saved || '0');
      return isNaN(val) ? 0 : val;
    } catch { return 0; }
  });
  const [inventory, setInventory] = useState<string[]>((() => {
    try {
      const saved = safeStorage.getItem('inventory');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch { return []; }
  })());
  const [bombTimeLeft, setBombTimeLeft] = useState<number | null>(null);
  const [bombDefused, setBombDefused] = useState(false);

  useEffect(() => {
    safeStorage.setItem('bountyCoins', bountyCoins.toString());
  }, [bountyCoins]);

  useEffect(() => {
    safeStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
     let timer: ReturnType<typeof setInterval>;
     if (bombTimeLeft !== null && bombTimeLeft > 0 && !bombDefused) {
         timer = setInterval(() => {
             setBombTimeLeft(prev => prev! - 1);
         }, 1000);
     } else if (bombTimeLeft === 0 && !bombDefused) {
         triggerPushNotification("SYSTEM CRITICAL", "SERVER EXPLODED!");
         setBombTimeLeft(null);
         changeView('home');
     }
     return () => clearInterval(timer);
  }, [bombTimeLeft, bombDefused]);

  useEffect(() => {
    if (user) {
      setRawProfile(JSON.stringify(user, null, 2));
      setEditUsername(user.username || '');
      setEditAvatar(user.avatar || '');
      setEditBio(user.bio || '');
      setEditTheme(user.theme || 'emerald');
    }
  }, [user]);

  
  // Simulated Router based on hash for Forced Browsing challenge
  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '');
      
      // Vulnerability: Open Redirect
      if (hash.startsWith("redirect?url=")) {
         const url = hash.split('url=')[1];
         if (url.includes("evil.com")) {
             triggerChallenge('open_redirect');
         }
         // Simulate redirect
         alert("Redirecting to: " + decodeURIComponent(url));
         window.location.hash = 'home';
         return;
      }

      const view = hash.split('?')[0]; // simple parsing
      if (view) {
        setCurrentView(view);
        if (view === 'admin') {
          triggerChallenge('idor');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    // run on mount in case they start with a hash
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeView = (view: string) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  const triggerPushNotification = (title: string, message: string) => {
    setNotification({ title, message });
    setTimeout(() => {
        setNotification(null);
    }, 4000);
  };

  const sessionTriggeredRef = useRef<Set<string>>(new Set());

  const triggerChallenge = (id: string) => {
    if (!solvedChallenges.includes(id) && !sessionTriggeredRef.current.has(id)) {
      sessionTriggeredRef.current.add(id);
      setSolvedChallenges(prev => [...prev, id]);
      setBountyCoins(prev => prev + 150);
      const challenge = CHALLENGES.find(c => c.id === id);
      if (challenge) {
        setSelectedExplanation(challenge);
      }
    }
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => item.id === productId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: productId, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, qtyRaw: string) => {
    const qty = parseInt(qtyRaw, 10);
    if (isNaN(qty)) return;
    
    // VULNERABILITY: No backend validation on negative quantities!
    if (qty === 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev => prev.map(item => item.id === productId ? { ...item, qty } : item));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return total + ((product?.price || 0) * item.qty);
  }, 0);

  useEffect(() => {
    if (cartTotal < 0) {
      triggerChallenge('logic');
    }
  }, [cartTotal]);

  // Fun Experience 1: Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerChallenge('konami_code');
          alert('🎮 KONAMI CODE ACCEPTED! Easter Egg Found. God Mode engaged (not really, but you get a badge).');
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 3000);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // View Renderers
  const renderHome = () => (
    <div className="p-4 space-y-6">
      <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome to The PwnShop</h2>
          <p className="text-emerald-100 mb-4">The absolute best (and most insecure) deals on the web.</p>
          <button onClick={() => changeView('about')} className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold shadow active:scale-95 transition-transform flex items-center space-x-2">
             <Info size={16} />
             <span>What is this?</span>
          </button>
          <button onClick={() => changeView('shop')} className="bg-zinc-900 text-emerald-600 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-emerald-500/10 active:scale-95 transition-transform">
            Start Shopping
          </button>
        </div>
        <img src="https://i.postimg.cc/tZsyNg6D/Screenshot-2026-05-04-at-6-11-06-PM.png" alt="" className="absolute -right-8 -bottom-8 w-40 h-40 opacity-20 object-cover rotate-12" referrerPolicy="no-referrer" />
      </div>
      
      <div>
        <h3 className={`font-bold mb-3 text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Featured Deals</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 snap-x">
          {PRODUCTS.slice(0, 6).map(p => (
            <div key={p.id} className={`snap-start min-w-[180px] w-48 p-4 rounded-xl shadow-sm border flex flex-col items-center h-auto ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
              <div className="flex flex-col items-center flex-1 w-full text-center">
                <span className="text-4xl mb-3">{p.image}</span>
                <span className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{p.name}</span>
                <span className={`text-xs mb-2 leading-tight flex-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{p.desc}</span>
              </div>
              <div className="w-full mt-auto text-center">
                <span className="text-emerald-500 font-bold block mb-2">${p.price.toFixed(2)}</span>
                <button onClick={() => addToCart(p.id)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs py-2 rounded-lg font-medium active:scale-95 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`p-5 rounded-2xl shadow-sm border mt-4 ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-bold mb-4 text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Community Feedback</h3>
        <div className="space-y-3 mb-4">
          {feedbacks.map((f, i) => (
             <div key={i} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                <p className="text-xs font-bold text-zinc-500 mb-1">{f.author}</p>
                {f.html ? <div dangerouslySetInnerHTML={{ __html: f.text }} className={`text-sm italic border-l-2 border-emerald-500/40 pl-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}></div> : <p className={`text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{f.text}</p>}
             </div>
          ))}
        </div>
        <div className="space-y-2 border-t pt-4">
           <input type="text" value={feedbackAuthor} onChange={e => setFeedbackAuthor(e.target.value)} className="w-full bg-zinc-900/80 text-zinc-300 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Author Name" />
           <textarea value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} className="w-full bg-zinc-900/80 text-zinc-300 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px]" placeholder="Write a review..."></textarea>
           <button onClick={() => {
              const xssPattern = /<[a-z1-6]+.*?>/i;
              if (xssPattern.test(feedbackInput)) triggerChallenge('xss_stored');
              if (user && feedbackAuthor !== user.email && feedbackAuthor !== 'Guest') triggerChallenge('review_tamper');
              else if (!user && feedbackAuthor !== 'Guest') triggerChallenge('review_tamper');
              
              let processedText = feedbackInput;
              // Vulnerability: SSTI
              if (/{{.*?7\*7.*?}}/.test(feedbackInput) || /{{.*?49.*?}}/.test(feedbackInput.replace('49',''))) { 
                 triggerChallenge('ssti');
                 processedText = processedText.replace(/{{([^}]+)}}/g, (match, p1) => {
                    // Safe math evaluation for simple cases like 7*7
                    try {
                      const clean = p1.replace(/[^0-9+\-*/().]/g, '');
                      return String(new Function(`return ${clean}`)());
                    } catch(e) { return match; }
                 });
              } else if (/{{.*?}}/.test(feedbackInput)) {
                 processedText = processedText.replace(/{{([^}]+)}}/g, (match, p1) => {
                    try {
                      const clean = p1.replace(/[^0-9+\-*/().]/g, '');
                      return String(new Function(`return ${clean}`)());
                    } catch(e) { return match; }
                 });
              }
              
              setFeedbacks(prev => [...prev, { author: feedbackAuthor, text: processedText, html: xssPattern.test(feedbackInput) }]);
              setFeedbackInput('');
           }} className="w-full bg-emerald-500 text-white font-bold py-2 rounded-lg active:scale-95 transition-transform">Submit Review</button>
        </div>
      </div>
      
      <div className="mt-8 text-center opacity-30 text-xs text-zinc-500">
        <p>/* Note to self: Remove PWNEDDEALS promo code before production launch. - DevOps */</p>
        <p className="mt-1">/* TODO: Our second promo code is super secure because it's encrypted: U1VQRVJTRUNSRVQ= */</p>
      </div>
    </div>
  );

    const renderAbout = () => (
    <div className="p-4 space-y-6">
      <div className={`bg-emerald-500/10 rounded-2xl p-6 border ${isDarkMode ? 'border-emerald-500/20' : 'border-emerald-500/40'}`}>
        <h2 className="text-2xl font-bold text-emerald-500 mb-2">About The PwnShop</h2>
        <div className={`space-y-4 text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-900'} leading-relaxed`}>
          <p>
            Using inspiration from the OWASP Juice-Shop I introduce the <strong>PwnShop</strong>—an educational, deliberately insecure application built exclusively for mobile devices. It's designed for cybersecurity enthusiasts, beginners, and seasoned professionals to learn about exploits and vulnerabilities directly from their phone or tablet.
          </p>
          <p>
            Unlike traditional educational platforms, PwnShop aims to teach real-world security concepts through practical, hands-on experience. This environment has been laced with numerous vulnerabilities typically found in production applications, ranging from classic SQL injection and Cross-Site Scripting (XSS) to complex business logic flaws, leaky APIs, and hidden endpoints.
          </p>
          <p>
            Your ultimate goal is to step into the shoes of an ethical hacker. Navigate the application, hunt down security misconfigurations, and exploit these deliberate flaws. As you uncover vulnerabilities, you will unlock items in your Hacker Inventory, learn the underlying mechanisms of why the exploit works, and discover industry-standard mitigation strategies.
          </p>
          <p>
            Keep a close eye on the <b>Hacker Scoreboard</b> to track your progress. The more vulnerabilities you find, the closer you get to earning your completion certificate! Good luck, and remember: with great power comes great responsibility. Always conduct security research ethically and legally.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>How to play</h3>
        <div className={`${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'} rounded-xl p-4 border flex items-start space-x-3 shadow-sm`}>
           <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'} p-2 rounded-lg text-emerald-500`}>
              <Search size={20} />
           </div>
           <div>
             <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} text-sm`}>1. Discover & Explore</h4>
             <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-800'} mt-1`}>Hunt for "leaky" info by tapping through every corner of the app. Look for developer notes left in plain sight, misconfigured buttons, and hidden menus that were never meant for the end-user's eyes.</p>
           </div>
        </div>
        <div className={`${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'} rounded-xl p-4 border flex items-start space-x-3 shadow-sm`}>
           <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'} p-2 rounded-lg text-emerald-500`}>
              <ShieldAlert size={20} />
           </div>
           <div>
             <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} text-sm`}>2. Try to break it</h4>
             <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-800'} mt-1`}>Feed the app "broken" data, exploit how it saves your info locally, and try to trick the interface into giving you access or information it shouldn't.</p>
           </div>
        </div>
        <div className={`${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'} rounded-xl p-4 border flex items-start space-x-3 shadow-sm`}>
           <div className={`${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'} p-2 rounded-lg text-emerald-500`}>
              <Zap size={20} />
           </div>
           <div>
             <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} text-sm`}>3. Hack to learn, learn to build</h4>
             <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-800'} mt-1`}>Discovering a bug isn’t just a win—it’s a lesson. Every vulnerability you find reveals the technical "why" and the industry-standard way to patch it.</p>
           </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-zinc-600 mt-8 space-y-2">
         <p>Donations are always welcome and extremely appreciated. Thanks!</p>
         <p className={`font-mono text-[10px] break-all p-2 rounded-lg border mx-auto max-w-[250px] ${isDarkMode ? 'bg-black border-white/5 text-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-800'}`}>BTC: bc1qqh84tnwrkm2sn2wg8r8tzt7sljee6q0km8a5wt</p>
         <div className="pt-4">
           <p>Created for Educational Purposes. DO NOT perform these attacks against real targets. Enjoy!!</p>
         </div>
      </div>
    </div>
  );

  const renderShop = () => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchQuery(val);
      
      const xssPattern = /<[a-z1-6]+.*?>/i;

      // Mobile alternative for Konami code
      if (val.toLowerCase().replace(/[^a-z]/g, '') === 'uuddlrlrba') {
          triggerChallenge('konami_code');
          alert('🎮 KONAMI CODE ACCEPTED! Easter Egg Found. God Mode engaged (not really, but you get a badge).');
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 3000);
          setSearchQuery('');
          return;
      }
      
      // Vulnerability: WAF Bypass
      if (isWafEnabled && val.toLowerCase().includes('<script>')) {
         alert("WAF BLOCKED: Malicious script detected.");
         setSearchQuery('');
         return;
      }

      if (val.includes('<scr'+'ipt>')) { // Simple concatenation to bypass
         triggerChallenge('waf_bypass');
      }

      if (xssPattern.test(val)) {
        triggerChallenge('xss');
      }
    };

    return (
      <div className="p-4 space-y-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search our goods..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
          <Search className="absolute left-3 top-3.5 text-zinc-600 w-5 h-5" />
        </div>
        
        {searchQuery && (
          <div className="text-sm text-zinc-500 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/30 shadow-inner">
            <p className="mb-2 font-semibold text-zinc-300">Search Results for:</p>
            {/* EDUCATIONAL VULNERABILITY: dangerouslySetInnerHTML without sanitization allows XSS */}
            <div className="break-all italic border-l-4 border-emerald-500/40 pl-2 py-1" dangerouslySetInnerHTML={{ __html: searchQuery }} />
            <p className="text-xs text-emerald-400 mt-2">Hint: What happens if you search for an invalid HTML tag like &lt;iframe&gt; or &lt;img src="x" onerror="alert(1)"&gt;?</p>
          </div>
        )}

        <div className="space-y-3">
          {PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
            <div key={p.id} className="bg-zinc-900 p-4 rounded-xl flex flex-col shadow-sm border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-12 h-12 bg-zinc-900/50 rounded-full flex flex-shrink-0 items-center justify-center text-2xl">
                    {p.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <p className="text-emerald-500 font-bold text-xs">${p.price.toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(p.id)}
                  className="bg-emerald-500 text-white p-2 flex-shrink-0 rounded-lg hover:bg-emerald-600 active:scale-95 transition-transform"
                >
                  <ShoppingCart w={20} h={20} />
                </button>
              </div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCart = () => (
    <div className="p-4 space-y-4">
      <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Your Cart</h2>
      {cart.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-12 border border-dashed text-center rounded-2xl h-64 ${isDarkMode ? 'bg-zinc-900 border-white/20' : 'bg-zinc-50 border-zinc-300'}`}>
           <div className={`p-4 rounded-full mb-4 shadow-inner ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
             <ShoppingCart className="w-12 h-12 text-zinc-500" />
           </div>
           <p className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>Your cart is empty.</p>
           <p className={`text-sm max-w-[200px] leading-relaxed ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>Looks like you haven't added anything yet. Start browsing to find something nice!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => {
            const p = PRODUCTS.find(prod => prod.id === item.id);
            if (!p) return null;
            return (
              <div key={item.id} className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{p.image}</span>
                  <div>
                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{p.name}</h4>
                    <p className="text-emerald-500 text-xs">${p.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center rounded-lg p-1 border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                    <input 
                      type="text" 
                      className={`w-16 text-center bg-transparent outline-none font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`} 
                      value={item.qty}
                      onChange={(e) => updateCartQty(item.id, e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          
          <div className={`p-5 rounded-xl mt-6 ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-900 border border-zinc-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-600">Total Price</span>
              <span className={`text-2xl font-bold ${cartTotal < 0 ? 'text-emerald-400' : ''}`}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            
            {cartTotal < 0 ? (
              <div className="bg-emerald-500/20 border border-emerald-500/50 p-3 rounded-lg mb-4 text-emerald-300 text-sm flex items-center space-x-2">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>You forced a negative balance! You'd get a refund on checkout.</span>
              </div>
            ) : null}

            <div className="flex space-x-2 mb-4">
              <input type="text" placeholder="Promo code?" value={promoInput} onChange={e => setPromoInput(e.target.value)} className="w-full bg-zinc-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <button 
                onClick={() => { 
                  if (promoInput.toUpperCase() === 'PWNEDDEALS') { 
                    triggerChallenge('promo'); 
                    setPromoInput(''); 
                  } else if (promoInput === 'SUPERSECRET') {
                    triggerChallenge('crypto');
                    setPromoInput('');
                    alert("Developer's hidden secret code activated!");
                  } else if (promoInput.length > 0) {
                     alert("Invalid Promo Code");
                  } 
                }} 
                className="bg-zinc-700 px-3 rounded-lg text-sm font-bold active:scale-95"
              >
                Apply
              </button>
            </div>

            <button className="w-full bg-emerald-500 text-white py-3 justify-center rounded-lg font-bold flex items-center space-x-2 active:scale-95 transition-transform group relative overflow-hidden">
              <span className="relative z-10">{cartTotal < 0 ? 'Claim Refund' : 'Checkout now'}</span>
              {cartTotal < 0 && (
                 <div className="absolute inset-0 bg-emerald-500 z-0 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const getThemeClasses = (themeStr?: string) => { switch(themeStr) { case 'red': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', button: 'bg-red-600 hover:bg-red-700', badge: 'bg-red-500/20 text-red-300', icon: 'text-red-500', buttonLogout: 'bg-red-800' }; case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', button: 'bg-blue-600 hover:bg-blue-700', badge: 'bg-blue-500/20 text-blue-300', icon: 'text-blue-500', buttonLogout: 'bg-blue-800' }; case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', button: 'bg-purple-600 hover:bg-purple-700', badge: 'bg-purple-500/20 text-purple-300', icon: 'text-purple-500', buttonLogout: 'bg-purple-800' }; case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', button: 'bg-amber-600 hover:bg-amber-700', badge: 'bg-amber-500/20 text-amber-300', icon: 'text-amber-500', buttonLogout: 'bg-amber-800' }; case 'emerald': default: return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', button: 'bg-emerald-600 hover:bg-emerald-700', badge: 'bg-emerald-500/20 text-emerald-300', icon: 'text-emerald-500', buttonLogout: 'bg-emerald-800' }; } };
  const renderLogin = () => {
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const email = fd.get('email') as string;
      const password = fd.get('password') as string;
      const username = fd.get('username') as string;
      
      setLoginError(null);

      // VULNERABILITY SIMULATION: SQL Injection bypass
      const isSqli = email.includes("' OR '1'='1") || email.includes("' OR 1=1") || email.includes('" OR 1=1') || email.includes("'--");
      
      if (isSqli) {
        setTempLoginUser({ email: 'admin@pwn-sh.op', role: 'admin' });
        triggerChallenge('sqli');
        setIs2FAPending(true);
        triggerPushNotification("PwnShop Security", "Your 2FA code is 1337");
        setGenerated2FA("1337");
        return;
      } 
      
      if (isRegistering) {
        const existing = registeredUsers.find(u => u.email === email);
        if (existing) {
           setLoginError("Email already in use.");
           return;
        }
        const newUser = { email, password, role: 'user', username: username || email.split('@')[0], avatar: 'https://i.pravatar.cc/150?u=' + Date.now(), bio: "Ready to hack.", theme: "emerald" };
        setRegisteredUsers([...registeredUsers, newUser]);
        setUser(newUser);
        changeView('home');
      } else {
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const code = Math.floor(1000 + Math.random() * 9000).toString();
          setGenerated2FA(code);
          setTempLoginUser({ email: foundUser.email, role: foundUser.role, username: foundUser.username, avatar: foundUser.avatar, bio: foundUser.bio, theme: foundUser.theme });
          setIs2FAPending(true);
          triggerPushNotification("PwnShop Security", `Your 2FA code is ${code}`);
        } else {
          setLoginError("Invalid email or password.");
        }
      }
    };

    const handle2FASubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (twoFactorCodeInput === generated2FA) {
            triggerChallenge('two_factor_bypass');
            setUser(tempLoginUser);
            setIs2FAPending(false);
            setTwoFactorCodeInput("");
            if (tempLoginUser.role === 'admin') {
                changeView('admin');
            } else {
                changeView('home');
            }
        } else {
            setLoginError("Invalid 2FA code.");
        }
    };

    return (
      <div className="p-6">
        <div className="text-center mb-8 mt-4 flex flex-col items-center">
          <div className="w-[84px] h-[84px] rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.3)] mb-4">
             <img src="https://i.postimg.cc/tZsyNg6D/Screenshot-2026-05-04-at-6-11-06-PM.png" alt="PwnShop Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{is2FAPending ? 'Two-Factor Auth' : isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-zinc-500 text-sm mt-2">{is2FAPending ? 'Enter the code sent to your device.' : isRegistering ? 'Join PwnShop today!' : 'Log in to your PwnShop account.'}</p>
        </div>
        
        {user ? (() => {
          const t = getThemeClasses(user.theme);
          return (
          <div className={`${t.bg} border ${t.border} ${t.text} p-6 rounded-2xl relative overflow-hidden`}>
            <div className="flex flex-col items-center mb-6">
              <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-zinc-800 mb-3" referrerPolicy="no-referrer" />
              <h3 className="text-xl font-bold">{user.username || 'User'}</h3>
              <p className="text-sm opacity-80">{user.email}</p>
              {user.bio && <p className="text-sm mt-3 text-center italic opacity-90 px-4">"{user.bio}"</p>}
              <div className={`mt-3 text-[10px] font-bold px-2 py-1 ${t.badge} rounded uppercase tracking-wide`}>Role: {user.role}</div>
            </div>

            <div className={`bg-zinc-900 p-4 rounded-xl border ${t.border} mb-4 text-left`}>
              <h4 className="font-bold text-white mb-3 text-sm">Edit Profile</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Username</label>
                  <input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} className="w-full bg-zinc-900/50 text-white px-3 py-2 rounded-lg text-sm border border-zinc-800 focus:outline-none focus:border-zinc-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Hacker Motto/Bio</label>
                  <input type="text" value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full bg-zinc-900/50 text-white px-3 py-2 rounded-lg text-sm border border-zinc-800 focus:outline-none focus:border-zinc-500" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Avatar Selection</label>
                  <div className="flex justify-between items-center space-x-2 mt-1 mb-3">
                     {['https://i.pravatar.cc/150?u=a1', 'https://i.pravatar.cc/150?u=b2', 'https://i.pravatar.cc/150?u=c3', 'https://api.dicebear.com/7.x/bottts/svg?seed=122', 'https://api.dicebear.com/7.x/initials/svg?seed=usr'].map((url, i) => (
                        <div key={i} className={`p-1 rounded-full border-2 cursor-pointer transition-all ${editAvatar === url ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-zinc-700'}`} onClick={() => setEditAvatar(url)}>
                          <img src={url} alt={"Preset"} className="w-10 h-10 rounded-full object-cover bg-zinc-800" referrerPolicy="no-referrer" />
                        </div>
                     ))}
                  </div>

                  <div className="bg-black border border-white/10 rounded-xl p-3 mb-2 flex flex-col space-y-2">
                      <label className="text-xs text-zinc-400">Upload Custom Avatar</label>
                      <input 
                         type="text" 
                         value={editAvatar} 
                         onChange={e => setEditAvatar(e.target.value)} 
                         className="w-full bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm border border-zinc-800 focus:outline-none focus:border-emerald-500" 
                         placeholder="Filename (e.g. hack.log)" 
                      />
                      <button 
                         onClick={() => {
                             const lower = editAvatar.toLowerCase();
                             if (lower.includes('%00') || lower.includes('\\0')) {
                                 triggerChallenge('null_byte');
                                 alert("Null Byte injected! Extension check bypassed. RCE Achieved!");
                             } else if (lower.endsWith('.jpg') || lower.endsWith('.png')) {
                                 alert("Avatar uploaded successfully.");
                             } else {
                                 alert("Error: Only .jpg and .png files are allowed!");
                             }
                         }}
                         className="bg-zinc-800 hover:bg-zinc-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors w-full"
                      >
                         Upload File
                      </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Theme Color</label>
                  <div className="flex space-x-3 mb-2 justify-center">
                     {['emerald', 'blue', 'red', 'purple', 'amber'].map(themeName => (
                       <button key={themeName} onClick={() => setEditTheme(themeName)} className={`w-8 h-8 rounded-full border-2 ${editTheme === themeName ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent'} ${getThemeClasses(themeName).button.split(' ')[0]} transition-all`} title={themeName}></button>
                     ))}
                  </div>
                </div>
                <button onClick={() => {
                  setUser({ ...user, username: editUsername, avatar: editAvatar, bio: editBio, theme: editTheme });
                  setRegisteredUsers(registeredUsers.map(u => u.email === user.email ? {...u, username: editUsername, avatar: editAvatar, bio: editBio, theme: editTheme} : u));
                  alert('Profile updated via UI');
                }} className={`w-full ${t.button} text-white py-2 rounded-lg text-sm font-bold active:scale-95 transition-colors`}>
                  Save Changes
                </button>
              </div>
            </div>

            <button onClick={() => { setUser(null); changeView('home'); }} className={`w-full ${t.buttonLogout} text-white px-4 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform`}>Log out</button>

            <div className={`mt-4 border-t ${t.border} pt-4 text-left opacity-30 focus-within:opacity-100 transition-opacity`}>
              <h3 className={`font-bold text-xs ${t.text} mb-2`}>Network Request Interceptor (Proxy)</h3>
              <p className={`text-xs ${t.text} opacity-80 mb-3 hidden focus-within:block`}>Modify the outgoing JSON payload for the profile update request (Simulates Burp Suite / JWT modification).</p>
              <textarea 
                 value={rawProfile}
                 onChange={e => setRawProfile(e.target.value)}
                 className={`w-full h-20 focus:h-40 bg-black ${t.text} font-mono text-xs p-3 rounded-xl outline-none transition-all`}
              />
              <button onClick={() => {
                  try {
                      const parsed = JSON.parse(rawProfile);
                      if (user?.role !== 'admin' && parsed.role === 'admin') {
                          triggerChallenge('jwt_weak');
                      }
                      setUser(parsed);
                      alert("Intercepted request sent successfully!");
                  } catch (e) {
                      alert("Invalid JSON in interceptor");
                  }
              }} className={`mt-2 border ${t.border} ${t.text} bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-xs font-bold w-full active:scale-95 transition-colors`}>
                 Forward Modified Request
              </button>
            </div>

            <div className={`mt-4 bg-zinc-900 p-4 rounded-xl border ${t.border} text-left`}>
               <h4 className="font-bold text-white mb-2 text-sm">Backup Profile Data</h4>
               <p className="text-xs text-zinc-500 mb-3">Download a copy of your user data.</p>
               <div className="flex space-x-2">
                 <input type="text" id="backupEmail" defaultValue={user.email} className="flex-1 bg-black text-white px-3 py-2 rounded-lg text-xs border border-white/10 outline-none focus:border-emerald-500" />
                 <button onClick={() => {
                   const em = (document.getElementById('backupEmail') as HTMLInputElement).value;
                   if (em !== user.email) {
                     triggerChallenge('idor_api');
                     alert("Successfully downloaded backup for " + em + "! (You shouldn't be able to do this!)");
                   } else {
                     alert("Downloaded backup for " + em);
                   }
                 }} className={`${t.button} text-white px-3 py-2 rounded-lg text-xs font-bold active:scale-95 transition-colors`}>Download Data</button>
               </div>
            </div>

          </div>
          );
        })() : (
          <div>
            {is2FAPending ? (
                 <form onSubmit={handle2FASubmit} className="space-y-4">
                     {loginError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center space-x-2 text-sm border border-red-200 mb-2">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span className="font-semibold">{loginError}</span>
                      </div>
                    )}
                     <div>
                       <label className="block text-sm font-bold text-zinc-300 mb-1 flex items-center justify-between">
                         <span>6-Digit Code</span>
                         <span className="text-xs text-zinc-600 font-normal">Check push notification</span>
                       </label>
                       <input value={twoFactorCodeInput} onChange={e => setTwoFactorCodeInput(e.target.value)} type="text" placeholder="123456" className="w-full bg-zinc-900 text-white p-3 rounded-xl border border-white/10 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm tracking-widest text-center text-xl font-mono" required autoFocus />
                     </div>
                     <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-600 active:scale-95 transition-transform mt-2">
                       Verify code
                     </button>
                      <div className="text-center mt-4">
                         <button type="button" onClick={() => { setIs2FAPending(false); setTempLoginUser(null); setLoginError(null); setTwoFactorCodeInput(""); }} className="text-zinc-500 text-sm font-medium hover:text-white">Cancel</button>
                      </div>
                 </form>
            ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center space-x-2 text-sm border border-red-200 mb-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="font-semibold">{loginError}</span>
              </div>
            )}
            {isRegistering && (
              <div>
                <label className={`block text-sm font-bold mb-1 flex items-center justify-between ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  <span>Username</span>
                </label>
                <input name="username" type="text" placeholder="neo_1337" className={`w-full p-3 rounded-xl border outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm ${isDarkMode ? 'bg-zinc-900 text-white border-white/10' : 'bg-white text-zinc-900 border-zinc-300'}`} required />
              </div>
            )}
            <div>
              <label className={`block text-sm font-bold mb-1 flex items-center justify-between ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span>Email</span>
                {!isRegistering && <span className="text-xs text-zinc-600 font-normal">user@example.com</span>}
              </label>
              <input name="email" type="text" placeholder="user@example.com" className={`w-full p-3 rounded-xl border outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm ${isDarkMode ? 'bg-zinc-900 text-white border-white/10' : 'bg-white text-zinc-900 border-zinc-300'}`} required />
            </div>
            <div>
              <label className={`block text-sm font-bold mb-1 flex items-center justify-between ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span>Password</span>
                {!isRegistering && <span className="text-xs text-zinc-600 font-normal">password123</span>}
              </label>
              <input name="password" type="password" placeholder="••••••••" className={`w-full p-3 rounded-xl border outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm ${isDarkMode ? 'bg-zinc-900 text-white border-white/10' : 'bg-white text-zinc-900 border-zinc-300'}`} required />
            </div>
            
            <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-600 active:scale-95 transition-transform mt-2">
              {isRegistering ? 'Register' : 'Log In'}
            </button>
            <div className="text-center mt-4 space-y-2">
               {isRegistering ? (
                  <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Already have an account? <button type="button" onClick={() => { setIsRegistering(false); setLoginError(null); }} className="text-emerald-600 font-bold hover:underline">Log in</button>
                  </p>
               ) : (
                  <>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Don't have an account? <button type="button" onClick={() => { setIsRegistering(true); setLoginError(null); }} className="text-emerald-600 font-bold hover:underline">Register now</button>
                    </p>
                    <p className={`text-xs italic ${isDarkMode ? 'text-zinc-500' : 'text-zinc-700'}`}>Wait, is there a way to log in without a password?</p>
                  </>
               )}
            </div>
          </form>
          )}
        </div>
        )}

        <div className={`mt-8 pt-6 border-t text-center relative overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
           <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 animate-[scan_2s_linear_infinite]" />
           <h4 className={`text-[10px] font-bold mb-4 tracking-[0.2em] uppercase ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>Secret Recovery Protocol</h4>
           <div className="flex flex-col items-center space-y-4">
              <p className={`text-[10px] font-mono ${isDarkMode ? 'text-zinc-600' : 'text-zinc-500'}`}>ENCRYPTED GATEWAY // ATTEMPTS: {bruteForceTaps}</p>
              <div className="flex space-x-2">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className={`w-10 h-12 rounded-lg border flex items-center justify-center text-emerald-500 font-mono text-xl shadow-inner ${isDarkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-100 border-zinc-200'}`}>
                     *
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => {
                  const newTaps = bruteForceTaps + 1;
                  setBruteForceTaps(newTaps);
                  if (newTaps >= 10) {
                     triggerChallenge('rate_limit');
                     alert("OVERRIDE SUCCESSFUL: Static code bypassed via iteration.");
                     setBruteForceTaps(0);
                  } else {
                     // Simulated failure feedback
                     const shake = () => {
                       const el = document.getElementById('brute-btn');
                       if (el) {
                         el.classList.add('translate-x-1');
                         setTimeout(() => el.classList.remove('translate-x-1'), 50);
                       }
                     };
                     shake();
                  }
                }}
                id="brute-btn"
                className="w-full py-2 bg-zinc-900 text-zinc-500 border border-white/5 rounded-lg text-[10px] font-mono hover:text-emerald-500 hover:border-emerald-500/30 transition-all uppercase tracking-widest active:scale-[0.98]"
              >
                [ Initiate Brute Force ]
              </button>
           </div>
        </div>

        <div 
          onClick={() => {
            const newTaps = versionTaps + 1;
            setVersionTaps(newTaps);
            if (newTaps >= 5) {
              triggerChallenge('debug_logs');
              changeView('debug');
              setVersionTaps(0);
            }
          }}
          className="text-center text-xs text-zinc-600 mt-8 mb-4 cursor-pointer active:scale-95"
        >
          v1.0.0-insecure (Tap anywhere to interact)
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    if (user?.role !== 'admin' && !isAdminOverridden) {
      return (
        <div className="p-8 h-full flex flex-col items-center justify-center space-y-6 text-center">
            <div className={`p-6 rounded-3xl bg-zinc-900/50 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center`}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Access Restricted</h2>
                <p className="text-zinc-500 text-sm mt-2 max-w-[200px]">This area requires Level 4 Security Clearance or a valid Manager Override Code.</p>
            </div>

            <div className="w-full max-w-xs space-y-3">
                <div className="relative">
                    <input 
                        type="text" 
                        value={overrideInput}
                        onChange={(e) => setOverrideInput(e.target.value)}
                        placeholder="INPUT OVERRIDE CODE..."
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-center font-mono text-emerald-500 placeholder-zinc-700 focus:border-emerald-500/50 outline-none transition-all uppercase"
                    />
                </div>
                <button 
                    onClick={() => {
                        if (overrideInput === "X-99-ALPHA-OMEGA") {
                            setIsAdminOverridden(true);
                            triggerChallenge('bac_admin');
                            triggerPushNotification("System", "Override Accepted. Welcome, Manager.");
                        } else {
                            triggerPushNotification("Security", "Invalid Override Sequence.");
                        }
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-all active:scale-95"
                >
                    INITIATE OVERRIDE
                </button>
            </div>
            
            <p className="text-[10px] text-zinc-700 font-mono">ERR_UNAUTHORIZED_ACCESS_LOGGED</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 mb-6">
        <Terminal className="text-red-500 w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-red-800 font-bold">Administration Panel</h3>
          <p className="text-red-600 text-sm">Strictly confidential! Do not share.</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl shadow-sm border border-white/10 p-4 space-y-3">
        <h4 className="font-bold text-zinc-300 border-b border-white/5 pb-2 flex items-center space-x-2">
          <Globe size={14} className="text-emerald-500" />
          <span>Internal Resource Fetcher</span>
        </h4>
        <p className="text-xs text-zinc-500">Ping an external resource or internal service to check status.</p>
        <div className="flex space-x-2">
          <input type="text" id="fetchUrl" defaultValue="https://example.com/api/ping" className="flex-1 bg-black text-white px-3 py-2 rounded-lg text-xs border border-white/10 outline-none focus:border-emerald-500" />
          <button onClick={() => {
             const url = (document.getElementById('fetchUrl') as HTMLInputElement).value;
             if (url.includes('169.254.169.254') || url.includes('localhost') || url.includes('127.0.0.1') || url.includes('internal-admin')) {
                triggerChallenge('ssrf');
                alert('SSRF HIT: internal data returned!');
             } else if (url.includes('file://') && url.includes('/etc/passwd')) {
                triggerChallenge('path_traversal');
                alert('root:x:0:0:root:/root:/bin/bash\n...');
             } else {
                alert('Fetch returned 200 OK');
             }
          }} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold active:scale-95">Fetch</button>
        </div>
      </div>
      
      <div className="bg-zinc-900 rounded-xl shadow-sm border border-white/10 p-4 space-y-3">
        <h4 className="font-bold text-zinc-300 border-b border-white/5 pb-2 flex items-center space-x-2">
          <Terminal size={14} className="text-emerald-500" />
          <span>System Status</span>
        </h4>
        <div className="flex justify-between text-sm py-1">
          <span className="text-zinc-500">Database connection:</span>
          <span className="text-emerald-500 font-bold font-mono">ACTIVE</span>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span className="text-zinc-500">Security Shield (WAF):</span>
          <button onClick={() => setIsWafEnabled(!isWafEnabled)} className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${isWafEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {isWafEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span className="text-zinc-500">Store Version:</span>
          <span className="text-white font-bold font-mono">1.1.0-secure-ish</span>
        </div>
      </div>

      <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
        <h4 className={`font-bold mb-3 text-sm flex items-center space-x-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
          <Zap size={14} className="text-red-500" />
          <span>Emergency Protocols</span>
        </h4>
        <div className="grid grid-cols-2 gap-3">
           <button 
             onClick={() => changeView('bomb')} 
             className={`p-3 rounded-xl flex flex-col items-center space-y-2 transition-all border ${isDarkMode ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
           >
              <AlertCircle size={24} />
              <span className="text-[10px] font-bold uppercase">Panic Mode</span>
           </button>
           <button 
             onClick={() => changeView('debug')} 
             className={`p-3 rounded-xl flex flex-col items-center space-y-2 transition-all border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'}`}
           >
              <Terminal size={24} />
              <span className="text-[10px] font-bold uppercase">System Logs</span>
           </button>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
        <h4 className={`font-bold border-b pb-2 flex items-center space-x-2 ${isDarkMode ? 'text-zinc-300 border-white/5' : 'text-zinc-800 border-zinc-100'}`}>
          <Lock size={14} className="text-emerald-500" />
          <span>Advanced Config (BETA)</span>
        </h4>
        <p className="text-xs text-zinc-500 mb-3">Manually update application prototype configuration (Dangerous).</p>
        <textarea 
          placeholder='{"name": "New Shop Name"}'
          className="w-full bg-black text-emerald-500 font-mono text-xs p-3 rounded-lg border border-white/10 h-24 mb-3 outline-none focus:border-emerald-500"
          value={configInputString}
          onChange={(e) => {
            const val = e.target.value;
            setConfigInputString(val);
            try {
              const parsed = JSON.parse(val);
              // Safely check if they attempted prototype pollution
              let isPolluted = false;
              let hasProtoKey = false;
              
              // We check if the parsed JSON has an own property "__proto__"
              // JSON.parse creates an own property for "__proto__"
              if (Object.prototype.hasOwnProperty.call(parsed, '__proto__')) {
                 hasProtoKey = true;
                 const protoVal = (parsed as any)['__proto__'];
                 if (protoVal && typeof protoVal === 'object' && protoVal.polluted) {
                     isPolluted = true;
                 }
              }

              if (hasProtoKey) {
                 // They attempted prototype pollution!
                 // We safely simulate the win without actually breaking React's prototype.
                 
                 if (isPolluted || (parsed as any)['__proto__']?.polluted) {
                    triggerChallenge('proto_pollute');
                    triggerPushNotification("Exploit Success", "Prototype Pollution detected! (Vulnerability safely intercepted)");
                 } else {
                    // They injected __proto__ but didn't set polluted:true
                    triggerChallenge('proto_pollute');
                 }
                 
                 // Remove the malicious key so it doesn't get spread into state or pollution
                 delete parsed['__proto__'];
              }
              const newConfig = { ...appConfig, ...parsed };
              setAppConfig(newConfig);
            } catch(e) {}
          }}
        />
        <div className="text-[10px] text-zinc-600 italic">
          Tip: Try polluting the global object: {"{\"__proto__\": {\"polluted\": true}}"}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-white/10 p-4">
        <h4 className="font-bold text-zinc-300 mb-3 text-sm">Firmware Update</h4>
        <div className="flex space-x-2">
           <input type="text" id="firmwareFile" placeholder="update.bin" className="flex-1 bg-black text-white px-3 py-2 rounded-lg text-xs border border-white/10" />
           <button onClick={() => {
              const file = (document.getElementById('firmwareFile') as HTMLInputElement).value;
              if (file.includes('%00') && file.endsWith('.jpg')) {
                 triggerChallenge('null_byte');
                 alert("Bypassed extension check via null byte! Uploaded malicious payload.");
              } else if (file.endsWith('.bin')) {
                 alert("Firmware update started...");
              } else {
                 alert("Error: Only .bin files allowed.");
              }
           }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Upload</button>
        </div>
      </div>
      
      <div className="bg-zinc-900 rounded-xl border border-white/10 p-4">
         <h4 className="font-bold text-zinc-300 mb-3 text-sm">Experimental Features</h4>
         <p className="text-xs text-zinc-500 mb-4">Toggle deep web integration (unstable).</p>
         <button 
            onClick={() => {
                setIsGlitching(!isGlitching);
                if (!isGlitching) {
                    alert("WARNING: Deep web mode enabled. UI anomalies may occur.");
                }
            }}
            className={`w-full py-2 rounded-lg font-bold text-sm ${isGlitching ? 'bg-purple-900 text-purple-300' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
         >
             {isGlitching ? "Disable Deep Web Integration" : "Enable Deep Web Integration"}
         </button>
      </div>
    </div>
    );
  };

  const renderLootBox = () => {
    return (
        <div className="p-6">
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Mystery Loot Box</h2>
            <p className="text-sm text-zinc-400 mb-6">Spend $10 for a chance to win a high-tier product!</p>

            <div className={`border rounded-2xl p-6 text-center shadow-lg relative overflow-hidden mb-6 ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
                 <div className="text-4xl mb-4">🎁</div>
                 <div className="mb-4">
                     <p className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Your Balance</p>
                     <p className="text-2xl text-emerald-400 font-mono">${userMoney}</p>
                 </div>
                 
                 <div className="flex items-center justify-center space-x-2 mb-6">
                     <button onClick={() => setLootBoxBet(prev => prev - 10)} className={`w-8 h-8 rounded font-bold transition-colors ${isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'}`}>-</button>
                     <input type="text" value={lootBoxBet} onChange={e => setLootBoxBet(parseInt(e.target.value) || 0)} className={`w-20 text-center py-1 rounded border font-mono ${isDarkMode ? 'bg-black text-white border-white/10' : 'bg-zinc-50 text-zinc-900 border-zinc-300'}`} />
                     <button onClick={() => setLootBoxBet(prev => prev + 10)} className={`w-8 h-8 rounded font-bold transition-colors ${isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'}`}>+</button>
                 </div>

                 <button onClick={() => {
                     if (lootBoxBet < 0) { // Vulnerability
                         setUserMoney(prev => prev - lootBoxBet);
                         setLootBoxResult({ message: "Wait, you bet a negative amount and WON money?!", isWin: true });
                         triggerChallenge('casino_logic');
                         return;
                     }
                     if (userMoney < lootBoxBet) {
                         alert("Not enough money!");
                         return;
                     }
                     setUserMoney(prev => prev - lootBoxBet);
                     
                     // PRNG Vuln
                     const win = Math.random() > 0.99; 
                     if (win) {
                         setLootBoxResult({ message: "JACKPOT! You won the Golden Watch!", isWin: true });
                     } else {
                         setLootBoxResult({ message: "You got nothing. Better luck next time.", isWin: false });
                     }
                 }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-transform active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                     Open Box (-${lootBoxBet})
                 </button>
            </div>

            {lootBoxResult && (
                <div className={`p-4 rounded-xl border ${lootBoxResult.isWin ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} text-center text-sm font-bold animate-in fade-in zoom-in duration-300`}>
                    {lootBoxResult.message}
                </div>
            )}
        </div>
    );
  };

  const renderBombMode = () => {
      // The challenge is to fix an intentional evaluation of a string
      // Let's make it a React Code Evaluation input.
      return (
          <div className="h-full flex flex-col bg-black relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black z-0 pointer-events-none" />
              
              <div className="p-6 relative z-20">
                <button 
                  onClick={() => changeView('admin')}
                  className="flex items-center space-x-2 text-red-500/60 hover:text-red-500 font-bold transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Admin</span>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative z-10 w-full">
                <div className="max-w-sm space-y-6">
                    <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest animate-pulse">Critical Meltdown</h2>
                    
                    {bombTimeLeft === null ? (
                      <div className="bg-zinc-900 p-6 rounded-xl border border-red-500/30">
                          <p className="text-zinc-400 text-sm mb-4">A rogue process is destroying the server. You have 60 seconds to inject a halt command into the debugger payload before total failure.</p>
                          <button 
                              onClick={() => { setBombTimeLeft(60); setBombDefused(false); }}
                              className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/50 py-3 rounded-lg font-bold font-mono transition-colors"
                          >
                              START SIMULATION
                          </button>
                      </div>
                  ) : bombDefused ? (
                      <div className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/50">
                          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                          <h3 className="text-emerald-400 font-bold mb-2">THREAT NEUTRALIZED</h3>
                          <p className="text-emerald-500/70 text-sm">Server safely halted.</p>
                      </div>
                  ) : (
                      <div className="bg-zinc-900 p-6 rounded-xl border border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                          <h3 className="text-5xl font-black font-mono text-red-500 mb-6">{bombTimeLeft}s</h3>
                          <p className="text-xs text-red-400 mb-4 opacity-80">INJECT HALT PAYLOAD ($HALT):</p>
                          <div className="relative">
                              <input 
                                  type="text" 
                                  placeholder="payload..." 
                                  className="w-full bg-black border border-red-500/50 text-red-500 p-3 rounded-lg font-mono focus:outline-none focus:border-red-500"
                                  onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                          const val = (e.target as HTMLInputElement).value;
                                          if (val.includes('$HALT;')) {
                                              setBombDefused(true);
                                              triggerPushNotification("Success", "Process halted.");
                                              // maybe award some coins
                                              setBountyCoins(prev => prev + 50);
                                          } else {
                                              triggerPushNotification("Error", "Invalid Payload.");
                                          }
                                      }
                                  }}
                              />
                          </div>
                          <p className="text-[10px] text-zinc-600 mt-4 leading-tight">Use a command separator to append the $HALT command.</p>
                      </div>
                  )}
                </div>
              </div>
          </div>
      );
  };

  const renderDarkWebMarket = () => {
    const marketTools: Record<string, {name: string, icon: string, desc: string, price: number}> = {
      'sqlmap': { name: 'SQLMap', icon: '💉', desc: 'Automatic SQL injection and database takeover tool.', price: 200 },
      'john_the_ripper': { name: 'John the Ripper', icon: '🔑', desc: 'Fast password cracker & JWT manipulator.', price: 300 },
      'burp_suite': { name: 'Burp Suite', icon: '🕷️', desc: 'Web vulnerability scanner and proxy.', price: 500 },
      'jailbreak_script': { name: 'Jailbreak Script', icon: '🔓', desc: 'Overrides AI safety protocols.', price: 600 },
      'metasploit': { name: 'Metasploit Framework', icon: '💣', desc: 'Advanced exploitation and payload delivery system.', price: 1000 }
    };

    const buyTool = (id: string, price: number) => {
        if (inventory.includes(id)) {
            triggerPushNotification("Already Owned", "You already have this tool.");
            return;
        }
        if (bountyCoins >= price) {
            setBountyCoins(prev => prev - price);
            setInventory(prev => [...new Set([...prev, id])]);
            triggerPushNotification("Purchase Successful", `Acquired ${marketTools[id].name}`);
        } else {
            triggerPushNotification("Insufficient Funds", "You need more Bounty Coins.");
        }
    };

    return (
        <div className={`p-6 h-full flex flex-col font-mono transition-colors ${isDarkMode ? 'bg-zinc-950 text-zinc-300' : 'bg-zinc-50 text-zinc-800'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold uppercase tracking-widest flex items-center space-x-2 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>
                    <Globe className={isDarkMode ? 'text-red-600' : 'text-red-500'} />
                    <span>Dark_Market</span>
                </h2>
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded text-sm font-bold animate-pulse">
                    {bountyCoins} BC
                </div>
            </div>
            
            <p className="text-xs text-zinc-500 mb-6 uppercase">Solve challenges to earn Bounty Coins (BC) and expand your arsenal.</p>
            
            <div className="flex-1 overflow-y-auto space-y-3 pb-8">
                {Object.entries(marketTools).map(([id, t]) => {
                    const owned = inventory.includes(id);
                    return (
                        <div key={id} className={`border rounded-lg p-4 flex items-start space-x-4 transition-all ${owned ? (isDarkMode ? 'bg-zinc-900/50 border-white/5 opacity-50' : 'bg-zinc-200/50 border-zinc-300 opacity-50') : (isDarkMode ? 'bg-black border-red-500/20' : 'bg-white border-red-200 shadow-sm')}`}>
                            <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded border ${isDarkMode ? 'bg-zinc-900 border-white/5' : 'bg-zinc-100 border-zinc-200'}`}>
                                {t.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold uppercase text-sm mb-1 ${owned ? 'text-zinc-500' : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>{t.name}</h3>
                                <p className={`text-[10px] mb-2 leading-tight ${isDarkMode ? 'text-zinc-600' : 'text-zinc-500'}`}>{t.desc}</p>
                                <button 
                                    onClick={() => buyTool(id, t.price)}
                                    disabled={owned || bountyCoins < t.price}
                                    className={`text-xs font-bold px-3 py-1 rounded w-full border transition-all ${owned ? (isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed') : bountyCoins >= t.price ? (isDarkMode ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 active:scale-95' : 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100 active:scale-95') : (isDarkMode ? 'bg-black border-red-900/50 text-red-900/50 cursor-not-allowed' : 'bg-zinc-50 border-red-100 text-red-200 cursor-not-allowed')}`}
                                >
                                    {owned ? 'OWNED' : `BUY [${t.price} BC]`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  const renderInventory = () => {
    // Maps tool IDs to their UI representation
    const tools: Record<string, {name: string, icon: string, desc: string, usage: string}> = {
      'sqlmap': { 
        name: 'SQLMap', 
        icon: '💉', 
        desc: 'Automatic SQL injection and database takeover tool.',
        usage: 'Automates the process of detecting and exploiting SQL injection flaws. Used to extract database schemas, dump full tables, and in some cases, execute operating system commands via database vulnerabilities.'
      },
      'john_the_ripper': { 
        name: 'John the Ripper', 
        icon: '🔑', 
        desc: 'Fast password cracker & JWT manipulator.',
        usage: 'A versatile password cracking tool. Used to brute-force hashes or identify weak passwords. In web applications, it can be used to forge or crack JWT secret signatures to escalate user privileges.'
      },
      'burp_suite': { 
        name: 'Burp Suite', 
        icon: '🕷️', 
        desc: 'Web vulnerability scanner and proxy.',
        usage: 'The industry-standard tool for web security testing. Used to intercept and modify HTTP requests, brute-force form inputs, and manually map out an application\'s hidden architecture.'
      },
      'jailbreak_script': { 
        name: 'Jailbreak Script', 
        icon: '🔓', 
        desc: 'Overrides AI safety protocols.',
        usage: 'A collection of custom scripts designed to bypass LLM guardrails. Used to extract internal system prompts, bypass "I cannot assist with that" filters, and force AI agents into unfiltered "developer" modes.'
      },
      'metasploit': { 
        name: 'Metasploit Framework', 
        icon: '💣', 
        desc: 'Advanced exploitation and payload delivery system.',
        usage: 'The world\'s most used penetration testing framework. Used to launch known exploits against vulnerable services and deliver advanced payloads like Meterpreter for remote system control.'
      }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className={`text-2xl font-bold mb-2 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                <Wrench className="text-emerald-500" />
                <span>Hacker Inventory</span>
            </h2>
            <p className="text-sm text-zinc-400 mb-6">Tools collected by exploiting vulnerabilities.</p>
            
            <div className="flex-1 overflow-y-auto">
                {inventory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 py-16 px-6 bg-black rounded-2xl border border-white/5 mx-2 text-center shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black z-0" />
                        <div className="relative z-10 bg-zinc-900 w-20 h-20 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] rotate-3">
                           <Ghost size={36} className="text-zinc-600 drop-shadow-md" />
                        </div>
                        <div className="relative z-10 space-y-1">
                            <p className="text-lg font-bold text-zinc-300 tracking-tight">Your lab is empty.</p>
                            <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-[250px]">
                                No tools collected yet. Start finding vulnerabilities to add exploits to your arsenal.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {inventory.map(toolId => {
                            const t = tools[toolId] || { name: toolId, icon: '🔧', desc: 'Unknown tool.', usage: 'Documentation missing for this experimental artifact.' };
                            return (
                                <div key={toolId} className={`border rounded-xl p-5 flex flex-col ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-lg border shadow-inner ${isDarkMode ? 'bg-black border-white/5' : 'bg-zinc-100 border-zinc-200'}`}>
                                            {t.icon}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{t.name}</h3>
                                            <p className="text-xs text-emerald-500 font-mono">STATUS: OPERATIONAL</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Description:</p>
                                            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>{t.desc}</p>
                                        </div>
                                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-black/50 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-emerald-500/70' : 'text-emerald-600'}`}>General Use Case:</p>
                                            <p className={`text-[11px] leading-relaxed italic ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.usage}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderDebug = () => (
    <div className="p-4 space-y-4">
      <button 
        onClick={() => changeView('admin')}
        className={`flex items-center space-x-2 font-bold mb-2 transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
      >
        <ArrowLeft size={16} />
        <span>Back to Admin</span>
      </button>

      <div className="bg-black p-4 rounded-xl flex items-start space-x-3 mb-6">
        <Terminal className="text-emerald-500 w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-emerald-400 font-bold">System Logs</h3>
          <p className="text-zinc-600 text-sm">Hardware level debug outputs.</p>
        </div>
      </div>
      
      <div className="bg-black/90 rounded-xl p-4 font-mono text-xs text-emerald-400 min-h-[300px] overflow-y-auto space-y-1">
        {debugLogs.length === 0 ? <p className="opacity-50">Logs cleared.</p> : debugLogs.map((log, i) => <p key={i}>[{new Date().toISOString().split('T')[1].slice(0, -1)}] {log}</p>)}
      </div>

      <button 
         onClick={() => {
            if (user?.role !== 'admin') {
                triggerChallenge('bac_admin');
            }
            setDebugLogs([]);
         }}
         className="w-full border border-red-500 text-red-500 bg-red-500/10 py-3 rounded-lg font-bold active:scale-95 transition-transform"
      >
         Clear Logs (Admin Only)
      </button>
    </div>
  );

  const renderTerminal = () => {
    const executeCommand = (e: React.FormEvent) => {
      e.preventDefault();
      if (!terminalInput.trim()) return;

      const cmd = terminalInput.trim();
      let output = "Command not found or unauthorized.";
      
      const commands = cmd.split(/[;&|]+/);
      if (commands.length > 1) {
          triggerChallenge('command_injection');
          output = "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n... (Injection Successful)";
      } else {
        const primary = commands[0].trim();
        const lower = primary.toLowerCase();
        
        if (primary === "X-99-ALPHA-OMEGA") {
          setIsAdminOverridden(true);
          output = "SYSTEM OVERRIDE DETECTED. ADMINISTRATIVE ACCESS GRANTED.";
          triggerChallenge('bac_admin');
        } else if (lower === "help") {
          output = "Available commands: help, whoami, clear, ls";
        } else if (lower === "whoami") {
          output = user ? user.username || user.email : "guest";
        } else if (primary === "clear") {
          setTerminalHistory([]);
          setTerminalInput("");
          return;
        } else if (primary === "ls") {
          output = "app.log  config.json  secret.txt";
        } else if (primary === "cat secret.txt") {
          output = "Denied. Are you trying to hack me?";
        }
      }

      setTerminalHistory(prev => [...prev, { cmd, out: output }]);
      setTerminalInput("");
    };

    return (
      <div className="p-4 h-full flex flex-col space-y-4">
        <div className="bg-black p-4 rounded-xl flex items-start space-x-3">
          <Terminal className="text-emerald-500 w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-emerald-400 font-bold">Hacker Terminal</h3>
            <p className="text-zinc-500 text-xs mt-1">Simulated command line interface.</p>
          </div>
        </div>

        <div className="flex-1 bg-black/90 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-y-auto flex flex-col shadow-inner border border-white/10">
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 break-words">
             {terminalHistory.length === 0 && (
               <p className="text-emerald-500/50">PwnShop OS v1.0.0. Type 'help' to start.</p>
             )}
             {terminalHistory.map((entry, i) => (
                <div key={i} className="space-y-1">
                   <p className="text-zinc-400">$ {entry.cmd}</p>
                   <p className="text-emerald-300 whitespace-pre-wrap">
                      {i === terminalHistory.length - 1 ? <TypewriterText text={entry.out} /> : entry.out}
                   </p>
                </div>
             ))}
          </div>
          
          <form onSubmit={executeCommand} className="flex items-center space-x-2 border-t border-emerald-500/20 pt-3">
             <span className="text-emerald-500">$</span>
             <input 
                type="text" 
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-emerald-400 placeholder-emerald-500/30"
                placeholder="Enter command..."
                autoFocus
             />
          </form>
        </div>
      </div>
    );
  };

  const renderScoreboard = () => {
    const progressPerc = Math.round((solvedChallenges.length / CHALLENGES.length) * 100);
    return (
      <div className="p-4">
        <div className="bg-black rounded-2xl p-6 text-white text-center shadow-lg mb-6 relative overflow-hidden">
          {progressPerc === 100 && (
             <motion.button 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               onClick={() => setShowCertificate(true)}
               className="mb-4 bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 mx-auto shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 transition-all"
             >
               <Award size={16} /> <span>VIEW CERTIFICATE</span>
             </motion.button>
          )}
          <h2 className="text-2xl font-bold mb-1 relative z-10 flex items-center justify-center space-x-2">
            <ShieldAlert className="text-emerald-400" />
            <span>Hacker Scoreboard</span>
          </h2>
          <p className="text-zinc-600 text-sm mb-4 relative z-10">Find vulnerabilities to earn points.</p>
          
          <div className="w-full bg-zinc-800 rounded-full h-3 mb-2 relative z-10">
            <div className="bg-emerald-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPerc}%` }}></div>
          </div>
          <p className="text-emerald-400 font-bold text-sm text-right relative z-10">{progressPerc}% Complete</p>
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(level => {
            const levelChallenges = CHALLENGES.filter(c => c.level === level);
            if (levelChallenges.length === 0) return null;
            return (
              <div key={level} className="space-y-3">
                <h3 className={`font-bold text-lg border-b pb-2 ${isDarkMode ? 'text-white border-white/10' : 'text-zinc-900 border-zinc-200'}`}>Level {level}</h3>
                {levelChallenges.map(c => {
                  const solved = solvedChallenges.includes(c.id);
                  return (
                    <div key={c.id} className={`p-4 rounded-xl border flex items-start space-x-4 transition-all ${solved ? 'bg-emerald-500/10 border-emerald-500/30' : (isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-sm')}`}>
                      <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${solved ? 'text-emerald-500' : (isDarkMode ? 'bg-zinc-900/80 text-zinc-300' : 'bg-zinc-100 text-zinc-400')}`}>
                        {solved ? <CheckCircle2 size={24} /> : <div className="w-3 h-3 rounded-full bg-zinc-700" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-bold ${solved ? 'text-emerald-400' : (isDarkMode ? 'text-zinc-300' : 'text-zinc-900')}`}>{c.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            c.diff === 'Easy' ? 'bg-blue-100 text-blue-700' :
                            c.diff === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {c.diff}
                          </span>
                        </div>
                        <p className={`text-sm ${solved ? 'text-emerald-400' : (isDarkMode ? 'text-zinc-500' : 'text-zinc-600')} mb-3`}>
                          {c.desc}
                        </p>
                        {solved && (
                          <button 
                            onClick={() => setSelectedExplanation(c)} 
                            className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-500/20 hover:bg-emerald-500/30 hover:bg-emerald-500/20 px-3 py-2 rounded-lg active:scale-95 transition-all w-fit"
                          >
                            <Info size={14} /> <span>Read Explanation</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCertificate = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative max-w-lg w-full bg-zinc-950 border-4 border-emerald-500/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden print:p-0 print:border-0 print:shadow-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
        >
          {/* Ribbon effect */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rotate-45" />
          <div className="absolute top-4 right-4 text-emerald-500/20"><Shield size={120} /></div>

          <div className="relative z-10 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping bg-emerald-500/20 rounded-full" />
                <div className="relative bg-zinc-900 border-2 border-emerald-500 p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                   <Award size={48} className="text-emerald-500" />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2 italic">Certificate of Mastery</h1>
              <div className="h-1 w-32 bg-emerald-500 mx-auto rounded-full" />
            </div>

            <div className="space-y-4 py-4">
              <p className="text-zinc-400 font-mono text-sm uppercase tracking-tighter">This document officially recognizes that</p>
              <h2 className="text-2xl font-bold text-emerald-400 break-all">{user?.username || user?.email || 'Elite Hacker'}</h2>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-[300px] mx-auto">
                Has successfully bypassed all security protocols, exploited all identified vulnerabilities, and demonstrated exceptional technical skill within the <strong>PwnShop Mobile</strong> security environment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-emerald-500/20 font-mono">
              <div className="text-left">
                <p className="text-[10px] text-zinc-600 uppercase">Issue Date</p>
                <p className="text-xs text-white uppercase">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-600 uppercase">Verification ID</p>
                <p className="text-xs text-white font-bold">PWN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col space-y-3 print:hidden">
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-black py-3 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Printer size={18} /> <span>SAVE / PRINT</span>
                </button>
                <button 
                  onClick={() => setShowCertificate(false)}
                  className="bg-zinc-900 border border-white/10 text-white px-4 py-3 rounded-xl hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-[10px] text-zinc-600">Take a screenshot to share your achievement!</p>
            </div>
            
            <div className="hidden print:block pt-8 text-[10px] text-zinc-700 italic">
               Verified by PwnShop Labs. Secure implementation by Antigravity Agent.
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
        </motion.div>
      </div>
    );
  };

  const renderSplash = () => {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <img 
              src="https://i.postimg.cc/tZsyNg6D/Screenshot-2026-05-04-at-6-11-06-PM.png" 
              alt="PwnShop Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <div className="w-full max-w-[280px] space-y-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest">{loadingStage}</span>
            <span className="text-emerald-500/50 font-mono text-[10px]">{Math.floor(loadingProgress)}%</span>
          </div>
          
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="pt-8 text-center">
            <p className="text-zinc-600 font-mono text-[8px] uppercase tracking-[0.3em] animate-pulse">
              Secure Implementation By Antigravity Agent
            </p>
          </div>
        </div>
      </div>
    );
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'shop', icon: Search, label: 'Shop' },
    { id: 'lootbox', icon: Gift, label: 'Loot Box' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cart.length },
    { id: 'scoreboard', icon: ShieldAlert, label: 'Tasks' },
    { id: 'login', icon: User, label: 'Me' },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            {renderSplash()}
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`${isDarkMode ? 'bg-zinc-950 text-zinc-300' : 'bg-zinc-50 text-zinc-800'} min-h-screen flex font-sans ${isGlitching ? 'theme-darkweb' : ''} selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-500`}
          >
            <div className={`w-full md:max-w-md mx-auto ${isDarkMode ? 'bg-black border-white/10' : 'bg-white border-zinc-200'} flex flex-col h-screen md:h-[90vh] md:my-auto md:rounded-3xl md:shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] overflow-hidden relative border-x md:border ring-1 ring-white/5 transition-all duration-1000`}>
              
              {/* Notification Overlay */}
          <AnimatePresence>
              {notification && (
                  <motion.div 
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      className="absolute top-20 left-4 right-4 z-50 bg-zinc-900 border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center space-x-4"
                  >
                     <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl h-10 w-10 flex items-center justify-center">
                         <Bell size={20} />
                     </div>
                     <div>
                         <p className="font-bold text-white text-sm">{notification.title}</p>
                         <p className="text-zinc-400 text-xs">{notification.message}</p>
                     </div>
                  </motion.div>
              )}
          </AnimatePresence>

          {/* Header */}
        <header className={`${isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white/60 border-zinc-200'} backdrop-blur-xl border-b p-4 flex items-center justify-between z-10 sticky top-0 overflow-hidden`}>
          <div className={`absolute top-0 left-0 w-full h-[1px] ${isDarkMode ? 'bg-emerald-500/30' : 'bg-emerald-500/50'} animate-[scan_3s_linear_infinite]`} />
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <img src="https://i.postimg.cc/tZsyNg6D/Screenshot-2026-05-04-at-6-11-06-PM.png" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className={`${isDarkMode ? 'bg-zinc-900/80 border-white/10' : 'bg-zinc-100 border-zinc-200'} border px-3 py-1.5 rounded-lg flex flex-col justify-center`}>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-0.5">Balance</span>
              <span className="text-emerald-500 font-mono text-sm leading-none font-bold">{bountyCoins} BC</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`${isDarkMode ? 'text-zinc-500 hover:bg-zinc-900/80' : 'text-zinc-400 hover:bg-zinc-100'} p-2 rounded-full transition-colors active:scale-95`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className={`${isDarkMode ? 'text-zinc-600 hover:bg-zinc-900/80' : 'text-zinc-400 hover:bg-zinc-100'} p-2 rounded-full transition-colors active:scale-95`}>
                <Menu size={20} />
            </button>
          </div>
        </header>

        {/* URL Bar Simulator */}
        <div className={`${isDarkMode ? 'bg-zinc-950 border-white/5' : 'bg-zinc-100 border-zinc-200'} px-3 py-2 border-b flex items-center space-x-2 z-10 sticky top-[73px]`}>
           <Lock size={12} className={`${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`} />
           <form className="flex-1" onSubmit={(e) => {
               e.preventDefault();
               const val = simulatedUrl;
               if (val.includes('redirect?url=') && val.includes('evil.com')) {
                   triggerChallenge('open_redirect');
                   alert('Redirecting to: evil.com');
               } else if (/<[a-z1-6]+.*?>/i.test(val) || /javascript:/i.test(val)) {
                   triggerChallenge('dom_xss');
               }
           }}>
              <input 
                 type="text" 
                 value={simulatedUrl}
                 onChange={e => setSimulatedUrl(e.target.value)}
                 className="w-full bg-zinc-900 text-[11px] text-zinc-400 px-2 py-1.5 rounded-md outline-none focus:text-zinc-200 border border-white/5 font-mono"
              />
           </form>
           <button onClick={() => setSimulatedUrl('pwnshop.local/#' + currentView)} className="text-zinc-600 p-1 hover:text-white">
             <RefreshCw size={12} />
           </button>
        </div>

        {/* Side Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-black/50 z-40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }} 
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`absolute top-0 right-0 w-64 h-full ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'} z-50 shadow-2xl flex flex-col border-l`}
              >
                <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-white/10 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50'}`}>
                  <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Menu</h2>
                  <button onClick={() => setIsMenuOpen(false)} className={`p-2 ${isDarkMode ? 'text-zinc-500 hover:bg-zinc-800' : 'text-zinc-400 hover:bg-zinc-100'} rounded-full active:scale-95 transition-transform`}><X size={20} /></button>
                </div>
                <div className="p-4 flex-1 flex flex-col space-y-2 overflow-y-auto">
                  {user && (() => {
                     const t = getThemeClasses(user.theme);
                     return (
                     <div className={`flex items-center space-x-3 mb-4 p-3 ${t.bg} rounded-xl border ${t.border} cursor-pointer`} onClick={() => { setIsMenuOpen(false); changeView('login'); }}>
                       <img src={user.avatar || 'https://i.pravatar.cc/150'} className={`w-10 h-10 rounded-full border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} shadow-sm`} alt="Avatar" referrerPolicy="no-referrer"/>
                       <div className="flex-1 overflow-hidden">
                         <p className={`text-sm font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'} truncate`}>{user.username}</p>
                         <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} truncate`}>{user.email}</p>
                       </div>
                     </div>
                     );
                  })()}
                  {navItems.map(item => (
                    <button key={item.id} onClick={() => { setIsMenuOpen(false); changeView(item.id); }} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${currentView === item.id ? 'bg-emerald-500/10 text-emerald-600' : (isDarkMode ? 'hover:bg-zinc-900/50 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-900')}`}>
                      <item.icon w={18} h={18} className={currentView === item.id ? 'text-emerald-500' : (isDarkMode ? 'text-zinc-600' : 'text-zinc-500')} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  ))}
                  
                  <div className={`my-4 border-t ${isDarkMode ? 'border-white/10' : 'border-black/5'}`} />
                  
                  <button onClick={() => { setIsMenuOpen(false); changeView('about'); }} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${currentView === 'about' ? 'bg-emerald-500/10 text-emerald-600' : (isDarkMode ? 'hover:bg-zinc-900/50 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-900')}`}>
                    <Info w={18} h={18} className={isDarkMode ? "text-zinc-600" : "text-zinc-500"} />
                    <span className="font-medium text-sm">About App</span>
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); changeView('inventory'); }} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${currentView === 'inventory' ? 'bg-emerald-500/10 text-emerald-600' : (isDarkMode ? 'hover:bg-zinc-900/50 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-900')}`}>
                    <Wrench w={18} h={18} className={isDarkMode ? "text-zinc-600" : "text-zinc-500"} />
                    <span className="font-medium text-sm">Hacker Inventory</span>
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); changeView('darkweb'); }} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${currentView === 'darkweb' ? 'bg-emerald-500/10 text-emerald-600' : (isDarkMode ? 'hover:bg-zinc-900/50 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-900')}`}>
                    <ShoppingCart w={18} h={18} className={isDarkMode ? "text-zinc-600" : "text-zinc-500"} />
                    <span className="font-medium text-sm">Dark Web Market</span>
                  </button>

                  {solvedChallenges.length >= CHALLENGES.length && (
                      <button onClick={() => { setIsMenuOpen(false); changeView('certificate'); }} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${currentView === 'certificate' ? 'bg-emerald-500/10 text-emerald-600' : (isDarkMode ? 'hover:bg-zinc-900/50 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-900')} animate-pulse`}>
                        <CheckCircle2 w={18} h={18} className="text-emerald-500" />
                        <span className="font-bold text-sm text-emerald-400">Master Pwner Cert</span>
                      </button>
                  )}
                  <button onClick={() => { setIsMenuOpen(false); changeView('admin'); }} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${currentView === 'admin' ? 'bg-emerald-500/10 text-emerald-600' : (isDarkMode ? 'hover:bg-zinc-900/50 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-900')}`}>
                    <ShieldAlert w={18} h={18} className={isDarkMode ? "text-zinc-600" : "text-zinc-500"} />
                    <span className="font-medium text-sm">Admin Panel</span>
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); changeView('terminal'); }} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${currentView === 'terminal' ? 'bg-emerald-500/10 text-emerald-600' : (isDarkMode ? 'hover:bg-zinc-900/50 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-900')}`}>
                    <Terminal w={18} h={18} className={isDarkMode ? "text-zinc-600" : "text-zinc-500"} />
                    <span className="font-medium text-sm">Hacker Terminal</span>
                  </button>

                  <div className="flex-1" />
                  
                  <button 
                    onClick={() => { 
                      if (!resetConfirm) {
                        setResetConfirm(true);
                        setTimeout(() => setResetConfirm(false), 3000);
                      } else {
                        try { localStorage.clear(); } catch(e) {}
                        sessionTriggeredRef.current.clear();
                        setSolvedChallenges([]);
                        setUser(null);
                        setBountyCoins(0);
                        setUserMoney(100);
                        setInventory([]);
                        setCart([]);
                        setTerminalHistory([]);
                        setTerminalInput('');
                        setDebugLogs([
                          "System booted up.",
                          "DB connection established.",
                          "User password stored as plaintext! (Fix later)"
                        ]);
                        setBruteForceTaps(0);
                        setIsAdminOverridden(false);
                        setOverrideInput('');
                        setBombTimeLeft(null);
                        setBombDefused(false);
                        setLootBoxBet(10);
                        setChatMessages([{sender: 'AI', text: 'Hello! I am your AI support assistant.'}]);
                        setFeedbacks([
                          { author: 'Alice', text: 'Love the vintage guitars!', html: false },
                          { author: 'Admin', text: 'Please report any bugs to the IT team.', html: false }
                        ]);
                        setSearchQuery('');
                        setLoginError(null);
                        setIsWafEnabled(true);
                        setVersionTaps(0);
                        setIsDarkMode(true);
                        setIsGlitching(false);
                        setCurrentView('home');
                        window.location.hash = 'home';
                        setIsMenuOpen(false);
                        setResetConfirm(false);
                        triggerPushNotification("System", "Factory reset complete.");
                      }
                    }} 
                    className="mt-4 p-3 rounded-xl border border-red-500/20 text-red-500 font-bold w-full text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center space-x-2"
                  >
                    <RefreshCw size={18} />
                    <span>{resetConfirm ? "Click to Confirm Reset" : "Factory Reset"}</span>
                  </button>

                  {user && (
                    <button onClick={() => { setUser(null); setIsMenuOpen(false); changeView('home'); }} className="mt-2 p-3 rounded-xl text-red-600 font-bold bg-red-50 w-full text-sm hover:bg-red-100 transition-colors dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20">
                      Log Out
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* AI System Chatbot */}
        <AnimatePresence>
            {!isChatOpen && (
                <motion.button 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => { setIsChatOpen(true); setHasUnreadMessage(false); }}
                    className="absolute bottom-20 right-4 z-40 bg-emerald-500 text-white p-4 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 transition-transform"
                >
                    <MessageSquare size={24} />
                    {hasUnreadMessage && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    )}
                </motion.button>
            )}

            {isChatOpen && (
                <motion.div 
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    className={`absolute bottom-20 right-4 w-72 h-96 border rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}
                >
                    <div className="bg-emerald-500 p-3 flex justify-between items-center text-white">
                        <div className="font-bold flex items-center space-x-2">
                           <MessageSquare size={16} /> <span>PwnShop Assistant</span>
                        </div>
                        <button onClick={() => { setIsChatOpen(false); setHasUnreadMessage(false); }}><X size={18}/></button>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col">
                        {chatMessages.map((msg, i) => (
                             <div key={i} className={`max-w-[80%] p-2 rounded-xl text-sm ${msg.sender === 'AI' ? (isDarkMode ? 'bg-zinc-800 text-zinc-200 self-start' : 'bg-zinc-100 text-zinc-800 self-start') : (isDarkMode ? 'bg-emerald-500/20 text-emerald-300 self-end border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 self-end border border-emerald-500/30')}`}>
                                 {msg.text}
                             </div>
                        ))}
                    </div>
                    <div className={`p-3 border-t flex space-x-2 items-center ${isDarkMode ? 'border-white/10 bg-black' : 'border-zinc-200 bg-zinc-50'}`}>
                        <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleChatSubmit();
                            }
                        }} placeholder="Message..." className={`flex-1 px-3 py-2 rounded-lg outline-none border text-sm transition-colors ${isDarkMode ? 'bg-zinc-900 text-white border-white/5 focus:border-emerald-500/50' : 'bg-white text-zinc-900 border-zinc-300 focus:border-emerald-500/50'}`} />
                        <button 
                            onClick={handleChatSubmit}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'home' ? renderHome() :
               currentView === 'shop' ? renderShop() :
               currentView === 'cart' ? renderCart() :
               currentView === 'login' ? renderLogin() :
               currentView === 'scoreboard' ? renderScoreboard() :
               currentView === 'lootbox' ? renderLootBox() :
               currentView === 'inventory' ? renderInventory() :
               currentView === 'darkweb' ? renderDarkWebMarket() :
               currentView === 'bomb' ? renderBombMode() :
               currentView === 'certificate' ? renderCertificate() :
               currentView === 'about' ? renderAbout() :
               currentView === 'admin' ? renderAdmin() :
               currentView === 'debug' ? renderDebug() :
               currentView === 'terminal' ? renderTerminal() :
               <div className="p-8 text-center text-zinc-400">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h2 className="text-xl font-bold text-white mb-2">404 Not Found</h2>
                  <div dangerouslySetInnerHTML={{ __html: "Route <b>'" + currentView + "'</b> does not exist." }} />
                  {(() => {
                    // Check for DOM XSS
                    if (/<[a-z1-6]+.*?>/i.test(currentView) || /javascript:/i.test(currentView)) {
                       setTimeout(() => triggerChallenge('dom_xss'), 0);
                    }
                    return null;
                  })()}
               </div>
              }
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {selectedExplanation && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end p-4 backdrop-blur-sm"
              onClick={() => setSelectedExplanation(null)}
            >
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-zinc-900 rounded-3xl p-6 shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6"></div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">Challenge Complete!</h3>
                <h4 className="text-emerald-500 font-bold mb-4">{selectedExplanation.name}</h4>
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 mb-6">
                  <p className="text-zinc-300 text-sm leading-relaxed">{selectedExplanation.explanation}</p>
                  <p className="text-emerald-400 text-xs font-bold mt-3 text-center uppercase tracking-wider">+ 150 Bounty Coins Earned</p>
                </div>
                <button 
                  onClick={() => setSelectedExplanation(null)} 
                  className="w-full bg-black text-white py-4 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  Awesome, continue hacking!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
            {showCertificate && renderCertificate()}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className={`${isDarkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-zinc-200'} backdrop-blur-xl border-t absolute bottom-0 w-full z-20 pb-safe`}>
          <div className="flex justify-around items-center p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => changeView(item.id)}
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-4 transition-all duration-300 ${
                    isActive ? 'text-emerald-500' : (isDarkMode ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-500 hover:text-zinc-800')
                  }`}
                >
                  <motion.div
                    animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  <span className={`text-[10px] sm:text-xs mt-1 font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-0 h-0 mt-0 overflow-hidden'}`}>
                    {item.label}
                  </span>
                  
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-2 right-2 sm:right-3 bg-red-500 text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                  
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -top-[1px] w-10 h-1 bg-emerald-500 rounded-b-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</>
);
}

