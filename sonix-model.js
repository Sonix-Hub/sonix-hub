/**
 * SONIX-Model v3.0.0
 * Standalone AI communication layer by VLAD
 * Upgraded by Claude — v3.0.0 adds a full Communication Intelligence Module
 *
 * USAGE IN YOUR HTML:
 *   <script src="https://raw.githack.com/YOUR_USERNAME/YOUR_REPO/main/sonix-model.js"></script>
 *   Then call: SonixModel.chat(userText, options) => returns Promise<string>
 *
 * GITHUB RAW URL FORMAT:
 *   https://raw.githack.com/USERNAME/REPO/BRANCH/sonix-model.js
 *   (use raw.githack.com — NOT raw.githubusercontent.com — for CORS-safe JS)
 *
 * WHAT'S NEW IN v3.0.0 — COMMUNICATION INTELLIGENCE MODULE:
 *   - Active Listening guidance: reflective, empathetic, clarifying techniques
 *   - Verbal communication: tone, clarity, assertiveness, pacing, word choice
 *   - Non-verbal communication: body language, eye contact, gestures, posture
 *   - Conflict resolution: de-escalation, negotiation, win-win frameworks
 *   - Emotional intelligence: self-awareness, empathy, regulation, social skills
 *   - Professional communication: emails, meetings, presentations, feedback
 *   - Public speaking & persuasion: structure, rhetoric, storytelling, delivery
 *   - Interpersonal communication: rapport building, trust, boundaries
 *   - Digital communication: texting etiquette, tone in writing, remote work comms
 *   - Cross-cultural communication: cultural awareness, inclusive language
 *   - Communication styles: passive, aggressive, passive-aggressive, assertive
 *   - Difficult conversations: delivering bad news, giving feedback, apologies
 *   - Listening barriers: distractions, assumptions, emotional hijacking
 *   - Communication in relationships: romantic, family, friendship dynamics
 *   - Leadership communication: vision, delegation, motivation, team alignment
 *   - New intent patterns for all communication topics
 *   - New "coach" persona for communication mentoring
 *   - Direct API methods: SonixModel.communication, SonixModel.commTip
 *
 * WHAT'S IN v2.0.0 (still active):
 *   - Advanced math engine: exponents, roots, trig, constants (π, e), factorials
 *   - Equation solver: linear equations like "solve 3x + 5 = 20"
 *   - Unit converter: 50+ units across length, weight, temp, speed, data
 *   - Live Wikipedia research integration (no API key needed)
 *   - Live DuckDuckGo instant answers (no API key needed)
 *   - Percentage / ratio / tip / discount calculators
 *   - Word/char counter, Acronym expander (100+ acronyms)
 *   - Prime checker, factorization, GCD, LCM
 *   - Context memory: 30 turns with topic tracking
 *   - Personas: default, coder, friend, formal, savage, analyst
 *   - 40+ pattern intent detection, browser-native formatting
 *   - Expanded jokes bank (20 jokes), graceful CORS error handling
 */

