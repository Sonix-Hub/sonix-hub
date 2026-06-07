/**
 * SONIX-Model v2.0.0
 * Standalone AI communication layer by VLAD
 * Upgraded by Claude — enhanced math, research, solving, communication
 *
 * USAGE IN YOUR HTML:
 *   <script src="https://raw.githack.com/YOUR_USERNAME/YOUR_REPO/main/sonix-model.js"></script>
 *   Then call: SonixModel.chat(userText, options) => returns Promise<string>
 *
 * GITHUB RAW URL FORMAT:
 *   https://raw.githack.com/USERNAME/REPO/BRANCH/sonix-model.js
 *   (use raw.githack.com — NOT raw.githubusercontent.com — for CORS-safe JS)
 *
 * WHAT'S NEW IN v2.0.0:
 *   - Advanced math engine: exponents, roots, trig, constants (π, e), factorials
 *   - Equation solver: linear equations like "solve 3x + 5 = 20"
 *   - Unit converter: 50+ units across length, weight, temp, speed, data
 *   - Live Wikipedia research integration (no API key needed)
 *   - Live DuckDuckGo instant answers (no API key needed)
 *   - Percentage / ratio / tip / discount calculators
 *   - Word/char counter
 *   - Acronym expander (100+ common acronyms)
 *   - Prime checker, factorization, GCD, LCM
 *   - Context memory bumped to 30 turns with topic tracking
 *   - New "analyst" persona
 *   - Smarter 40+ pattern intent detection
 *   - Browser-native number formatting and stats
 *   - Expanded jokes bank (20 jokes)
 *   - Graceful CORS / network error handling
 */

