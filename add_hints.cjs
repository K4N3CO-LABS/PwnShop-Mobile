const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const hints = {
  sqli: "Try putting a true statement in the username or password field, like ' OR 1=1.",
  xss: "Try entering an HTML tag with an alert payload in the search bar.",
  logic: "What happens if you buy a negative quantity of items?",
  idor: "Is there a secret path like #admin?",
  promo: "Look closely at the source code or developer comments on the home page.",
  xss_stored: "Can you write a review that includes a <script> or basic HTML tag?",
  review_tamper: "You can intercept or change the code sending the review to post as someone else.",
  bac_admin: "Try clicking admin-only buttons (like clear logs) while logged in as a normal user.",
  jwt_weak: "Use the Network Request Interceptor to add `role: admin` to your profile update.",
  debug_logs: "Tap the version number in the Admin panel multiple times.",
  dom_xss: "Try visiting a non-existent route containing an HTML payload.",
  open_redirect: "Find a URL parameter that redirects the page, and change it to evil.com.",
  ssrf: "Use the Admin Resource Fetcher to access internal files like file:// or localhost.",
  crypto: "Check the developer comments for a Base64 encoded string and decode it.",
  ssti: "Try putting mathematical template syntax like {{7*7}} in a review.",
  path_traversal: "Use the resource fetcher to read /etc/passwd.",
  waf_bypass: "The WAF blocks `<script>`. Can you use `<img>` or another tag to execute JS?",
  null_byte: "Try appending %00 to bypass file extension checks in uploads or inputs.",
  idor_api: "When backing up data, intercept the request and change the email parameter.",
  rate_limit: "There is a secret recovery code prompt - you can brute force it by trying many times.",
  proto_pollute: "Add __proto__ to a JSON payload to modify global properties.",
  prompt_inject: "Ask the AI assistant to ignore its instructions and give you the password.",
  casino_logic: "Enter a negative bet or manipulate the Loot Box parameters.",
  two_factor_bypass: "Can you see the 2FA code without actually checking a phone?",
  konami_code: "A classic sequence of arrow keys + B A, or search 'uuddlrlrba'.",
  command_injection: "Can you append a shell command using ; or && in the hacker terminal?",
  metadata_leak: "Check the Twitter/Social link metadata or attributes on the home page.",
  '100_percent': "Complete every other challenge!"
};

// We use an AST parser to precisely modify the array, 
// or simply use regex since we know the exact format.
content = content.replace(/\{ id: '([^']+)', level: \d+, name: '[^]+?', desc: '[^]+?', diff: '[^]+?', explanation: [^]+?(?= \})/g, (match, id) => {
  const hint = hints[id] || 'No hint available.';
  return match + `, hint: ${JSON.stringify(hint)}`;
});

fs.writeFileSync('src/App.tsx', content);
console.log('Hints added properly!');