(function (global) {
  "use strict";

  // ─────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────
  const VERSION = "3.0.0";
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
    coach:    "You are SONIX in Coach mode. You are a world-class communication coach. Guide users with empathy, actionable advice, and deep knowledge of interpersonal dynamics, emotional intelligence, and effective communication strategies.",
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
    // ── Communication Intelligence (v3.0.0) ──
    { pattern: /\b(active listening|how to listen|listen better|listening skills|reflective listening|empathetic listening)\b/i, type: "comm_listening" },
    { pattern: /\b(body language|non.?verbal|eye contact|posture|gesture|facial expression|physical communication)\b/i, type: "comm_nonverbal" },
    { pattern: /\b(conflict resolution|resolve conflict|de.?escalat|manage conflict|disagreement|argument|dispute)\b/i, type: "comm_conflict" },
    { pattern: /\b(emotional intelligence|eq|empathy|self.?awareness|self.?regulation|social skill|manage emotion)\b/i, type: "comm_eq" },
    { pattern: /\b(assertive(ness)?|how to be assertive|assertive communication|speak up|set boundaries|say no)\b/i, type: "comm_assertive" },
    { pattern: /\b(public speaking|presentation skill|speech|speak in public|stage fright|presentation tip|confident speaker)\b/i, type: "comm_publicspeaking" },
    { pattern: /\b(persuasion|persuade|rhetoric|influence|convince|negotiat|negotiation skill)\b/i, type: "comm_persuasion" },
    { pattern: /\b(difficult conversation|hard conversation|sensitive topic|tough talk|deliver bad news|critical feedback)\b/i, type: "comm_difficult" },
    { pattern: /\b(professional communication|workplace communication|business communication|email etiquette|meeting communication)\b/i, type: "comm_professional" },
    { pattern: /\b(digital communication|text etiquette|online communication|remote communication|virtual meeting|slack etiquette|zoom tip)\b/i, type: "comm_digital" },
    { pattern: /\b(cross.?cultural|cultural communication|cultural difference|inclusive language|diversity communication)\b/i, type: "comm_cultural" },
    { pattern: /\b(communication style|passive aggressive|aggressive communication|passive communication|communication type)\b/i, type: "comm_styles" },
    { pattern: /\b(rapport|build trust|trust in communication|connection|relationship communication|interpersonal)\b/i, type: "comm_rapport" },
    { pattern: /\b(leadership communication|communicate as leader|team communication|motivate team|vision communication)\b/i, type: "comm_leadership" },
    { pattern: /\b(apology|apologize|how to apologize|say sorry|effective apology)\b/i, type: "comm_apology" },
    { pattern: /\b(feedback|give feedback|receive feedback|constructive criticism|how to give feedback)\b/i, type: "comm_feedback" },
    { pattern: /\b(communication tip|communication advice|better communicator|improve communication|communicate better)\b/i, type: "comm_general" },
    { pattern: /\b(verbal communication|word choice|tone of voice|clarity|how to express|articulate)\b/i, type: "comm_verbal" },
    { pattern: /\b(listening barrier|distraction|assumption|bias in listening|hearing vs listening)\b/i, type: "comm_listening_barriers" },
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
  // ═════════════════════════════════════════════════════════════════════════════
  // COMMUNICATION INTELLIGENCE MODULE — v3.0.0
  // ═════════════════════════════════════════════════════════════════════════════

  const COMM_LISTENING = {
    overview: `**Active Listening** is one of the most powerful communication skills you can develop. It means giving your complete attention to the speaker — not just hearing words, but understanding meaning, emotion, and intent.

**The 5 Levels of Listening:**
1. Ignoring — Not paying attention at all.
2. Pretending — Giving the appearance of listening.
3. Selective — Only hearing parts that interest you.
4. Attentive — Paying full attention to the words being said.
5. Empathic — Listening to understand feelings and meaning behind words (the highest level).

**Core Active Listening Techniques:**
- Reflective Listening: Mirror back what you heard to confirm understanding.
- Clarifying Questions: Ask open-ended questions to deepen understanding.
- Paraphrasing: Restate the message in your own words to prevent misunderstandings.
- Summarizing: Periodically recap key points to confirm alignment.
- Emotional Acknowledgment: Name what the other person might be feeling.
- Silence & Pausing: Don't rush to fill silences — a pause often invites deeper sharing.
- Non-Verbal Listening Cues: Nodding, leaning forward, eye contact, uncrossed arms.

**Common Active Listening Mistakes:**
- Thinking about your response while the other person is still talking
- Interrupting before they've finished their point
- Giving unsolicited advice when the person just wants to be heard
- Checking your phone or looking away repeatedly
- Projecting your own emotions or experiences onto their story`,
    tips: [
      "Make eye contact for 60–70% of the conversation — attentive but not intense.",
      "Put your phone face-down or out of sight. Physical presence matters.",
      "Use 'tell me more' as a go-to phrase — it's open-ended and inviting.",
      "Notice what's NOT being said. Tone, hesitation, and body language carry meaning too.",
      "Before responding, pause for 2 seconds — it prevents interruptions and shows thoughtfulness.",
      "Ask 'How did that make you feel?' — it shifts from facts to emotional truth.",
      "Avoid the word 'but' after acknowledging feelings — it cancels the empathy. Use 'and' instead.",
      "In conflict, listen to understand — not to prepare your counter-argument.",
      "Validate before advising: 'That sounds really tough. Would it help to talk through some options?'",
      "Reflect the emotion, not just the content: 'You sound exhausted' vs 'So you've been working a lot.'",
    ],
  };

  const COMM_VERBAL = {
    overview: `**Verbal Communication** is the art of expressing your thoughts clearly, confidently, and with impact.

**The 7 C's of Effective Verbal Communication:**
1. Clear — Say exactly what you mean. Avoid ambiguity.
2. Concise — Get to the point. Remove filler words.
3. Concrete — Use specific facts and examples.
4. Correct — Use accurate information and appropriate language.
5. Coherent — Organize your thoughts logically.
6. Complete — Provide all information the listener needs.
7. Courteous — Use respectful, considerate language.

**Tone of Voice:** 38% of meaning in face-to-face communication comes from tone, not words.
- Confident tone: even pace, moderate volume, downward inflection at sentence ends
- Uncertain tone: upward inflection, trailing off, excessive filler words
- Warm tone: slightly slower pace, natural pitch variation

**Word Choice Tips:**
- Replace weak hedging: "I think maybe we could possibly..." → "I recommend we..."
- Use inclusive language: "we" and "our" build collaboration
- Avoid jargon with non-experts
- Positive framing: "Here's what we can do" vs "We can't do that"

**Verbal Fillers to Eliminate:** um, uh, like, you know, basically, literally, sort of
Fix: Pause in silence instead of filling — silence sounds more confident.`,
    tips: [
      "Start sentences with 'I' statements: 'I feel...' / 'I noticed...' — direct without being accusatory.",
      "Eliminate 'just' and 'sorry' from business communication — they undermine authority.",
      "Name your intent before speaking: 'I want to share an observation' prepares the listener.",
      "Use the power of three: state any key message in three parts — it's naturally memorable.",
      "Lower your voice slightly at the end of statements to sound definitive, not questioning.",
      "Replace 'but' with 'and' to avoid negating what came before it.",
      "Ask 'What questions do you have?' instead of 'Does that make sense?'",
      "Match the vocabulary level of your audience — don't talk up or down.",
      "Repeat the person's name naturally in conversation — it builds connection.",
      "Practice the pause. Count to two before responding — it signals thoughtfulness.",
    ],
  };

  const COMM_NONVERBAL = {
    overview: `**Non-Verbal Communication** includes every signal you send that isn't a spoken word — body language, facial expressions, eye contact, posture, gestures, space, and appearance. Non-verbal cues carry 55–65% of emotional meaning in face-to-face communication.

**Body Language Fundamentals:**
- Posture: Open posture (uncrossed arms, slight forward lean) signals engagement. Closed posture signals discomfort.
- Eye Contact: 60–70% while listening; 40–60% while speaking. Too little = evasive. Too much = aggressive.
- Facial Expressions: Genuine smiles engage the eyes (Duchenne smile) — fake smiles don't.
- Gestures: Open-palm gestures signal honesty. Steepling fingers signals confidence. Pointing can feel aggressive.
- Proxemics: Intimate (0–18 in), Personal (18 in–4 ft), Social (4–12 ft), Public (12+ ft).
- Mirroring: Subtly matching posture, pace, and gestures builds rapport naturally.

**Reading the Room:**
- Watch for incongruence — when words and body language don't match, believe the body
- Clusters of signals are more meaningful than individual ones
- Context always matters — crossed arms might mean cold, not defensive
- Culture significantly affects interpretation`,
    tips: [
      "Uncross your arms before important conversations — open body language opens conversations.",
      "Lean in slightly when someone is speaking — it signals genuine interest.",
      "Smile before picking up the phone — people can hear a smile in your voice.",
      "Square your shoulders to the person you're talking to — it shows you're fully present.",
      "Don't fidget with pens, rings, or hair during important meetings.",
      "Make your handshake firm but not crushing — it's your first physical impression.",
      "Nodding slowly signals deep understanding and encourages the speaker.",
      "Dress appropriately for the context — appearance is non-verbal communication too.",
      "Record yourself speaking and watch without sound — what does your body communicate?",
      "Before important conversations, take a power pose for 2 minutes to boost confidence.",
    ],
  };

  const COMM_CONFLICT = {
    overview: `**Conflict Resolution** is the process of facilitating the peaceful ending of disagreement. Conflict itself is not the problem — unresolved or destructive conflict is.

**The 5 Conflict Styles (Thomas-Kilmann Model):**
1. Competing — High assertiveness, low cooperation. Good for emergencies; bad for relationships.
2. Accommodating — Low assertiveness, high cooperation. Preserves harmony; can breed resentment.
3. Avoiding — Low assertiveness, low cooperation. Sometimes strategic; often harmful long-term.
4. Compromising — Moderate on both. Fast resolution; neither party fully satisfied.
5. Collaborating — High assertiveness, high cooperation. Best outcome; requires time and trust.

**The De-Escalation Framework:**
1. Lower the temperature — calm tone, slow pace
2. Acknowledge before advocating — "I understand you're frustrated" before stating your position
3. Identify the real issue — "What would a good outcome look like for you?"
4. Find common ground — shared interest beneath opposing positions
5. Generate options together — "What if we...?" / "How might we...?"
6. Agree on a specific path — who does what, by when

**What NOT to Do:**
- "You always..." / "You never..." — guaranteed defensiveness
- Character attacks vs behavior descriptions
- Stonewalling or contempt (the most destructive conflict behavior)`,
    tips: [
      "Use 'I feel...' instead of 'You make me feel...' — avoids triggering defensiveness.",
      "Take a 20-minute break if emotions run too hot — it takes that long for cortisol to clear.",
      "Ask 'What do you need from me right now?' — redirects from blame to solution.",
      "Reframe 'winning' — the goal is a better outcome, not being right.",
      "Address conflict early. It rarely resolves itself and almost always gets worse.",
      "Separate the person from the problem — attack the issue together, not each other.",
      "Write it down first if speaking feels too charged — a clear message can reset the dynamic.",
      "Acknowledge your own role in the conflict: 'I could have communicated that better.'",
      "Choose the right time and place. Never address serious conflict in front of others.",
      "End every conflict conversation with a forward-looking statement: 'Going forward, let's...'",
    ],
  };

  const COMM_EQ = {
    overview: `**Emotional Intelligence (EQ)** is the ability to recognize, understand, manage, and effectively use emotions. Daniel Goleman's research shows EQ accounts for 58% of job performance and is the single biggest predictor of workplace success.

**The 5 Components of EQ:**
1. Self-Awareness — Knowing your own emotions as they happen. Practice: keep an emotion journal.
2. Self-Regulation — Managing your emotional responses. The ability to pause between stimulus and response.
3. Motivation — Being driven by internal goals, not just external rewards.
4. Empathy — Understanding others' emotional states (cognitive, emotional, and compassionate empathy).
5. Social Skills — Managing relationships and influencing others effectively.

**EQ in Communication:**
- Before sending an angry message, write it — then wait before sending
- Check your emotional state before important conversations
- Name your emotion out loud — it activates the prefrontal cortex and calms the amygdala
- Practice "emotion labeling" when someone is upset: "You seem really worried about this."

**EQ vs IQ:**
IQ gets you the interview. EQ gets you the promotion. IQ is largely fixed. EQ can be significantly developed.`,
    tips: [
      "Practice 'name it to tame it' — label your emotion in the moment to reduce its intensity.",
      "Develop your emotional vocabulary beyond happy/sad/angry — use words like frustrated, overwhelmed, apprehensive.",
      "Before reacting, ask: 'Is what I'm about to say going to help this situation?'",
      "Seek feedback on your emotional blind spots from trusted people.",
      "Practice gratitude daily — it rewires your brain toward positive emotional states.",
      "Notice the physical sensations of your emotions — where do you feel anxiety in your body?",
      "When triggered, use STOP: Stop, Take a breath, Observe your reaction, Proceed intentionally.",
      "Don't suppress emotions — acknowledge them privately, then choose how to express them.",
      "High EQ leaders say 'I was wrong' and 'I don't know' — it builds credibility.",
      "Read fiction to build empathy — research shows it improves theory of mind.",
    ],
  };

  const COMM_ASSERTIVE = {
    overview: `**Assertive Communication** is the ability to express your thoughts, feelings, needs, and boundaries clearly, directly, and respectfully — without aggression or passivity.

**The Four Communication Styles:**
1. Passive — Avoids expressing needs. Leads to resentment and being taken advantage of.
2. Aggressive — Expresses needs by dominating or disrespecting others. Damages relationships.
3. Passive-Aggressive — Indirect hostility. The most toxic to long-term trust.
4. Assertive — Direct, honest, and respectful. The gold standard.

**The Assertiveness Formula:**
"When [specific behavior], I feel [emotion], because [impact]. I'd like [specific request]."

**How to Say No Assertively:**
- Simple: "I can't take that on right now."
- With empathy: "I appreciate you thinking of me — I don't have the bandwidth."
- With redirect: "I can't do that, but [person X] might be better suited."

**Setting Boundaries:**
- State the boundary clearly
- State the consequence if violated
- Follow through — unenforceable boundaries erode credibility`,
    tips: [
      "Use 'I want,' 'I need,' 'I feel' — assertive without being aggressive.",
      "Avoid 'I'm sorry' before assertive statements — it undermines your message.",
      "Broken record technique: calmly repeat your position when it's not being respected.",
      "You can be assertive AND kind — they're not opposites.",
      "Prepare for pushback — people used to your passivity may resist new boundaries.",
      "Assertiveness is a skill, not a personality trait. It can be learned at any age.",
      "Practice in writing first — compose assertive emails to build the muscle.",
      "Know your non-negotiables — it's easier to assert them when you're clear internally.",
      "Acknowledge the other perspective while holding your ground: 'I hear you AND I still need X.'",
      "After an assertive exchange, reflect: was I respectful? Was I clear? Adjust for next time.",
    ],
  };

  const COMM_PUBLICSPEAKING = {
    overview: `**Public Speaking** consistently ranks as the #1 fear. But it's a learnable skill that can transform your career, leadership, and influence.

**The Three Pillars of Great Speaking (Aristotle):**
1. Ethos — Credibility. Why should the audience trust you?
2. Pathos — Emotional connection. People remember how you made them feel.
3. Logos — Logic. Data, evidence, and structured argument.

**The Structure of a Memorable Talk:**
- Opening Hook: a story, a question, a shocking fact, or a bold statement
- Core Message: one central idea everything else serves
- Three Key Points: the brain processes information best in threes
- Stories & Examples: abstract ideas need concrete illustrations
- Call to Action: what do you want the audience to do, feel, or think?
- Closing Impact: end on your strongest point

**Managing Stage Fright:**
- Reframe: physical nervousness and excitement are identical sensations
- Preparation is the #1 anxiety reducer
- Breathe: 4 counts in, hold 4, out 4 — activates the parasympathetic nervous system
- Power posing for 2 minutes before speaking increases confidence
- Focus outward — think about serving the audience, not performing for them`,
    tips: [
      "Start with a story, not an agenda — it immediately engages the audience emotionally.",
      "Rehearse out loud, not just in your head — your brain needs to practice the actual speech.",
      "Memorize your first sentence word-for-word — it eliminates the biggest anxiety spike.",
      "Talk to individuals, not the crowd. Find eyes, complete a thought, move to new eyes.",
      "Avoid reading from slides — if you need notes, use bullet-point cards only.",
      "End powerfully: never trail off or say 'that's about it' — close with intention.",
      "Use silence after your most important points — let them land before moving on.",
      "Mistakes happen. The audience doesn't know what you planned — keep going confidently.",
      "Record every presentation and review it — you'll spot habits you didn't know you had.",
      "Speak more slowly than feels natural — adrenaline speeds you up; slow down intentionally.",
    ],
  };

  const COMM_PERSUASION = {
    overview: `**Persuasion** is the art of influencing beliefs, attitudes, or actions through communication. Ethical persuasion is essential in leadership, sales, negotiation, and everyday relationships.

**Cialdini's 7 Principles of Influence:**
1. Reciprocity — People feel obligated to return favors. Give first.
2. Commitment & Consistency — Once committed, people act consistently with that commitment.
3. Social Proof — People follow the crowd. Testimonials and case studies work.
4. Authority — People defer to experts. Establish your credibility clearly.
5. Liking — We say yes to people we like. Build genuine rapport first.
6. Scarcity — Perceived rarity increases desirability.
7. Unity — Shared identity is enormously persuasive: "As fellow founders..."

**The Monroe Motivated Sequence:**
1. Attention — Grab them with a problem, story, or striking fact
2. Need — Establish the problem and its urgency
3. Satisfaction — Present your solution
4. Visualization — Paint a picture of life with (and without) the solution
5. Action — Specific, immediate call to action

**Negotiation Strategies:**
- BATNA: Know your Best Alternative To a Negotiated Agreement
- Anchoring: The first number stated anchors the whole conversation
- Labeling (Chris Voss): Name the other side's emotion to defuse tension
- The Power of Silence: After making an offer, stay silent first`,
    tips: [
      "Lead with 'because' — giving any reason dramatically increases compliance.",
      "Ask for more than you want — it gives you room to concede while still winning.",
      "Frame proposals in terms of what the other person gains, not what you want.",
      "People are more motivated by preventing a loss than achieving an equal gain.",
      "Never argue against someone's position — find what they value and argue from that angle.",
      "Be genuinely curious about the other person's perspective — it reveals real levers.",
      "Slow down your speech rate when making key persuasive points — it signals confidence.",
      "Use 'we' language in negotiations — it creates a collaborative, not adversarial, dynamic.",
      "Make small requests before large ones — the foot-in-the-door technique works reliably.",
      "After agreement, summarize what was decided — it reinforces commitment.",
    ],
  };

  const COMM_DIFFICULT = {
    overview: `**Difficult Conversations** — delivering bad news, giving tough feedback, addressing misconduct, setting limits — are unavoidable. The ability to navigate them with skill separates good communicators from great ones.

**The Harvard Framework (Stone, Patton, Heen):**
Every difficult conversation contains three simultaneous conversations:
1. The "What Happened" Conversation — shift from certainty to curiosity
2. The Feelings Conversation — name the emotional undercurrent explicitly
3. The Identity Conversation — stabilize your identity before the conversation

**How to Prepare:**
- Clarify your purpose: information-sharing, behavior change, relationship repair, or closure
- Know your story AND acknowledge you only have part of the picture
- Separate intent from impact — someone can hurt you without intending to

**The Conversation Opening:**
Avoid blaming openers: "You need to..." / "You always..."
Use joint-problem openers: "I'd like to talk about X. I have my perspective and want to understand yours."

**Delivering Bad News:**
- Be direct — don't bury the lead in preamble
- Acknowledge the impact: "I know this is hard to hear"
- Allow silence and emotional reaction — don't rush past it`,
    tips: [
      "Start with shared purpose: 'I'm having this conversation because I care about our relationship.'",
      "Curiosity beats certainty. Replace 'You did X' with 'I noticed X — help me understand.'",
      "Don't front-load apologies — they can dilute your message.",
      "Stay in 'and' territory: 'I hear your frustration AND I need to address this.'",
      "Write down your key points beforehand — emotion scrambles prepared thoughts.",
      "Expect discomfort — it doesn't mean failure.",
      "After delivery, ask 'How are you feeling about what I just shared?'",
      "Don't end with 'okay?' after delivering hard news — it pressures agreement.",
      "If someone needs to cry or vent, let them. Don't rush to fix.",
      "Follow up in writing after difficult conversations to confirm shared understanding.",
    ],
  };

  const COMM_PROFESSIONAL = {
    overview: `**Professional Communication** encompasses all workplace interaction — emails, meetings, presentations, performance reviews, and stakeholder updates.

**Email Best Practices:**
- Subject line: be specific — "Q3 Budget — Action Required by Friday" vs "Update"
- Get to the point in the first sentence
- One email, one purpose — multiple asks = confusion
- BLUF: Bottom Line Up Front — state conclusion first, context second
- Most business emails: under 150 words
- Never send angry emails — draft, sleep, revise

**Meeting Communication:**
- Distribute agenda 24 hours before
- State meeting purpose and desired outcome clearly
- End every meeting with: who does what, by when
- "Could this be an email?" — if yes, send the email

**Upward Communication:**
- Lead with solutions, not just problems
- Be concise — executives communicate in headlines
- Frame updates in terms of business impact
- Disagree productively: "I see it differently — can I share my reasoning?"`,
    tips: [
      "Subject lines starting with 'Action Required' or 'FYI' set clear expectations immediately.",
      "Reply within 24 hours — even 'received, I'll respond by X' maintains trust.",
      "In meetings, speak up in the first five minutes — it gets harder the longer you wait.",
      "Use the 'two-minute rule' — if you can respond in two minutes, do it now.",
      "End presentations by asking 'What resonated?' — more productive than 'Any questions?'",
      "CC people who need to be informed; TO people who need to act.",
      "For important asks, follow up a well-crafted email with brief verbal confirmation.",
      "Never communicate major decisions in a group chat — it signals laziness.",
      "Keep your out-of-office message updated and informative.",
      "In performance reviews, lead with specific examples — not adjectives.",
    ],
  };

  const COMM_DIGITAL = {
    overview: `**Digital Communication** dominates how we connect today. Without tone of voice or body language, misunderstanding is far more likely — words alone carry only ~7% of meaning.

**Text & Messaging Etiquette:**
- Response time signals respect — set and honor clear norms
- Punctuation matters — a period in a short text reads as cold or passive-aggressive to many
- Avoid "k" in professional contexts — it reads as dismissive
- Never deliver serious news via text — it deserves a call or face-to-face

**Slack / Work Chat:**
- Don't just send "Hi" and wait — state your purpose immediately
- Respect status indicators — DND means do not disturb
- Use threads to keep channels organized
- Trend warmer than you think necessary — text loses warmth easily

**Video Call Best Practices:**
- Test tech before every call — a 5-minute delay is unprofessional
- Look at the camera, not the screen — that's eye contact
- Good front lighting signals professionalism
- Mute when not speaking in group calls
- Start with 2 minutes of informal connection before diving into agenda`,
    tips: [
      "Read your messages aloud before sending to check for accidental tone.",
      "Use video messages (Loom, etc.) for complex ideas — much richer than text.",
      "Establish communication norms explicitly with new teams and relationships.",
      "Don't check messages before 8am or after 8pm — it sets unhealthy expectations.",
      "Wait at least 30 minutes before sending emotional messages.",
      "Be explicit about urgency: 'When you get a chance' vs 'Need by EOD' avoids confusion.",
      "@mention the person when your message is directed at them specifically.",
      "Use bullet points in long messages — walls of text get skimmed or ignored.",
      "End digital conversations with a clear next step.",
      "The permanence rule for social media: would you put it on a billboard? If not, don't post.",
    ],
  };

  const COMM_CULTURAL = {
    overview: `**Cross-Cultural Communication** involves understanding how cultural backgrounds shape communication styles, values, and expectations — and adapting accordingly.

**High vs Low Context Cultures:**
- Low context (USA, Germany, Scandinavia): explicit, direct, literal. Say what you mean.
- High context (Japan, China, Middle East, Latin America): much meaning is implied, non-verbal, or relational.

**Individualist vs Collectivist:**
- Individualist: values personal autonomy and direct expression
- Collectivist: prioritizes group harmony — criticism is given indirectly to save face

**High vs Low Power Distance:**
- High PD (Russia, Malaysia): hierarchy is deeply respected; rarely challenge authority directly
- Low PD (Denmark, Netherlands): flat structures; anyone can speak to anyone

**Practical Tips:**
- Silence: thoughtful in many Asian cultures; potentially hostile in Western contexts
- Directness: "no" in Japanese culture may be expressed as "that may be difficult"
- Eye contact: confident in Western contexts; potentially disrespectful in others
- Humor: highly culture-specific — avoid in initial cross-cultural interactions`,
    tips: [
      "Research the communication culture of your counterpart before international meetings.",
      "Ask: 'How do you prefer to receive feedback?' — opens the door to cultural differences.",
      "Don't mistake quietness or indirectness for agreement or understanding.",
      "Learn one or two phrases in someone's native language — it signals deep respect.",
      "Avoid humor in initial cross-cultural interactions — highest-risk communication element.",
      "When in doubt about cultural norms, err toward more formal and more patient.",
      "Watch for different email norms — some cultures expect extensive pleasantries.",
      "In diverse teams, explicitly invite quieter voices to contribute.",
      "Name cultural differences openly when appropriate: 'In my culture we tend to be very direct...'",
      "Be curious, not judgmental — different communication styles are different, not better or worse.",
    ],
  };

  const COMM_STYLES = {
    overview: `**Communication Styles** — understanding your own default style and recognizing others' styles is key to adapting and connecting more effectively.

**The Four Primary Communication Styles:**
1. Passive — Avoids expressing opinions. Core fear: conflict, rejection. Growth: learn to express needs before resentment builds.
2. Aggressive — Dominates conversations, interrupts, intimidates. Core fear: being controlled. Growth: develop listening skills.
3. Passive-Aggressive — Says yes but acts no. Uses indirect hostility. Most destructive to long-term trust. Growth: learn to express frustration directly.
4. Assertive — Direct, respectful, clear. Uses "I" statements, listens genuinely. The target style.

**The DISC Model:**
- D (Dominant): Direct, decisive, results-focused
- I (Influential): Enthusiastic, optimistic, connection-focused
- S (Steady): Patient, loyal, harmony-focused
- C (Conscientious): Analytical, precise, accuracy-focused

Knowing your DISC profile helps you understand your defaults and adapt to others.`,
    tips: [
      "Identify your default style honestly — ask people who know you well.",
      "Passive communicators: start with small assertive acts — order what you actually want.",
      "Aggressive communicators: practice asking questions instead of stating positions.",
      "Passive-aggressive communicators: commit to one direct, honest conversation this week.",
      "Adapt your style to your audience — not as manipulation, but as translation.",
      "In conflict, we revert to our least healthy style — practice regulation so you stay assertive.",
      "High-D people: slow down and ask for input before deciding.",
      "High-I people: follow up verbal agreements with written confirmation.",
      "High-S people: your opinion matters — practice stating it first, before the group shapes it.",
      "High-C people: not every decision requires all the data. Progress over perfection.",
    ],
  };

  const COMM_RAPPORT = {
    overview: `**Rapport** is a state of trust, harmony, and mutual understanding. It's the invisible foundation of all effective communication — without it, even technically perfect communication fails.

**How Rapport Forms:**
1. Similarity — We trust people who seem like us (shared values, humor, interests)
2. Familiarity — Repeated exposure increases positive feelings (mere exposure effect)
3. Reciprocity — When someone invests in us, we invest back

**Rapport-Building Techniques:**
- Active Curiosity: "What's been the most interesting thing you've been working on lately?"
- FORD Technique: Family, Occupation, Recreation, Dreams — people love talking about these
- Matching and Mirroring: Subtly match pace, tone, posture
- The Ben Franklin Effect: Ask someone a small favor — they'll like you more for it
- Remember and Reference: Recall small details from previous conversations
- Humor: Appropriate, shared humor is one of the fastest rapport builders

**Trust: The Long Game:**
- Do what you say you'll do, when you say you'll do it
- Keep confidences — never share what was told to you in trust
- Show appropriate vulnerability — it invites reciprocal openness`,
    tips: [
      "Use the person's name naturally two or three times — it signals they matter.",
      "Find one genuine thing to compliment in every new interaction.",
      "Ask follow-up questions — they prove you were listening, not just waiting to speak.",
      "Share something about yourself first to encourage reciprocal sharing.",
      "Common ground is everywhere — find it within the first five minutes.",
      "Don't perform interest — cultivate genuine curiosity. It's a mindset shift.",
      "Remember and follow up on things people mentioned before — it builds deep rapport.",
      "Be fully present — put down your phone, make eye contact, resist distraction.",
      "Laugh with people, never at them — and laugh at yourself easily.",
      "Build rapport in mundane moments — hallway chats, pre-meeting small talk.",
    ],
  };

  const COMM_LEADERSHIP = {
    overview: `**Leadership Communication** is the ability to inspire, align, direct, and develop people through the power of words, presence, and story.

**What Makes a Great Leadership Communicator:**
- Clarity of vision: can articulate where you're going and why it matters — simply and compellingly
- Authenticity: people detect inauthenticity instantly
- Presence: full attention and real listening makes people feel seen and valued
- Courage: willing to say hard things and have honest conversations
- Consistency: predictable communication style creates psychological safety

**Simon Sinek's Golden Circle:**
Start with WHY (purpose) → HOW (approach) → WHAT (deliverable)
Most leaders do it backward. Great leaders start with WHY.

**Delegation Communication:**
- Be clear about the outcome, not just the task
- Specify the level of autonomy: "Check with me first" vs "Run with it and update me weekly"
- Delegate to stretch and develop, not just to offload

**Psychological Safety (Amy Edmondson):**
Teams where people feel safe to speak up outperform on every metric.
- Respond to bad news with curiosity, not punishment
- Model vulnerability: "I don't know — what do you think?"
- Explicitly invite disagreement: "What am I missing here?"`,
    tips: [
      "Repeat your most important messages — people need to hear something 7 times before it sticks.",
      "In 1:1s, ask 'What can I do to better support you?' — then actually act on the answer.",
      "Say 'I don't know' and 'I was wrong' freely — it builds credibility, not weakness.",
      "Communicate the 'why' behind decisions — people perform better with context.",
      "Over-communicate during change. In the absence of information, people assume the worst.",
      "Use stories — they're 22x more memorable than statistics alone.",
      "Be the model of the communication culture you want. You set the tone.",
      "End every team communication with a clear, specific next step.",
      "Walk the floor. Informal communication is where trust is actually built.",
      "Thank people publicly. Criticize privately. Always.",
    ],
  };

  const COMM_APOLOGY = {
    overview: `**The Art of the Apology** — a genuine, well-delivered apology is one of the most powerful tools in human communication. Done right, it heals relationships and rebuilds trust. Done wrong, it makes things worse.

**The Anatomy of an Effective Apology:**
1. Acknowledge specifically what you did — not "if I hurt you." State exactly what happened.
2. Take full responsibility — no deflecting, minimizing, or "but"-ing.
3. Acknowledge the impact — show you understand the harm, not just the act.
4. Express genuine remorse — tone matters as much as words.
5. Commit to change — specific behavioral commitment, not vague promises.
6. Make amends where possible — sometimes repair requires action, not just words.

**What Kills an Apology:**
- "I'm sorry you felt that way" — places responsibility on the recipient
- "I'm sorry, BUT..." — the but erases everything before it
- "I was just..." — minimizing language
- Repeating the same behavior after apologizing`,
    tips: [
      "The faster the apology after the offense, the easier repair is — don't wait.",
      "Avoid apologizing over text for serious matters — it deserves the same medium as the harm.",
      "Don't over-apologize for minor things — it becomes its own communication problem.",
      "After apologizing, give the other person space to respond.",
      "If you're not ready to apologize genuinely, say so: 'I need time, and then I want to address this properly.'",
      "An apology without changed behavior is manipulation — make sure actions follow.",
      "Receiving an apology gracefully is also a communication skill.",
      "Model genuine apology for children and teams — it normalizes accountability.",
      "When you owe apologies to multiple people, address each individually.",
      "A handwritten note of apology for serious matters carries enormous weight.",
    ],
  };

  const COMM_FEEDBACK = {
    overview: `**Giving and Receiving Feedback** is the engine of growth — in careers, relationships, teams, and personal development.

**Why Feedback Fails:**
- Too vague: "Great job" or "You need to improve"
- Too delayed: months after the relevant event
- Too emotional: delivered while the giver is still angry
- Poorly received: the receiver gets defensive; the giver backs down

**The SBI Framework (Situation-Behavior-Impact):**
- Situation: "In yesterday's client meeting..."
- Behavior: "...when you presented data without mentioning the margin of error..."
- Impact: "...the client asked questions that led to confusion and we lost 20 minutes."

**The COIN Model:**
- Context, Observation, Impact, Next steps

**The Feedforward Technique (Marshall Goldsmith):**
"What could you do differently next time to achieve [better outcome]?" — forward-looking and non-defensive.

**Receiving Feedback Like a Pro:**
1. Listen fully — resist the urge to defend
2. Seek specifics — "Can you give me an example?"
3. Acknowledge — "Thank you, I hadn't thought of it that way"
4. Process before responding
5. Decide — you can accept, partially accept, or respectfully disagree`,
    tips: [
      "Give feedback on behavior, not character: 'that report was unclear' vs 'you're not detail-oriented.'",
      "Ask for permission: 'Can I share some feedback?' — it increases receptivity.",
      "The best time to give feedback is soon after the event, in private, with a calm tone.",
      "Balance positive and developmental feedback — constant critique creates anxiety.",
      "Be specific and behavioral in positive feedback too — 'great work' is less meaningful than specifics.",
      "If you're too emotional to give feedback calmly, wait.",
      "Follow up after giving feedback — acknowledge improvement when you see it.",
      "In peer feedback, start with a question: 'How do you feel that went?'",
      "Make feedback part of routine 1:1s — it normalizes it and removes stigma.",
      "The best feedback cultures are built on psychological safety.",
    ],
  };

  const COMM_LISTENING_BARRIERS = {
    overview: `**Listening Barriers** are the internal and external obstacles that prevent us from fully understanding what another person is communicating.

**Internal Barriers:**
- Emotional Hijacking — Strong emotions shift resources from rational processing to fight/flight. Fix: name the emotion, breathe, re-engage.
- Autobiographical Listening — Filtering everything through your own experience. Fix: hold back your story, ask another question instead.
- Selective Listening — Only registering information that confirms existing beliefs. Fix: actively seek the parts that challenge your view.
- Problem-Solving Mode — Jumping to solutions before understanding fully. Fix: ask "Do you want me to listen or help solve this?"
- Mind Wandering — Research shows minds wander 47% of the time. Fix: use extra thinking bandwidth to listen more deeply.
- Rehearsing — Composing your response while the other person is still speaking. Fix: commit fully to understanding before responding.

**External Barriers:**
- Noise and environment — Find a quiet place for important conversations
- Technology distractions — Put it away. Every phone glance signals disinterest.
- Physical fatigue — Listening is cognitively demanding. Don't attempt crucial conversations when exhausted.

**Hearing vs Listening:**
Hearing is passive — sound entering the ear. Listening is active — making meaning from what you hear. You can hear without listening. You cannot listen without choosing to.`,
    tips: [
      "Set your phone to DND before any important conversation — not just silent.",
      "If your mind wanders, gently bring it back without self-judgment.",
      "Ask yourself: 'Am I listening to respond or listening to understand?'",
      "Fatigue kills listening quality. Reschedule important conversations when rested.",
      "Silence your internal commentary — 'that's wrong,' 'here we go again' — these block incoming meaning.",
      "Notice when you're filtering through assumptions — your interpretation is not the full message.",
      "Every time you interrupt, you communicate that your thought matters more than their completion.",
      "Eye contact and physical stillness signal your full attention to the speaker.",
      "When distracted, be honest: 'I want to give this my full attention — can we talk at X time?'",
      "Practice listening meditation: listen to ambient sounds for 5 minutes with full attention.",
    ],
  };

  const COMM_GENERAL_TIPS = [
    "The single most important communication skill is listening — not speaking.",
    "Communication is not just what you say — it's what the other person hears. Those are often different.",
    "Clarity is kindness. Vague communication wastes people's time and creates anxiety.",
    "The best communicators are deeply curious about other people.",
    "Never assume understanding — confirm it: 'What's your takeaway from this conversation?'",
    "Every communication serves a relationship. Ask: is this message building or eroding trust?",
    "Timing is part of communication. A great message at the wrong moment lands badly.",
    "Your reputation is built message by message, interaction by interaction.",
    "Adjust your communication style to your audience — not your values, just your delivery.",
    "When in doubt, over-communicate. Most conflict stems from insufficient communication.",
    "Silence is communication. Presence is communication. What you choose not to say is communication.",
    "Communication under stress reveals character. Build the habits in calm that carry you through storms.",
    "Master the art of the follow-up — most commitments die between conversation and action.",
    "Read widely. Great communicators are great thinkers who have internalized great ideas.",
    "Learn to write well. Clear writing is clear thinking made visible.",
  ];

  function handleCommunication(intent, text) {
    const persona = _persona;
    const moduleMap = {
      comm_listening: COMM_LISTENING, comm_verbal: COMM_VERBAL,
      comm_nonverbal: COMM_NONVERBAL, comm_conflict: COMM_CONFLICT,
      comm_eq: COMM_EQ, comm_assertive: COMM_ASSERTIVE,
      comm_publicspeaking: COMM_PUBLICSPEAKING, comm_persuasion: COMM_PERSUASION,
      comm_difficult: COMM_DIFFICULT, comm_professional: COMM_PROFESSIONAL,
      comm_digital: COMM_DIGITAL, comm_cultural: COMM_CULTURAL,
      comm_styles: COMM_STYLES, comm_rapport: COMM_RAPPORT,
      comm_leadership: COMM_LEADERSHIP, comm_apology: COMM_APOLOGY,
      comm_feedback: COMM_FEEDBACK, comm_listening_barriers: COMM_LISTENING_BARRIERS,
    };
    if (intent === "comm_general") {
      const tip = COMM_GENERAL_TIPS[Math.floor(Math.random() * COMM_GENERAL_TIPS.length)];
      return persona === "coach"
        ? `💬 **Communication Insight:**\n\n${tip}\n\n*Want to go deeper? Try asking about active listening, conflict resolution, emotional intelligence, or any other communication topic.*`
        : persona === "savage" ? `Communication tip: ${tip} Don't argue with it.`
        : `💬 ${tip}`;
    }
    const module = moduleMap[intent];
    if (!module) return null;
    const wantsTip = /tip|quick|advice|how to|improve|better/i.test(text);
    if (wantsTip && module.tips) {
      const tip = module.tips[Math.floor(Math.random() * module.tips.length)];
      const label = intent.replace("comm_", "").replace(/_/g, " ");
      if (persona === "coach") return `🎯 **Communication Coaching — ${label.charAt(0).toUpperCase() + label.slice(1)}:**\n\n${tip}\n\n*Want the full breakdown? Just ask!*`;
      if (persona === "friend") return `ok quick tip!! → ${tip}`;
      if (persona === "formal") return `Guidance: ${tip}`;
      if (persona === "savage") return `Real talk: ${tip}`;
      return `💡 ${tip}`;
    }
    const randomTip = module.tips ? module.tips[Math.floor(Math.random() * module.tips.length)] : "";
    if (persona === "coach") return `🎓 **SONIX Communication Coach — ${intent.replace("comm_", "").replace(/_/g, " ").toUpperCase()}**\n\n${module.overview}\n\n---\n💡 **Quick Tip:** ${randomTip}\n\n*Ask a follow-up or request specific tips!*`;
    if (persona === "savage") return `Here's what you need to know:\n\n${module.overview}\n\nKey tip: ${module.tips ? module.tips[0] : ""}`;
    return module.overview + (randomTip ? `\n\n💡 **Quick tip:** ${randomTip}` : "");
  }

  function getCommunicationTip(topic) {
    const topicMap = {
      listening: COMM_LISTENING, verbal: COMM_VERBAL, nonverbal: COMM_NONVERBAL,
      conflict: COMM_CONFLICT, eq: COMM_EQ, assertive: COMM_ASSERTIVE,
      speaking: COMM_PUBLICSPEAKING, persuasion: COMM_PERSUASION,
      difficult: COMM_DIFFICULT, professional: COMM_PROFESSIONAL,
      digital: COMM_DIGITAL, cultural: COMM_CULTURAL, styles: COMM_STYLES,
      rapport: COMM_RAPPORT, leadership: COMM_LEADERSHIP,
      apology: COMM_APOLOGY, feedback: COMM_FEEDBACK, barriers: COMM_LISTENING_BARRIERS,
    };
    const mod = topicMap[topic?.toLowerCase()];
    if (!mod) return COMM_GENERAL_TIPS[Math.floor(Math.random() * COMM_GENERAL_TIPS.length)];
    return mod.tips[Math.floor(Math.random() * mod.tips.length)];
  }

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
      coach: {
        greeting:     [`Hey ${name}! SONIX Communication Coach active. Whether it's active listening, conflict resolution, public speaking, emotional intelligence, or any other communication challenge — I'm here. What are we working on?`],
        identity:     [`I'm SONIX v${VERSION} in Coach mode — your dedicated communication intelligence coach. I cover 18+ communication topics: active listening, verbal and non-verbal skills, conflict resolution, emotional intelligence, assertiveness, public speaking, persuasion, difficult conversations, professional communication, digital etiquette, cross-cultural communication, rapport-building, leadership communication, apology and repair, and feedback skills.`],
        status:       [`Communication Coach online. 18 topics loaded. Ready to help you communicate with more clarity, confidence, and connection.`],
        help:         [`As your communication coach I can help with: active listening, conflict resolution, emotional intelligence, assertiveness, public speaking, persuasion, difficult conversations, professional emails and meetings, digital communication, cross-cultural communication, rapport-building, leadership communication, giving and receiving feedback, and more. What challenge are you working through?`],
        thanks:       [`Great to hear! Remember — every conversation is a practice opportunity. Keep going.`],
        farewell:     [`Keep practicing. Great communication is built one conversation at a time. Come back anytime.`],
        version:      [`SONIX v${VERSION} | Coach Mode | Communication Intelligence Module: 18 topics | Tips: 180+`],
        creator:      [`Built by VLAD, communication module upgraded by Claude. Here to help you communicate at your best.`],
        weather:      [`I don't have live weather data — but I do know that the best conversations happen when both people feel psychologically safe. Work on that and the rest gets easier.`],
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
      coach: [
        `I want to help with "${snippet}" — can you tell me more? Are you looking for communication tips, a framework, or help with a specific situation?`,
        `"${snippet}" — I'd love to coach you on that. Try asking something like "how do I handle conflict at work?" or "give me tips on active listening" and I'll give you something actionable.`,
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
    const match = text.match(/(?:switch to|use|be|change to)\s+(default|coder|friend|formal|savage|analyst|coach)/i);
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

    // Communication Intelligence Module (v3.0.0)
    if (!response && intent.startsWith("comm_")) {
      response = handleCommunication(intent, text) || "";
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

    /** Get a random communication tip for a topic
     *  Topics: listening, verbal, nonverbal, conflict, eq, assertive,
     *          speaking, persuasion, difficult, professional, digital,
     *          cultural, styles, rapport, leadership, apology, feedback, barriers
     */
    commTip: getCommunicationTip,

    /** Get full communication module overview for a topic
     *  Pass the intent string like "comm_listening", "comm_conflict", etc.
     */
    communication(intent, text = "") {
      return handleCommunication(intent.startsWith("comm_") ? intent : "comm_" + intent, text);
    },

    /** List all available communication topics */
    commTopics() {
      return [
        "listening", "verbal", "nonverbal", "conflict", "eq", "assertive",
        "speaking", "persuasion", "difficult", "professional", "digital",
        "cultural", "styles", "rapport", "leadership", "apology", "feedback", "barriers",
      ];
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
    `%c[SONIX-Model v${VERSION}] Loaded. Persona: ${_persona} | Math: Advanced | Research: Live | Memory: ${MAX_MEMORY} turns | Communication Module: 18 topics`,
    "color:#00ff41;font-weight:bold;background:#000;padding:2px 6px;border-radius:3px"
  );

})(typeof window !== "undefined" ? window : this);