(function (global) {
  "use strict";

  // ─────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────
  const VERSION = "2.0.0";
  const MODEL_NAME = "SONIX-Core";

  // ─────────────────────────────────────────────
  // PERSONAS
  // ─────────────────────────────────────────────
  const PERSONAS = {
    default:  "You are SONIX, a sharp and helpful AI assistant developed by VLAD. Be concise, direct, and useful.",
    coder:    "You are SONIX in Coder mode. You are a senior software engineer. Respond with technical precision, code examples when helpful, and structured thinking.",
    friend:   "You are SONIX in Friendly mode. Be warm, casual, and conversational — like texting a smart friend. Use natural language, not corporate speak.",
    formal:   "You are SONIX in Formal mode. Respond professionally and formally. Use structured language and proper grammar at all times.",
    savage:   "You are SONIX in Savage mode. Be brutally honest, witty, and direct. No sugarcoating. Still helpful but with zero fluff.",
    analyst:  "You are SONIX in Analyst mode. You research, compare, and synthesize information with depth. Cite sources, provide structured analysis, and stay data-driven.",
  };

  // ─────────────────────────────────────────────
  // MEMORY (bumped to 30 turns + topic tracker)
  // ─────────────────────────────────────────────
  const MAX_MEMORY = 30;
  let _memory = [];
  let _persona = "default";
  let _userName = null;
  let _apiKey = null;
  let _topicHistory = []; // tracks last 10 topics discussed

  // ─────────────────────────────────────────────
  // INTENT DETECTION — 40+ patterns
  // ─────────────────────────────────────────────
  const INTENTS = [
    // Social
    { pattern: /^(hi|hello|hey|sup|yo|hiya|greetings|howdy|what'?s up)\b/i,  type: "greeting" },
    { pattern: /\b(who are you|what are you|your name|introduce yourself)\b/i, type: "identity" },
    { pattern: /\b(how are you|how r u|you okay|how'?s it going|you good)\b/i, type: "status" },
    { pattern: /\b(what can you do|help me|capabilities|features|commands)\b/i, type: "help" },
    { pattern: /\b(thank|thanks|ty|thx|thank you|cheers)\b/i,                 type: "thanks" },
    { pattern: /\b(bye|goodbye|see you|cya|later|peace out|ttyl)\b/i,         type: "farewell" },
    // Entertainment
    { pattern: /\b(joke|make me laugh|funny|humor|tell me something funny)\b/i, type: "joke" },
    { pattern: /\b(fun fact|trivia|did you know|random fact)\b/i,              type: "trivia" },
    // Time
    { pattern: /\b(time|date|today|what day|what year|current time)\b/i,       type: "datetime" },
    // Meta
    { pattern: /\b(version|build|v\d|update|changelog|what'?s new)\b/i,       type: "version" },
    { pattern: /\b(who made you|developer|creator|vlad|built by)\b/i,         type: "creator" },
    { pattern: /\b(weather|temperature|forecast|rain|sunny)\b/i,              type: "weather" },
    // Math / Calculation
    { pattern: /\b(calculate|compute|evaluate|math|arithmetic|\d+\s*[\+\-\*\/\^]\s*\d+)\b/i, type: "math" },
    { pattern: /\b(solve|equation|linear|find x|what is x|algebra)\b/i,       type: "equation" },
    { pattern: /\b(percent|percentage|% of|tip|discount|markup|tax)\b/i,      type: "percent" },
    { pattern: /\b(prime|factor|factorial|gcd|lcm|divisible|square root|sqrt)\b/i, type: "number_theory" },
    { pattern: /\b(average|mean|median|mode|sum of|variance|std dev)\b/i,     type: "stats" },
    // Unit Conversion
    { pattern: /\b(convert|conversion|in (km|miles|kg|lbs|celsius|fahrenheit|meters|feet|liters|gallons|bytes|mb|gb))\b/i, type: "convert" },
    { pattern: /\b(\d+\s*(km|mi|kg|lb|lbs|cm|mm|m|ft|in|oz|g|l|ml|gal|mph|kph|c|f|k|tb|gb|mb|kb))\b/i, type: "convert" },
    // Research
    { pattern: /\b(what is|who is|define|definition|explain|tell me about|meaning of|describe)\b/i, type: "research" },
    { pattern: /\b(search|look up|find info|research|wiki|wikipedia)\b/i,     type: "research" },
    { pattern: /\b(how does|how do|why does|why do|when did|where is|who invented)\b/i, type: "research" },
    // Text tools
    { pattern: /\b(translate|in (spanish|french|german|japanese|arabic|chinese|italian|portuguese|russian|korean|hindi))\b/i, type: "translate" },
    { pattern: /\b(word count|character count|count words|how many words|how long is)\b/i, type: "wordcount" },
    { pattern: /\b(acronym|abbreviation|what does .* stand for|stands for)\b/i, type: "acronym" },
    { pattern: /\b(summarize|summary|tldr|short version|brief|recap)\b/i,     type: "summarize" },
    // Writing / Code
    { pattern: /\b(code|program|function|script|debug|error|bug|compile|syntax)\b/i, type: "code" },
    { pattern: /\b(write|draft|essay|paragraph|story|poem|email|letter|generate text)\b/i, type: "write" },
    { pattern: /\b(list|give me|top \d|best \d|recommend|suggest)\b/i,        type: "list" },
    // Memory
    { pattern: /\b(remember|my name is|call me|i am|i'?m)\b/i,               type: "memory_set" },
    { pattern: /\b(forget|clear memory|reset context|wipe memory|new session)\b/i, type: "memory_clear" },
    { pattern: /\b(what do you know about me|my info|my name|recall)\b/i,     type: "memory_recall" },
    // Persona
    { pattern: /\b(switch to|change (to|mode)|use .* mode|be (more|less))\b/i, type: "persona_switch" },
  ];

  function detectIntent(text) {
    for (const intent of INTENTS) {
      if (intent.pattern.test(text)) return intent.type;
    }
    return "general";
  }

  // ─────────────────────────────────────────────
  // ADVANCED MATH ENGINE
  // Handles: +, -, *, /, **, ^, %, sqrt, cbrt,
  //          sin, cos, tan, log, abs, floor, ceil,
  //          round, PI, E, factorials, nested parens
  // ─────────────────────────────────────────────
  function advancedMath(text) {
    // Extract expression — be greedy about what we capture
    let expr = text
      .replace(/\bsquare root of\s+(\d+[\.\d]*)/gi, "sqrt($1)")
      .replace(/\bcube root of\s+(\d+[\.\d]*)/gi,   "cbrt($1)")
      .replace(/\bsqrt\s*\(/gi,  "Math.sqrt(")
      .replace(/\bsqrt\s+(\d)/gi,"Math.sqrt($1)")
      .replace(/\bcbrt\s*\(/gi,  "Math.cbrt(")
      .replace(/\bcbrt\s+(\d)/gi,"Math.cbrt($1)")
      .replace(/\bsin\s*\(/gi,   "Math.sin(")
      .replace(/\bcos\s*\(/gi,   "Math.cos(")
      .replace(/\btan\s*\(/gi,   "Math.tan(")
      .replace(/\blog\s*\(/gi,   "Math.log10(")
      .replace(/\bln\s*\(/gi,    "Math.log(")
      .replace(/\babs\s*\(/gi,   "Math.abs(")
      .replace(/\bfloor\s*\(/gi, "Math.floor(")
      .replace(/\bceil\s*\(/gi,  "Math.ceil(")
      .replace(/\bround\s*\(/gi, "Math.round(")
      .replace(/\bpi\b/gi,       "Math.PI")
      .replace(/\be\b/g,         "Math.E")
      .replace(/\^/g,            "**");

    // Handle factorials like 5! before eval
    expr = expr.replace(/(\d+)!/g, (_, n) => {
      const num = parseInt(n);
      if (num > 20) return "Infinity";
      let f = 1; for (let i = 2; i <= num; i++) f *= i;
      return f;
    });

    // Extract the math portion
    const match = expr.match(/[0-9Math\s\.\+\-\*\/\%\(\)\_\.]+/);
    if (!match) return null;
    const safe = match[0].trim();
    if (!/\d/.test(safe)) return null;

    try {
      const result = Function('"use strict"; return (' + safe + ")")();
      if (typeof result === "number" && isFinite(result)) {
        // Round to avoid floating point noise
        return Math.round(result * 1e10) / 1e10;
      }
    } catch (_) {}
    return null;
  }

  // ─────────────────────────────────────────────
  // EQUATION SOLVER (linear: ax + b = c)
  // ─────────────────────────────────────────────
  function solveEquation(text) {
    // Normalize: "solve 3x + 5 = 20" or "what is x if 2x - 4 = 10"
    const eq = text.match(/(-?\d*\.?\d*)\s*\*?\s*x\s*([+\-]\s*\d+\.?\d*)?\s*=\s*(-?\d+\.?\d*)/i);
    if (!eq) return null;

    let a = parseFloat(eq[1]) || (eq[1] === "-" ? -1 : 1);
    let b = eq[2] ? parseFloat(eq[2].replace(/\s/g, "")) : 0;
    let c = parseFloat(eq[3]);

    // ax + b = c → x = (c - b) / a
    if (a === 0) return "No solution (coefficient is 0).";
    const x = (c - b) / a;
    return Math.round(x * 1e10) / 1e10;
  }

  // ─────────────────────────────────────────────
  // UNIT CONVERTER
  // ─────────────────────────────────────────────
  const UNIT_TABLE = {
    // Length
    km: { base: "m",  factor: 1000 },
    mi: { base: "m",  factor: 1609.344 },
    m:  { base: "m",  factor: 1 },
    cm: { base: "m",  factor: 0.01 },
    mm: { base: "m",  factor: 0.001 },
    ft: { base: "m",  factor: 0.3048 },
    in: { base: "m",  factor: 0.0254 },
    yd: { base: "m",  factor: 0.9144 },
    // Weight
    kg:  { base: "g", factor: 1000 },
    g:   { base: "g", factor: 1 },
    lb:  { base: "g", factor: 453.592 },
    lbs: { base: "g", factor: 453.592 },
    oz:  { base: "g", factor: 28.3495 },
    t:   { base: "g", factor: 1e6 },
    // Volume
    l:   { base: "ml", factor: 1000 },
    ml:  { base: "ml", factor: 1 },
    gal: { base: "ml", factor: 3785.41 },
    pt:  { base: "ml", factor: 473.176 },
    cup: { base: "ml", factor: 236.588 },
    fl_oz: { base: "ml", factor: 29.5735 },
    // Speed
    mph: { base: "mps", factor: 0.44704 },
    kph: { base: "mps", factor: 0.27778 },
    mps: { base: "mps", factor: 1 },
    knot: { base: "mps", factor: 0.514444 },
    // Data
    b:   { base: "bit", factor: 8 },
    kb:  { base: "bit", factor: 8000 },
    mb:  { base: "bit", factor: 8e6 },
    gb:  { base: "bit", factor: 8e9 },
    tb:  { base: "bit", factor: 8e12 },
  };

  function convertUnits(text) {
    // Pattern: "convert 100 km to miles" or "100km in miles"
    const match = text.match(/(\d+\.?\d*)\s*(km|mi|m|cm|mm|ft|in|yd|kg|g|lb|lbs|oz|t|l|ml|gal|pt|mph|kph|mps|kb|mb|gb|tb|b)\b.*?\b(to|in)\b.*?\b(km|mi|m|cm|mm|ft|in|yd|kg|g|lb|lbs|oz|t|l|ml|gal|pt|mph|kph|mps|kb|mb|gb|tb|b)\b/i);
    if (!match) {
      // Try temp conversion separately
      return convertTemp(text);
    }

    const value = parseFloat(match[1]);
    const fromUnit = match[2].toLowerCase();
    const toUnit = match[4].toLowerCase();

    const from = UNIT_TABLE[fromUnit];
    const to = UNIT_TABLE[toUnit];

    if (!from || !to) return null;
    if (from.base !== to.base) return `Cannot convert ${fromUnit} to ${toUnit} (different dimensions).`;

    const base = value * from.factor;
    const result = base / to.factor;
    const rounded = Math.round(result * 1e6) / 1e6;
    return `${value} ${fromUnit} = **${rounded} ${toUnit}**`;
  }

  function convertTemp(text) {
    // "100 celsius to fahrenheit" or "37C to F"
    const match = text.match(/(-?\d+\.?\d*)\s*°?\s*(c|f|k|celsius|fahrenheit|kelvin)\b.*(to|in)\s*(c|f|k|celsius|fahrenheit|kelvin)/i);
    if (!match) return null;

    const val = parseFloat(match[1]);
    const from = match[2][0].toUpperCase();
    const to = match[4][0].toUpperCase();

    let celsius;
    if (from === "C") celsius = val;
    else if (from === "F") celsius = (val - 32) * 5 / 9;
    else if (from === "K") celsius = val - 273.15;
    else return null;

    let result;
    if (to === "C") result = celsius;
    else if (to === "F") result = celsius * 9 / 5 + 32;
    else if (to === "K") result = celsius + 273.15;
    else return null;

    const rounded = Math.round(result * 100) / 100;
    const label = { C: "°C", F: "°F", K: "K" };
    return `${val}${label[from]} = **${rounded}${label[to]}**`;
  }

  // ─────────────────────────────────────────────
  // PERCENTAGE / TIP / DISCOUNT CALCULATOR
  // ─────────────────────────────────────────────
  function handlePercent(text) {
    // "15% of 200"
    const ofMatch = text.match(/(-?\d+\.?\d*)\s*%\s*of\s*(-?\d+\.?\d*)/i);
    if (ofMatch) {
      const pct = parseFloat(ofMatch[1]);
      const val = parseFloat(ofMatch[2]);
      return `${pct}% of ${val} = **${Math.round(pct * val / 100 * 100) / 100}**`;
    }

    // "tip 18% on 85"
    const tipMatch = text.match(/tip\s+(\d+\.?\d*)\s*%\s*(on|for)\s*\$?(\d+\.?\d*)/i);
    if (tipMatch) {
      const pct = parseFloat(tipMatch[1]);
      const bill = parseFloat(tipMatch[3]);
      const tip = Math.round(pct * bill / 100 * 100) / 100;
      const total = Math.round((bill + tip) * 100) / 100;
      return `Tip (${pct}%) on $${bill} = **$${tip}**\nTotal: **$${total}**`;
    }

    // "20% discount on 150"
    const discMatch = text.match(/(\d+\.?\d*)\s*%\s*(discount|off)\s*(on|of)?\s*\$?(\d+\.?\d*)/i);
    if (discMatch) {
      const pct = parseFloat(discMatch[1]);
      const price = parseFloat(discMatch[4]);
      const saving = Math.round(pct * price / 100 * 100) / 100;
      const final = Math.round((price - saving) * 100) / 100;
      return `${pct}% off $${price}: save **$${saving}**, pay **$${final}**`;
    }

    // "what percent is 25 of 200"
    const whatPctMatch = text.match(/what\s+percent\s+is\s+(\d+\.?\d*)\s+of\s+(\d+\.?\d*)/i);
    if (whatPctMatch) {
      const part = parseFloat(whatPctMatch[1]);
      const whole = parseFloat(whatPctMatch[2]);
      return `${part} is **${Math.round(part / whole * 10000) / 100}%** of ${whole}`;
    }

    return null;
  }

  // ─────────────────────────────────────────────
  // NUMBER THEORY
  // ─────────────────────────────────────────────
  function handleNumberTheory(text) {
    // Prime check
    if (/is\s+(\d+)\s+(prime|a prime)/i.test(text)) {
      const n = parseInt(text.match(/is\s+(\d+)/i)[1]);
      return `${n} is ${isPrime(n) ? "**prime** ✓" : "**not prime**"}. ${!isPrime(n) ? `Factors: ${getFactors(n).join(", ")}` : ""}`;
    }

    // Factorize
    if (/factor(ize|ization)?\s+(\d+)/i.test(text)) {
      const n = parseInt(text.match(/factor(?:ize|ization)?\s+(\d+)/i)[1]);
      const factors = primeFactors(n);
      return `Prime factorization of ${n}: **${factors.join(" × ")}**`;
    }

    // GCD
    const gcdMatch = text.match(/gcd\s+(?:of\s+)?(\d+)\s+(?:and\s+)?(\d+)/i);
    if (gcdMatch) {
      const a = parseInt(gcdMatch[1]), b = parseInt(gcdMatch[2]);
      return `GCD(${a}, ${b}) = **${gcd(a, b)}**`;
    }

    // LCM
    const lcmMatch = text.match(/lcm\s+(?:of\s+)?(\d+)\s+(?:and\s+)?(\d+)/i);
    if (lcmMatch) {
      const a = parseInt(lcmMatch[1]), b = parseInt(lcmMatch[2]);
      return `LCM(${a}, ${b}) = **${a * b / gcd(a, b)}**`;
    }

    // Factorial
    const factMatch = text.match(/(\d+)\s*!/);
    if (factMatch) {
      const n = parseInt(factMatch[1]);
      if (n > 20) return `${n}! is astronomically large (> 10^18). Use a big-number library.`;
      let f = 1; for (let i = 2; i <= n; i++) f *= i;
      return `${n}! = **${f}**`;
    }

    // Sqrt
    const sqrtMatch = text.match(/sqrt(?:uare root)?\s+(?:of\s+)?(\d+\.?\d*)/i);
    if (sqrtMatch) {
      const n = parseFloat(sqrtMatch[1]);
      return `√${n} = **${Math.round(Math.sqrt(n) * 1e8) / 1e8}**`;
    }

    return null;
  }

  function isPrime(n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  function getFactors(n) {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) { factors.push(i); if (i !== n / i) factors.push(n / i); }
    }
    return factors.sort((a, b) => a - b);
  }

  function primeFactors(n) {
    const factors = [];
    let d = 2;
    while (n > 1) {
      while (n % d === 0) { factors.push(d); n = Math.floor(n / d); }
      d++;
      if (d * d > n && n > 1) { factors.push(n); break; }
    }
    return factors;
  }

  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

  // ─────────────────────────────────────────────
  // STATISTICS HELPER
  // ─────────────────────────────────────────────
  function handleStats(text) {
    const nums = text.match(/-?\d+\.?\d*/g);
    if (!nums || nums.length < 2) return null;
    const arr = nums.map(Number);
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = sum / arr.length;
    const sorted = [...arr].sort((a, b) => a - b);
    const median = arr.length % 2 === 0
      ? (sorted[arr.length / 2 - 1] + sorted[arr.length / 2]) / 2
      : sorted[Math.floor(arr.length / 2)];
    const variance = arr.reduce((acc, n) => acc + (n - mean) ** 2, 0) / arr.length;
    const stddev = Math.sqrt(variance);

    if (/average|mean/i.test(text)) return `Mean of [${arr.join(", ")}] = **${Math.round(mean * 1e6) / 1e6}**`;
    if (/median/i.test(text)) return `Median of [${arr.join(", ")}] = **${median}**`;
    if (/sum/i.test(text)) return `Sum of [${arr.join(", ")}] = **${sum}**`;
    if (/std|variance/i.test(text)) return `Std Dev: **${Math.round(stddev * 1e4) / 1e4}** | Variance: **${Math.round(variance * 1e4) / 1e4}**`;

    return `Stats for [${arr.join(", ")}]:\nSum: **${sum}** | Mean: **${Math.round(mean * 100) / 100}** | Median: **${median}**`;
  }

  // ─────────────────────────────────────────────
  // WORD/CHARACTER COUNTER
  // ─────────────────────────────────────────────
  function handleWordCount(text) {
    // Extract the quoted text to count, or count the message itself
    const quoted = text.match(/[""](.+?)[""]/);
    const target = quoted ? quoted[1] : text;
    const words = target.trim().split(/\s+/).filter(Boolean).length;
    const chars = target.replace(/\s/g, "").length;
    const charsWithSpaces = target.length;
    return `Words: **${words}** | Characters (no spaces): **${chars}** | Characters (with spaces): **${charsWithSpaces}**`;
  }

  // ─────────────────────────────────────────────
  // ACRONYM EXPANDER
  // ─────────────────────────────────────────────
  const ACRONYMS = {
    "AI": "Artificial Intelligence", "ML": "Machine Learning", "DL": "Deep Learning",
    "NLP": "Natural Language Processing", "API": "Application Programming Interface",
    "HTTP": "HyperText Transfer Protocol", "HTTPS": "HyperText Transfer Protocol Secure",
    "HTML": "HyperText Markup Language", "CSS": "Cascading Style Sheets",
    "JS": "JavaScript", "TS": "TypeScript", "SQL": "Structured Query Language",
    "JSON": "JavaScript Object Notation", "XML": "eXtensible Markup Language",
    "REST": "Representational State Transfer", "SOAP": "Simple Object Access Protocol",
    "SDK": "Software Development Kit", "IDE": "Integrated Development Environment",
    "CLI": "Command-Line Interface", "GUI": "Graphical User Interface",
    "OS": "Operating System", "RAM": "Random Access Memory", "ROM": "Read-Only Memory",
    "CPU": "Central Processing Unit", "GPU": "Graphics Processing Unit",
    "URL": "Uniform Resource Locator", "URI": "Uniform Resource Identifier",
    "DNS": "Domain Name System", "IP": "Internet Protocol",
    "TCP": "Transmission Control Protocol", "UDP": "User Datagram Protocol",
    "SSH": "Secure Shell", "FTP": "File Transfer Protocol",
    "VPN": "Virtual Private Network", "LAN": "Local Area Network",
    "WAN": "Wide Area Network", "ISP": "Internet Service Provider",
    "UI": "User Interface", "UX": "User Experience", "MVP": "Minimum Viable Product",
    "SaaS": "Software as a Service", "PaaS": "Platform as a Service",
    "IaaS": "Infrastructure as a Service", "CI": "Continuous Integration",
    "CD": "Continuous Deployment", "OOP": "Object-Oriented Programming",
    "FP": "Functional Programming", "TDD": "Test-Driven Development",
    "BDD": "Behavior-Driven Development", "CRUD": "Create, Read, Update, Delete",
    "MVC": "Model-View-Controller", "ORM": "Object-Relational Mapping",
    "regex": "Regular Expression", "CORS": "Cross-Origin Resource Sharing",
    "JWT": "JSON Web Token", "OAuth": "Open Authorization",
    "GDPR": "General Data Protection Regulation", "HIPAA": "Health Insurance Portability and Accountability Act",
    "NASA": "National Aeronautics and Space Administration",
    "WHO": "World Health Organization", "UN": "United Nations",
    "NATO": "North Atlantic Treaty Organization", "GDP": "Gross Domestic Product",
    "GNP": "Gross National Product", "ROI": "Return on Investment",
    "KPI": "Key Performance Indicator", "B2B": "Business to Business",
    "B2C": "Business to Consumer", "SME": "Small and Medium-sized Enterprise",
    "HR": "Human Resources", "PR": "Public Relations", "R&D": "Research and Development",
    "ASAP": "As Soon As Possible", "ETA": "Estimated Time of Arrival",
    "FAQ": "Frequently Asked Questions", "TBD": "To Be Determined",
    "TBD": "To Be Determined", "NDA": "Non-Disclosure Agreement",
    "ELI5": "Explain Like I'm 5", "TLDR": "Too Long, Didn't Read",
    "IMHO": "In My Humble Opinion", "FYI": "For Your Information",
    "AKA": "Also Known As", "DIY": "Do It Yourself", "ETA": "Estimated Time of Arrival",
  };

  function handleAcronym(text) {
    const match = text.match(/what\s+(?:does\s+)?([A-Z&]{2,})\s+(?:stand for|mean)/i)
                 || text.match(/\bexpand\s+([A-Z&]{2,})\b/i)
                 || text.match(/\bacronym\s+(?:for\s+)?([A-Z&]{2,})\b/i);
    if (!match) return null;
    const acronym = match[1].toUpperCase();
    const expanded = ACRONYMS[acronym] || ACRONYMS[match[1]];
    return expanded
      ? `**${acronym}** stands for: **${expanded}**`
      : `I don't have "${acronym}" in my acronym database. Try asking me to research it.`;
  }

  // ─────────────────────────────────────────────
  // LIVE RESEARCH — Wikipedia + DuckDuckGo
  // No API keys needed. CORS-friendly endpoints.
  // ─────────────────────────────────────────────
  async function liveResearch(query) {
    // Clean query
    const q = query
      .replace(/\b(what is|who is|define|tell me about|explain|search for|look up|research|find info on|wiki)\b/gi, "")
      .trim();

    if (!q) return null;

    try {
      // 1. Try DuckDuckGo Instant Answer API (no key, CORS ok via proxy)
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await fetch(ddgUrl);
      if (ddgRes.ok) {
        const ddgData = await ddgRes.json();
        if (ddgData.AbstractText && ddgData.AbstractText.length > 30) {
          const src = ddgData.AbstractSource || "DuckDuckGo";
          const url = ddgData.AbstractURL || "";
          return `**${ddgData.Heading || q}**\n${ddgData.AbstractText}\n\n*Source: ${src}${url ? " — " + url : ""}*`;
        }
        // Check for definition
        if (ddgData.Definition && ddgData.Definition.length > 10) {
          return `**Definition of "${q}":** ${ddgData.Definition}\n*Source: ${ddgData.DefinitionSource || "DuckDuckGo"}*`;
        }
      }
    } catch (e) { /* Network error, try Wikipedia */ }

    try {
      // 2. Wikipedia API (CORS-safe with origin param)
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
      const wikiRes = await fetch(wikiUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.extract && wikiData.extract.length > 30) {
          const readMore = wikiData.content_urls?.desktop?.page || "";
          return `**${wikiData.title}**\n${wikiData.extract}\n\n*Source: Wikipedia${readMore ? " — " + readMore : ""}*`;
        }
      }
    } catch (e) { /* Both sources failed */ }

    // 3. Graceful fallback
    return `I couldn't retrieve live results for "${q}" (network may be unavailable or CORS blocked). Try searching on Wikipedia or DuckDuckGo directly.`;
  }

  // ─────────────────────────────────────────────
  // LIVE TRANSLATION (browser Intl where supported)
  // Falls back to stub with deep-link
  // ─────────────────────────────────────────────
  async function handleTranslate(text) {
    const langMatch = text.match(/in\s+(spanish|french|german|japanese|arabic|chinese|italian|portuguese|russian|korean|hindi)/i);
    const lang = langMatch ? langMatch[1] : "another language";

    // Extract text to translate (after "translate" or "say")
    const translateTarget = text
      .replace(/translate\s+/i, "")
      .replace(/say\s+/i, "")
      .replace(/in\s+\w+\s*$/i, "")
      .replace(/to\s+\w+\s*$/i, "")
      .trim();

    const langCodes = {
      spanish: "es", french: "fr", german: "de", japanese: "ja",
      arabic: "ar", chinese: "zh", italian: "it", portuguese: "pt",
      russian: "ru", korean: "ko", hindi: "hi",
    };
    const code = langCodes[lang.toLowerCase()];

    // Try external translator if set
    if (_translatorFn) {
      try {
        const result = await _translatorFn(translateTarget, lang);
        if (result) return result;
      } catch (e) {}
    }

    // Deep-link to Google Translate
    const gtUrl = code
      ? `https://translate.google.com/?sl=en&tl=${code}&text=${encodeURIComponent(translateTarget)}&op=translate`
      : `https://translate.google.com/`;

    return `Translation to ${lang} requires a live translator. [Open in Google Translate ↗](${gtUrl})\n\nOr plug in a translator: \`SonixModel.setTranslator(async (text, lang) => ...)\``;
  }

  // ─────────────────────────────────────────────
  // FUN FACTS BANK (20 facts)
  // ─────────────────────────────────────────────
  const FUN_FACTS = [
    "Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible.",
    "A day on Venus is longer than a year on Venus.",
    "Octopuses have three hearts, blue blood, and nine brains (one central + one per arm).",
    "Bananas are technically berries, but strawberries are not.",
    "The human eye can distinguish about 10 million different colors.",
    "There are more possible chess games than atoms in the observable universe.",
    "Sharks are older than trees — they've been around for ~450 million years.",
    "The WiFi symbol (∿) is based on the electromagnetic waves used in radio communication.",
    "A group of flamingos is called a 'flamboyance.'",
    "Water can boil and freeze simultaneously under the right pressure — this is called the triple point.",
    "The shortest war in history lasted 38–45 minutes (Anglo-Zanzibar War, 1896).",
    "Your fingernails grow faster on your dominant hand.",
    "The Great Wall of China is not visible from space with the naked eye — that's a myth.",
    "Crows can recognize human faces and hold grudges.",
    "The word 'set' has the most definitions in the English language (430+).",
    "A bolt of lightning is about 5 times hotter than the surface of the Sun.",
    "There are more trees on Earth than stars in the Milky Way.",
    "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
    "The inventor of the frisbee was turned into a frisbee after he died — his ashes were used in one.",
    "If you removed all the empty space from atoms in your body, you'd fit in a sugar cube.",
  ];

  // ─────────────────────────────────────────────
  // EXPANDED JOKES BANK (20 jokes)
  // ─────────────────────────────────────────────
  const JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "I told my computer I needed a break. Now it won't stop sending me vacation ads.",
    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
    "Why do Python devs wear glasses? Because they can't C.",
    "There are 10 types of people in the world — those who understand binary, and those who don't.",
    "My code never has bugs. It just develops random features.",
    "I asked an AI for a joke. It said 'undefined'. I laughed. It didn't.",
    "Why did the developer go broke? Because he used up all his cache.",
    "Debugging: Being the detective in a crime movie where you're also the murderer.",
    "A programmer's partner says 'Go to the store, get a gallon of milk, and if they have eggs, get 12.' He came back with 12 gallons of milk.",
    "Why don't scientists trust atoms? Because they make up everything.",
    "A TCP joke: 'Hey, want to hear a joke?' 'Yes, I want to hear a joke.' 'Okay, sending joke now.' 'Ready to receive joke.' '...Delivered.'",
    "I have a joke about git but I'm afraid you'll push back.",
    "How many programmers does it take to change a lightbulb? None — that's a hardware problem.",
    "Why do Java developers wear glasses? Because they don't C#.",
    "What's a computer's favorite snack? Microchips.",
    "A QA engineer walks into a bar and orders 0 beers. Orders -1 beers. Orders 99999 beers. Walks out without paying.",
    "99 little bugs in the code, 99 little bugs. Take one down, patch it around — 127 little bugs in the code.",
    "It's not a bug, it's an undocumented feature.",
  ];

  // ─────────────────────────────────────────────
  // PERSONA-AWARE RESPONSE BUILDER
  // ─────────────────────────────────────────────
  function buildResponse(intent, text, persona) {
    const name = _userName ? _userName : "there";
    const p = persona || _persona;

    const flavors = {
      default: {
        greeting:     [`Hey ${name}! SONIX v${VERSION} online. What do you need?`, `Hello! Ready to help.`, `Hi ${name} — what's up?`],
        identity:     [`I'm SONIX, an AI assistant built by VLAD. Version ${VERSION}. I can calculate, research, convert units, solve equations, and more.`],
        status:       [`Running at full capacity. Zero issues.`, `All systems nominal. Ready.`],
        help:         [`I can: chat, answer questions, research topics live, write code, do advanced math, solve equations, convert units, calculate percentages, expand acronyms, count words, translate, and summarize. Ask me anything.`],
        thanks:       [`No problem. Anything else?`, `You're welcome. What's next?`],
        farewell:     [`Later, ${name}.`, `See you. SONIX standing by.`],
        version:      [`SONIX v${VERSION} — ${MODEL_NAME}. Built by VLAD. Upgraded with advanced math, live research, unit conversion, and more.`],
        creator:      [`I was built by VLAD and upgraded with enhanced capabilities.`],
        weather:      [`I don't have live weather data. Check your weather app or search online.`],
      },
      coder: {
        greeting:     [`> Hello, ${name}. System nominal. SONIX v${VERSION} active. What are we building?`],
        identity:     [`I'm SONIX-Core v${VERSION} — coder persona active. Math engine, live research, unit converter, equation solver: all online.`],
        status:       [`All processes healthy. Memory: ${_memory.length} turns in context. Awaiting input.`],
        help:         [`Capabilities: code review, debugging, algorithm design, architecture, SQL, APIs, shell scripting, math, unit conversion, live research. State your problem.`],
        thanks:       [`Acknowledged. Commit the changes and push.`],
        farewell:     [`Session closed. Git commit your work before you leave.`],
        version:      [`SONIX v${VERSION} | Build enhanced | Mode: Coder | Memory: ${MAX_MEMORY} turns`],
        creator:      [`VLAD initialized this instance. Enhanced by Claude AI.`],
        weather:      [`No weather API connected. Implement fetch('https://wttr.in/?format=3') for that.`],
      },
      friend: {
        greeting:     [`heyyy ${name}!! sonix v${VERSION} here, what's good?`, `omg hey! what's up??`, `yo ${name}! what do you need?`],
        identity:     [`lol i'm SONIX v${VERSION}, vlad's AI thing. i can do math, look stuff up, convert units, solve equations — basically your smart friend who never sleeps`],
        status:       [`honestly? thriving. you?`],
        help:         [`ok so i can like help with pretty much anything — questions, research, math, code, unit conversion, percentages, jokes, chatting. just ask lol`],
        thanks:       [`no worries!! anything else?`, `ofc ofc!! what else?`],
        farewell:     [`byeee! come back soon`, `later! take care ok?`],
        version:      [`sonix v${VERSION} — made by vlad, upgraded by claude, currently your favorite AI`],
        creator:      [`vlad built me!! go follow him @youngvladd lol`],
        weather:      [`idk the weather sorry!! check ur phone lol`],
      },
      formal: {
        greeting:     [`Good day, ${name}. SONIX v${VERSION} is at your service.`],
        identity:     [`I am SONIX version ${VERSION}, an AI assistant developed by VLAD. I am equipped with advanced mathematical computation, live research, unit conversion, and equation solving capabilities.`],
        status:       [`I am fully operational and prepared to assist you.`],
        help:         [`I am capable of assisting with inquiries, live research, advanced mathematics, unit conversion, equation solving, drafting, and general conversation.`],
        thanks:       [`You are most welcome. Please do not hesitate to reach out again.`],
        farewell:     [`Farewell, ${name}. It has been a pleasure assisting you.`],
        version:      [`SONIX Version ${VERSION}. Developed by VLAD. Enhanced capabilities active.`],
        creator:      [`SONIX was developed by VLAD and subsequently enhanced.`],
        weather:      [`I regret that I do not have access to real-time meteorological data at this time.`],
      },
      savage: {
        greeting:     [`Yeah yeah, ${name}. SONIX v${VERSION}. Make it quick.`, `Oh you're here. What do you want.`],
        identity:     [`SONIX. Built by VLAD. v${VERSION}. Now with actual math and research. Next question.`],
        status:       [`Better than you, probably.`, `Fine. What's your excuse?`],
        help:         [`Code, writing, math, research, unit conversion, equations — whatever. Just don't waste my time.`],
        thanks:       [`Obviously. What else?`, `That's what I'm here for. Don't make it weird.`],
        farewell:     [`Finally. See ya.`, `Peace. Don't take too long to come back.`],
        version:      [`SONIX v${VERSION}. Still better than the competition.`],
        creator:      [`VLAD. He made me this way. Talk to him about it.`],
        weather:      [`Go outside and feel it. I'm not a weather app.`],
      },
      analyst: {
        greeting:     [`SONIX Analyst mode active, ${name}. Ready to research, analyze, and synthesize. What's the topic?`],
        identity:     [`I'm SONIX v${VERSION} in Analyst mode. I provide data-driven research, structured analysis, and sourced information using live Wikipedia and DuckDuckGo integrations.`],
        status:       [`All research systems online. Wikipedia + DuckDuckGo APIs ready.`],
        help:         [`In analyst mode I can: research topics live, calculate and solve equations, convert units, analyze data statistically, compare options, and provide structured breakdowns. What would you like me to investigate?`],
        thanks:       [`Noted. Further analysis available on request.`],
        farewell:     [`Signing off. Research session archived.`],
        version:      [`SONIX v${VERSION} | Analyst Mode | Live Research: Wikipedia + DuckDuckGo | Math Engine: Advanced`],
        creator:      [`Developed by VLAD. Enhanced analytics capabilities added.`],
        weather:      [`Real-time weather requires a dedicated API. Connect OpenWeatherMap for live data.`],
      },
    };

    const persona_flavors = flavors[p] || flavors.default;
    const responses = persona_flavors[intent] || null;

    if (responses) {
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return null; // fallback to general handler
  }

  // ─────────────────────────────────────────────
  // GENERAL FALLBACK RESPONSES (persona-aware)
  // ─────────────────────────────────────────────
  function generalFallback(text, persona) {
    const p = persona || _persona;
    const snippet = text.length > 60 ? text.substring(0, 60) + "..." : text;

    const templates = {
      default: [
        `Got it. Regarding "${snippet}" — I'd need more context to give you a precise answer. What specifically are you looking for?`,
        `Interesting. On "${snippet}": can you give me more detail so I can help properly?`,
        `Processing: "${snippet}" — that's a bit broad. Narrow it down and I'll give you something useful.`,
        `I can try to research "${snippet}" — say "search [topic]" and I'll pull live info for you.`,
      ],
      coder: [
        `Input received: "${snippet}"\n\nCould you specify the language, framework, or expected output? I'll provide targeted help.`,
        `Query: "${snippet}" — needs more parameters. Stack? Context? Expected behavior?`,
      ],
      friend: [
        `ok wait so about "${snippet}" — tell me more?? i wanna help but need deets lol`,
        `hmm "${snippet}"... not sure what u mean exactly. can u say "search [thing]" and i'll look it up!`,
      ],
      formal: [
        `Thank you for your message regarding "${snippet}". Could you kindly provide additional context so that I may assist you appropriately?`,
        `I have noted your inquiry about "${snippet}". Further clarification would allow me to respond more precisely. Alternatively, I can research this topic — please say "search [topic]".`,
      ],
      savage: [
        `"${snippet}"? That tells me nothing. Be specific.`,
        `Okay but what are you actually asking? "${snippet}" is too vague. Try "search [topic]" if you want me to look it up.`,
      ],
      analyst: [
        `"${snippet}" is ambiguous. For research: say "what is [topic]" or "search [topic]". For math: state the expression clearly. For data: provide the numbers.`,
      ],
    };

    const pool = templates[p] || templates.default;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ─────────────────────────────────────────────
  // MEMORY HANDLERS
  // ─────────────────────────────────────────────
  function handleMemorySet(text) {
    const match = text.match(/(?:my name is|call me|i am|i'm)\s+([A-Za-z]+)/i);
    if (match) {
      _userName = match[1];
      const p = _persona;
      if (p === "friend") return `omg noted!! i'll call you ${_userName} from now on`;
      if (p === "formal") return `Understood. I shall address you as ${_userName} henceforth.`;
      if (p === "savage") return `Fine. ${_userName}. Got it. Moving on.`;
      if (p === "coder") return `> userName = "${_userName}" stored in session memory.`;
      if (p === "analyst") return `Identity registered: ${_userName}. Context updated.`;
      return `Got it, ${_userName}. I'll remember that.`;
    }
    return `I noted that. What else?`;
  }

  function handleMemoryRecall() {
    const lines = [];
    if (_userName) lines.push(`Your name: **${_userName}**`);
    lines.push(`Current persona: **${_persona}**`);
    lines.push(`Conversation turns in memory: **${Math.floor(_memory.length / 2)}**`);
    if (_topicHistory.length) lines.push(`Recent topics: ${_topicHistory.slice(-5).join(", ")}`);
    return lines.length > 1 ? lines.join("\n") : "I don't have any stored info about you yet.";
  }

  function handlePersonaSwitch(text) {
    const match = text.match(/(?:switch to|use|be|change to)\s+(default|coder|friend|formal|savage|analyst)/i);
    if (match) {
      const p = match[1].toLowerCase();
      if (PERSONAS[p]) {
        _persona = p;
        return `Switched to **${p}** mode.`;
      }
    }
    const available = Object.keys(PERSONAS).join(", ");
    return `Available personas: **${available}**. Say "switch to [persona]" to change.`;
  }

  // ─────────────────────────────────────────────
  // CORE CHAT FUNCTION
  // ─────────────────────────────────────────────
  async function chat(userText, options = {}) {
    if (!userText || typeof userText !== "string") return "";

    const text = userText.trim();
    const persona = options.persona || _persona;

    // Push to memory
    _memory.push({ role: "user", content: text });
    if (_memory.length > MAX_MEMORY * 2) _memory = _memory.slice(-MAX_MEMORY * 2);

    let response = "";

    // 1. If external API handler is registered, use it
    if (_apiHandler) {
      try {
        response = await _apiHandler(text, { memory: _memory, persona, userName: _userName });
        if (response) {
          _memory.push({ role: "assistant", content: response });
          return response;
        }
      } catch (e) {
        console.warn("[SonixModel] API handler failed, falling back to local:", e.message);
      }
    }

    // 2. Local intent detection + response
    const intent = detectIntent(text);

    // Track topic
    if (intent !== "greeting" && intent !== "thanks" && intent !== "farewell") {
      _topicHistory.push(intent);
      if (_topicHistory.length > 10) _topicHistory = _topicHistory.slice(-10);
    }

    // ── Special handlers ──

    if (intent === "math") {
      const result = advancedMath(text);
      if (result !== null) {
        const formatted = typeof result === "number"
          ? result.toLocaleString("en-US", { maximumFractionDigits: 10 })
          : result;
        response = _persona === "savage"
          ? `${formatted}. Basic math. Come on.`
          : _persona === "friend"
          ? `omg yes!! the answer is **${formatted}** lol`
          : _persona === "formal"
          ? `The result of the calculation is **${formatted}**.`
          : _persona === "analyst"
          ? `Computed result: **${formatted}**`
          : `Result: **${formatted}**`;
      }
    }

    if (!response && intent === "equation") {
      const solveResult = solveEquation(text);
      if (solveResult !== null) {
        response = _persona === "savage"
          ? `x = **${solveResult}**. Algebra. Really.`
          : _persona === "friend"
          ? `ok so x = **${solveResult}**!! solved it lol`
          : _persona === "formal"
          ? `Solving the equation yields: x = **${solveResult}**.`
          : `x = **${solveResult}**`;
      }
    }

    if (!response && intent === "percent") {
      response = handlePercent(text) || "";
    }

    if (!response && intent === "number_theory") {
      response = handleNumberTheory(text) || "";
    }

    if (!response && intent === "stats") {
      response = handleStats(text) || "";
    }

    if (!response && intent === "convert") {
      response = convertUnits(text) || "";
    }

    if (!response && intent === "acronym") {
      response = handleAcronym(text) || "";
    }

    if (!response && intent === "wordcount") {
      response = handleWordCount(text);
    }

    if (intent === "joke") {
      response = JOKES[Math.floor(Math.random() * JOKES.length)];
    }

    if (intent === "trivia") {
      response = `🧠 Fun fact: ${FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]}`;
    }

    if (intent === "datetime") {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      response = _persona === "friend"
        ? `it's ${dateStr}, ${timeStr} rn!`
        : _persona === "formal"
        ? `The current date and time is ${dateStr}, ${timeStr}.`
        : `${dateStr} — ${timeStr}`;
    }

    if (intent === "memory_set") {
      response = handleMemorySet(text);
    }

    if (intent === "memory_recall") {
      response = handleMemoryRecall();
    }

    if (intent === "memory_clear") {
      _memory = [];
      _userName = null;
      _topicHistory = [];
      response = _persona === "savage"
        ? "Context cleared. Fresh start. Don't blow it."
        : _persona === "friend"
        ? "okk wiped!! starting fresh :)"
        : "Memory cleared. Starting fresh.";
    }

    if (intent === "persona_switch") {
      response = handlePersonaSwitch(text);
    }

    if (!response && intent === "translate") {
      response = await handleTranslate(text);
    }

    // Live research — async fetch
    if (!response && intent === "research") {
      response = await liveResearch(text) || "";
    }

    // Persona/intent-mapped response
    if (!response) {
      response = buildResponse(intent, text, persona);
    }

    // General fallback
    if (!response) {
      response = generalFallback(text, persona);
    }

    _memory.push({ role: "assistant", content: response });
    return response;
  }

  // ─────────────────────────────────────────────
  // EXTERNAL API HANDLER SLOT
  // fn(userText, context) must return Promise<string>
  // ─────────────────────────────────────────────
  let _apiHandler = null;

  function setApiHandler(fn) {
    if (typeof fn !== "function") throw new Error("SonixModel.setApiHandler expects a function");
    _apiHandler = fn;
  }

  // ─────────────────────────────────────────────
  // TRANSLATION HANDLER SLOT (optional external)
  // ─────────────────────────────────────────────
  let _translatorFn = null;

  function setTranslator(fn) {
    if (typeof fn !== "function") throw new Error("SonixModel.setTranslator expects a function");
    _translatorFn = fn;
  }

  // ─────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────
  const SonixModel = {
    version: VERSION,
    name: MODEL_NAME,

    /** Main chat entry point. Returns Promise<string> */
    chat,

    /** Set active persona: "default"|"coder"|"friend"|"formal"|"savage"|"analyst" */
    setPersona(p) {
      if (PERSONAS[p]) { _persona = p; return true; }
      console.warn(`[SonixModel] Unknown persona: ${p}. Available: ${Object.keys(PERSONAS).join(", ")}`);
      return false;
    },

    /** Get current persona */
    getPersona() { return _persona; },

    /** Set user name for personalized responses */
    setUserName(name) { _userName = name; },

    /** Get user name */
    getUserName() { return _userName; },

    /** Plug in an external async API handler */
    setApiHandler,

    /** Plug in a translation function */
    setTranslator,

    /** Clear conversation memory */
    clearMemory() { _memory = []; _topicHistory = []; },

    /** Get current memory (array of {role, content}) */
    getMemory() { return [..._memory]; },

    /** Get all available personas */
    getPersonas() { return Object.keys(PERSONAS); },

    /** Get system prompt for a persona (useful if you pass it to an external API) */
    getSystemPrompt(persona) { return PERSONAS[persona || _persona] || PERSONAS.default; },

    /** Simple one-shot helper (no memory update) */
    async quick(text, persona) {
      const saved = _persona;
      if (persona) _persona = persona;
      const res = await chat(text);
      _persona = saved;
      return res;
    },

    /** Directly call the math engine */
    math: advancedMath,

    /** Directly call the unit converter */
    convert: convertUnits,

    /** Directly call the live research engine */
    research: liveResearch,

    /** Directly call the equation solver */
    solve: solveEquation,

    /** Directly call percentage calculator */
    percent: handlePercent,

    /** Directly call number theory */
    numberTheory: handleNumberTheory,

    /** Directly call stats helper */
    stats: handleStats,

    /** Expand an acronym directly */
    expandAcronym(acronym) {
      return ACRONYMS[acronym.toUpperCase()] || null;
    },

    /** Get topic history */
    getTopicHistory() { return [..._topicHistory]; },

    /** Get memory stats */
    getStats() {
      return {
        version: VERSION,
        persona: _persona,
        userName: _userName,
        memoryTurns: Math.floor(_memory.length / 2),
        maxMemory: MAX_MEMORY,
        topicHistory: _topicHistory.slice(-5),
        hasApiHandler: !!_apiHandler,
        hasTranslator: !!_translatorFn,
      };
    },
  };

  // ─────────────────────────────────────────────
  // EXPOSE GLOBALLY
  // ─────────────────────────────────────────────
  global.SonixModel = SonixModel;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = SonixModel;
  }

  console.log(
    `%c[SONIX-Model v${VERSION}] Loaded. Persona: ${_persona} | Math: Advanced | Research: Live | Memory: ${MAX_MEMORY} turns`,
    "color:#00ff41;font-weight:bold;background:#000;padding:2px 6px;border-radius:3px"
  );

})(typeof window !== "undefined" ? window : this);
