[![Screenshot-2026-05-04-at-6-11-06-PM.png](https://i.postimg.cc/DZgZFJwV/Screenshot-2026-05-04-at-6-11-06-PM.png)](https://postimg.cc/tZsyNg6D)
# About The PwnShop

Using inspiration from the OWASP Juice-Shop I introduce the PwnShop—an educational, deliberately insecure application built exclusively for mobile devices. It's designed for cybersecurity enthusiasts, beginners, and seasoned professionals to learn about exploits and vulnerabilities directly from their phone or tablet.

PwnShop aims to teach real-world security concepts through practical, hands-on experience. This environment has been laced with numerous vulnerabilities typically found in production applications, ranging from classic SQL injection and Cross-Site Scripting (XSS) to complex business logic flaws, leaky APIs, and hidden endpoints.

Your ultimate goal is to step into the shoes of an ethical hacker. Navigate the application, hunt down security misconfigurations, and exploit these deliberate flaws. As you uncover vulnerabilities, you will unlock items in your Hacker Inventory, learn the underlying mechanisms of why the exploit works, and discover industry-standard mitigation strategies.

Keep a close eye on the Hacker Scoreboard to track your progress. The more vulnerabilities you find, the closer you get to earning your completion certificate! Good luck, and remember: with great power comes great responsibility. Always conduct security research ethically and legally.

## How to play

### 1. Discover & Explore
Hunt for "leaky" info by tapping through every corner of the app. Look for developer notes left in plain sight, misconfigured buttons, and hidden menus that were never meant for the end-user's eyes.

### 2. Try to break it
Feed the app "broken" data, exploit how it saves your info locally, and try to trick the interface into giving you access or information it shouldn't.

### 3. Hack to learn, learn to build
Discovering a bug isn’t just a win—it’s a lesson. Every vulnerability you find reveals the technical "why" and the industry-standard way to patch it. (If you get stuck, refer to the Cheatsheet above.)

---

## Mobile App (Android)

Get the PwnShop app on your phone:
1. **Download** the latest `.apk` installation file from the releases section below.
2. **Install** the package on your Android device (ensure "Install from Unknown Sources" is enabled in your security settings).
3. **Open** the app and start exploring

---

## Run Locally on PC (Debug/Testing)
**Prerequisites:** Node.js

```bash
# Clone or Download zip file and unzip:
Git clone https://github.com/K4Links/PwnShop-Mobile.git

# In a Terminal:
cd PwnShop-Mobile-main

# Install dependencies:
npm install

# Run the app:
npm run dev
```
**To open app:**

Click the URL shown in the terminal (usually http://localhost:5173 or http://0.0.0.0:5173).

---

### ⭐ Support the Project

If you find **PWNNET** useful, please consider giving the project a **star** ⭐ — it helps a lot!

**Donations (optional but greatly appreciated)**

**Bitcoin (BTC):**
```
bc1qqh84tnwrkm2sn2wg8r8tzt7sljee6q0km8a5wt
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

*Created for Educational Purposes. DO NOT perform these attacks against real targets. Enjoy!!*
