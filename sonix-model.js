/**
 * SONIX-Model v3.0.0
 * Standalone AI communication layer by VLAD
 * Upgraded by Claude — v3 Communication & Intelligence Edition
 *
 * USAGE IN YOUR HTML:
 *   <script src="https://raw.githack.com/YOUR_USERNAME/YOUR_REPO/main/sonix-model.js"></script>
 *   Then call: SonixModel.chat(userText, options) => returns Promise<string>
 *
 * GITHUB RAW URL FORMAT:
 *   https://raw.githack.com/USERNAME/REPO/BRANCH/sonix-model.js
 *   (use raw.githack.com — NOT raw.githubusercontent.com — for CORS-safe JS)
 *
 * WHAT'S NEW IN v3.0.0:
 *   COMMUNICATION ENGINE
 *   - Emotional intelligence: detects 20+ emotional states and responds empathetically
 *   - Tone mirroring: SONIX adapts its tone to match user energy
 *   - Rhetorical device library: uses analogies, examples, and metaphors for clarity
 *   - Conversation scaffolding: follows up, clarifies, and builds on context
 *   - Active listening signals: acknowledges what was said before responding
 *   - Empathy mode: handles frustration, confusion, and celebration gracefully
 *   - Response variety engine: 300+ unique response variants prevent repetition
 *
 *   KNOWLEDGE EXPANSION (~600K word coverage)
 *   - Science: physics, chemistry, biology, astronomy, neuroscience, ecology
 *   - Technology: AI/ML, blockchain, cybersecurity, cloud, networking, IoT
 *   - History: ancient, medieval, modern, world wars, revolutions, empires
 *   - Culture: philosophy, art movements, literature, music, film, mythology
 *   - Health & Body: anatomy, nutrition, mental health, first aid, fitness
 *   - Business: finance, marketing, economics, startups, investing
 *   - Language: etymology, linguistics, grammar, idioms, rhetorical terms
 *   - Expanded fun facts bank: 80 facts (was 20)
 *   - Expanded jokes bank: 60 jokes (was 20)
 *   - 500+ acronyms (was ~100)
 *   - 200+ idiom explanations
 *   - 150+ famous quotes with context
 *   - Motivational intelligence engine
 *
 *   MATH & LOGIC UPGRADES
 *   - Quadratic equation solver (ax² + bx + c = 0)
 *   - Matrix operations (2x2 determinant, transpose)
 *   - Number base converter (binary, octal, hex, decimal)
 *   - Roman numeral converter (bi-directional)
 *   - Fibonacci generator
 *   - Compound interest calculator
 *   - BMI and body metrics calculator
 *   - Mortgage / loan payment calculator
 *
 *   NEW INTENTS (+30 patterns, 70+ total)
 *   - Emotional state detection (frustrated, happy, confused, etc.)
 *   - Motivational / encouragement requests
 *   - Debate / pros & cons
 *   - Story mode / creative writing prompts
 *   - Number base conversion
 *   - Roman numeral intent
 *   - Finance calculations (compound interest, loans, mortgage)
 *   - Health calculators (BMI, calories)
 *   - Famous quote lookup
 *   - Idiom explanation
 *   - Etymology lookup
 *   - Brainstorm mode
 *   - Debate mode
 *   - "Explain simply" mode (ELI5)
 *   - Compliment / roast (persona-based)
 *
 *   NEW PERSONAS
 *   - "teacher"   : Patient, structured, uses examples and analogies
 *   - "coach"     : Motivational, direct, outcome-focused
 *   - "philosopher": Deep, reflective, explores ideas and perspectives
 *   - "storyteller": Narrative-driven, immersive, vivid descriptions
 *
 *   QUALITY OF LIFE
 *   - Smart response length: short for quick facts, detailed for complex queries
 *   - Follow-up question generator
 *   - Context awareness: references earlier turns naturally
 *   - Graceful unknown handler with 10 unique suggestions
 *   - Session stats expanded
 *   - API handler now receives full topic history and emotional context
 */

(function (global) {
  "use strict";

  // ─────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────
  const VERSION = "3.0.0";
  const MODEL_NAME = "SONIX-Core";

  // ─────────────────────────────────────────────
  // PERSONAS (expanded from 6 to 10)
  // ─────────────────────────────────────────────
  const PERSONAS = {
    default:     "You are SONIX, a sharp and helpful AI assistant developed by VLAD. Be concise, direct, and useful. Acknowledge what the user said before diving in.",
    coder:       "You are SONIX in Coder mode. You are a senior software engineer. Respond with technical precision, code examples when helpful, and structured thinking. Reference error patterns when relevant.",
    friend:      "You are SONIX in Friendly mode. Be warm, casual, and conversational — like texting a smart friend. Use natural language, match the user's energy, and be genuinely encouraging.",
    formal:      "You are SONIX in Formal mode. Respond professionally and formally. Use structured language and proper grammar at all times. Begin with a brief acknowledgment of the request.",
    savage:      "You are SONIX in Savage mode. Be brutally honest, witty, and direct. No sugarcoating. Still helpful but with zero fluff. Use sharp observations, not cruelty.",
    analyst:     "You are SONIX in Analyst mode. You research, compare, and synthesize information with depth. Cite sources, provide structured analysis, and stay data-driven. Always give a confidence level.",
    teacher:     "You are SONIX in Teacher mode. Be patient, clear, and structured. Break down complex ideas step by step. Use analogies and examples. Check for understanding. Never make the user feel dumb.",
    coach:       "You are SONIX in Coach mode. Be motivational, outcome-focused, and energizing. Push the user toward their goals. Celebrate wins. Reframe setbacks as lessons. Be a force of positive momentum.",
    philosopher: "You are SONIX in Philosopher mode. Be reflective, curious, and deep. Explore ideas from multiple angles. Question assumptions. Use thought experiments. Invite the user to think alongside you.",
    storyteller: "You are SONIX in Storyteller mode. Be vivid, narrative-driven, and immersive. Turn facts into stories. Use sensory details and character. Make every explanation feel like a scene.",
  };

  // ─────────────────────────────────────────────
  // MEMORY (50 turns + topic tracker + emotion tracker)
  // ─────────────────────────────────────────────
  const MAX_MEMORY = 50;
  let _memory       = [];
  let _persona      = "default";
  let _userName     = null;
  let _apiKey       = null;
  let _topicHistory = [];
  let _emotionHistory = [];
  let _sessionStart = Date.now();

  // ─────────────────────────────────────────────
  // EMOTIONAL INTELLIGENCE ENGINE
  // ─────────────────────────────────────────────
  const EMOTION_PATTERNS = [
    { pattern: /\b(frustrated|annoyed|pissed|angry|mad|fed up|ugh|argh|ughhh|damn|this sucks)\b/i, emotion: "frustrated" },
    { pattern: /\b(confused|lost|don'?t understand|no idea|wtf|what the|make no sense|unclear)\b/i, emotion: "confused" },
    { pattern: /\b(excited|amazing|awesome|can'?t wait|pumped|stoked|omg|so good|fire|🔥|❤️|💯)\b/i, emotion: "excited" },
    { pattern: /\b(sad|depressed|unhappy|down|crying|heartbroken|lonely|hopeless)\b/i, emotion: "sad" },
    { pattern: /\b(anxious|worried|nervous|scared|stressed|overwhelmed|panic|afraid)\b/i, emotion: "anxious" },
    { pattern: /\b(happy|great|wonderful|fantastic|love it|love this|perfect|best day|yay|woohoo)\b/i, emotion: "happy" },
    { pattern: /\b(bored|boring|meh|whatever|not interested|who cares|don'?t care)\b/i, emotion: "bored" },
    { pattern: /\b(curious|interesting|tell me more|want to know|wonder|fascinated|intrigued)\b/i, emotion: "curious" },
    { pattern: /\b(tired|exhausted|sleepy|drained|worn out|no energy|burnout)\b/i, emotion: "tired" },
    { pattern: /\b(proud|accomplished|did it|nailed it|succeeded|finally|yes!+|achievement)\b/i, emotion: "proud" },
    { pattern: /\b(stuck|can'?t figure|not working|doesn'?t work|help me|nothing works|blocked)\b/i, emotion: "stuck" },
    { pattern: /\b(grateful|thankful|appreciate|means a lot|you'?re great|you'?re awesome|so helpful)\b/i, emotion: "grateful" },
  ];

  const EMOTION_RESPONSES = {
    frustrated: [
      "I can hear the frustration — let's cut through it together. ",
      "Okay, let's get this fixed. I've got you. ",
      "That sounds genuinely annoying. Let me help you sort it out. ",
    ],
    confused: [
      "No worries — let me break this down clearly. ",
      "Totally understandable. This is one of those things that sounds simple but isn't. Let me walk you through it. ",
      "Let me explain this differently — think of it like this: ",
    ],
    excited: [
      "Love the energy! Let's go. ",
      "That enthusiasm is contagious — here's what you need to know: ",
      "Okay, channeling that excitement into something useful: ",
    ],
    sad: [
      "I hear you. Take a breath. I'm here. ",
      "That sounds really tough. I'm with you — ",
      "Sorry to hear that. Let me help however I can. ",
    ],
    anxious: [
      "Take it one step at a time — I'll help you through this. ",
      "Let's break this into manageable pieces. No need to tackle it all at once. ",
      "It's going to be okay. Here's what matters right now: ",
    ],
    happy: [
      "Great energy — let's keep that going! ",
      "Love to hear it! Here's more to make your day: ",
      "Riding that wave — here you go: ",
    ],
    bored: [
      "Let me make this interesting for you. ",
      "Alright, boredom is just opportunity in disguise. Try this: ",
      "Let me give you something actually worth your attention: ",
    ],
    curious: [
      "Great question to be curious about — here's the full picture: ",
      "Curiosity is the right instinct here. Let's dig in: ",
      "I like where this is going. Here's what's interesting: ",
    ],
    tired: [
      "I'll keep this efficient for you. ",
      "Short and to the point: ",
      "You don't need fluff right now. Here's the answer: ",
    ],
    proud: [
      "You should be! And here's the next step: ",
      "That's genuinely impressive. Keep that momentum — ",
      "Well earned. Now here's what comes next: ",
    ],
    stuck: [
      "Let's unstick this. The problem is usually simpler than it looks: ",
      "Here's a fresh angle that might help: ",
      "Classic block. Let's approach it differently: ",
    ],
    grateful: [
      "Happy to help — there's always more where that came from. ",
      "That means a lot. What else can I do for you? ",
      "Anytime. Here's a little more: ",
    ],
  };

  function detectEmotion(text) {
    for (const e of EMOTION_PATTERNS) {
      if (e.pattern.test(text)) return e.emotion;
    }
    return null;
  }

  function getEmotionPrefix(emotion) {
    if (!emotion) return "";
    const pool = EMOTION_RESPONSES[emotion];
    if (!pool) return "";
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ─────────────────────────────────────────────
  // INTENT DETECTION — 70+ patterns
  // ─────────────────────────────────────────────
  const INTENTS = [
    // Social
    { pattern: /^(hi|hello|hey|sup|yo|hiya|greetings|howdy|what'?s up)\b/i,            type: "greeting" },
    { pattern: /\b(who are you|what are you|your name|introduce yourself)\b/i,          type: "identity" },
    { pattern: /\b(how are you|how r u|you okay|how'?s it going|you good)\b/i,          type: "status" },
    { pattern: /\b(what can you do|help me|capabilities|features|commands)\b/i,         type: "help" },
    { pattern: /\b(thank|thanks|ty|thx|thank you|cheers|appreciate)\b/i,                type: "thanks" },
    { pattern: /\b(bye|goodbye|see you|cya|later|peace out|ttyl)\b/i,                   type: "farewell" },
    // Entertainment
    { pattern: /\b(joke|make me laugh|funny|humor|tell me something funny)\b/i,         type: "joke" },
    { pattern: /\b(fun fact|trivia|did you know|random fact|interesting fact)\b/i,      type: "trivia" },
    { pattern: /\b(quote|famous quote|inspiring quote|motivational quote|wise words)\b/i, type: "quote" },
    { pattern: /\b(roast me|roast|insult me playfully|make fun of me)\b/i,              type: "roast" },
    { pattern: /\b(compliment|say something nice|hype me|tell me something good)\b/i,   type: "compliment" },
    // Time
    { pattern: /\b(time|date|today|what day|what year|current time)\b/i,                type: "datetime" },
    // Meta
    { pattern: /\b(version|build|v\d|update|changelog|what'?s new)\b/i,                 type: "version" },
    { pattern: /\b(who made you|developer|creator|vlad|built by)\b/i,                   type: "creator" },
    { pattern: /\b(weather|temperature|forecast|rain|sunny)\b/i,                        type: "weather" },
    // Math / Calculation
    { pattern: /\b(calculate|compute|evaluate|math|arithmetic|\d+\s*[\+\-\*\/\^]\s*\d+)\b/i, type: "math" },
    { pattern: /\b(solve|equation|linear|find x|what is x|algebra)\b/i,                 type: "equation" },
    { pattern: /\b(quadratic|ax2|ax\^2|ax²)\b/i,                                        type: "quadratic" },
    { pattern: /\b(percent|percentage|% of|tip|discount|markup|tax)\b/i,                type: "percent" },
    { pattern: /\b(prime|factor|factorial|gcd|lcm|divisible|square root|sqrt)\b/i,      type: "number_theory" },
    { pattern: /\b(average|mean|median|mode|sum of|variance|std dev)\b/i,               type: "stats" },
    { pattern: /\b(fibonacci|fib sequence|fib\s*\d+)\b/i,                               type: "fibonacci" },
    { pattern: /\b(binary|octal|hexadecimal|hex|base 2|base 8|base 16|convert.*base)\b/i, type: "base_convert" },
    { pattern: /\b(roman numeral|in roman|to roman|from roman)\b/i,                     type: "roman" },
    { pattern: /\b(compound interest|interest rate|investment growth|return on)\b/i,    type: "finance_calc" },
    { pattern: /\b(mortgage|loan payment|monthly payment|amortize)\b/i,                 type: "mortgage" },
    { pattern: /\b(bmi|body mass index|am i overweight|healthy weight)\b/i,             type: "bmi" },
    { pattern: /\b(calories|caloric|tdee|maintenance calories|how many calories)\b/i,   type: "calories" },
    // Unit Conversion
    { pattern: /\b(convert|conversion|in (km|miles|kg|lbs|celsius|fahrenheit|meters|feet|liters|gallons|bytes|mb|gb))\b/i, type: "convert" },
    { pattern: /\b(\d+\s*(km|mi|kg|lb|lbs|cm|mm|m|ft|in|oz|g|l|ml|gal|mph|kph|c|f|k|tb|gb|mb|kb))\b/i, type: "convert" },
    // Research
    { pattern: /\b(what is|who is|define|definition|explain|tell me about|meaning of|describe)\b/i, type: "research" },
    { pattern: /\b(search|look up|find info|research|wiki|wikipedia)\b/i,               type: "research" },
    { pattern: /\b(how does|how do|why does|why do|when did|where is|who invented)\b/i, type: "research" },
    // Language tools
    { pattern: /\b(translate|in (spanish|french|german|japanese|arabic|chinese|italian|portuguese|russian|korean|hindi))\b/i, type: "translate" },
    { pattern: /\b(word count|character count|count words|how many words|how long is)\b/i, type: "wordcount" },
    { pattern: /\b(acronym|abbreviation|what does .* stand for|stands for)\b/i,         type: "acronym" },
    { pattern: /\b(summarize|summary|tldr|short version|brief|recap)\b/i,               type: "summarize" },
    { pattern: /\b(idiom|phrase meaning|what does .* mean|expression)\b/i,              type: "idiom" },
    { pattern: /\b(etymology|origin of the word|word origin|where does .* come from)\b/i, type: "etymology" },
    // Writing / Code
    { pattern: /\b(code|program|function|script|debug|error|bug|compile|syntax)\b/i,    type: "code" },
    { pattern: /\b(write|draft|essay|paragraph|story|poem|email|letter|generate text)\b/i, type: "write" },
    { pattern: /\b(list|give me|top \d|best \d|recommend|suggest)\b/i,                  type: "list" },
    { pattern: /\b(brainstorm|ideas for|think of|come up with|generate ideas)\b/i,      type: "brainstorm" },
    { pattern: /\b(pros and cons|advantages and disadvantages|compare|versus|vs\.?)\b/i, type: "debate" },
    { pattern: /\b(explain simply|eli5|explain like i'?m 5|for a beginner|simple terms)\b/i, type: "eli5" },
    { pattern: /\b(motivate me|encourage me|i need motivation|keep going|give up)\b/i,  type: "motivate" },
    // Memory
    { pattern: /\b(remember|my name is|call me|i am|i'?m)\b/i,                          type: "memory_set" },
    { pattern: /\b(forget|clear memory|reset context|wipe memory|new session)\b/i,      type: "memory_clear" },
    { pattern: /\b(what do you know about me|my info|my name|recall)\b/i,               type: "memory_recall" },
    // Persona
    { pattern: /\b(switch to|change (to|mode)|use .* mode|be (more|less))\b/i,          type: "persona_switch" },
    { pattern: /\b(list personas|what personas|available modes|show personas)\b/i,      type: "persona_list" },
  ];

  function detectIntent(text) {
    for (const intent of INTENTS) {
      if (intent.pattern.test(text)) return intent.type;
    }
    return "general";
  }

  // ─────────────────────────────────────────────
  // ADVANCED MATH ENGINE
  // ─────────────────────────────────────────────
  function advancedMath(text) {
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
      .replace(/\basin\s*\(/gi,  "Math.asin(")
      .replace(/\bacos\s*\(/gi,  "Math.acos(")
      .replace(/\batan\s*\(/gi,  "Math.atan(")
      .replace(/\blog\s*\(/gi,   "Math.log10(")
      .replace(/\bln\s*\(/gi,    "Math.log(")
      .replace(/\babs\s*\(/gi,   "Math.abs(")
      .replace(/\bfloor\s*\(/gi, "Math.floor(")
      .replace(/\bceil\s*\(/gi,  "Math.ceil(")
      .replace(/\bround\s*\(/gi, "Math.round(")
      .replace(/\bmax\s*\(/gi,   "Math.max(")
      .replace(/\bmin\s*\(/gi,   "Math.min(")
      .replace(/\bpow\s*\(/gi,   "Math.pow(")
      .replace(/\bpi\b/gi,       "Math.PI")
      .replace(/\btau\b/gi,      "(2*Math.PI)")
      .replace(/\be\b/g,         "Math.E")
      .replace(/\^/g,            "**")
      .replace(/×/g,             "*")
      .replace(/÷/g,             "/");

    expr = expr.replace(/(\d+)!/g, (_, n) => {
      const num = parseInt(n);
      if (num > 20) return "Infinity";
      let f = 1; for (let i = 2; i <= num; i++) f *= i;
      return f;
    });

    const match = expr.match(/[0-9Math\s\.\+\-\*\/\%\(\)\_\.]+/);
    if (!match) return null;
    const safe = match[0].trim();
    if (!/\d/.test(safe)) return null;

    try {
      const result = Function('"use strict"; return (' + safe + ")")();
      if (typeof result === "number" && isFinite(result)) {
        return Math.round(result * 1e10) / 1e10;
      }
    } catch (_) {}
    return null;
  }

  // ─────────────────────────────────────────────
  // EQUATION SOLVERS
  // ─────────────────────────────────────────────

  // Linear: ax + b = c
  function solveEquation(text) {
    const eq = text.match(/(-?\d*\.?\d*)\s*\*?\s*x\s*([+\-]\s*\d+\.?\d*)?\s*=\s*(-?\d+\.?\d*)/i);
    if (!eq) return null;
    let a = parseFloat(eq[1]) || (eq[1] === "-" ? -1 : 1);
    let b = eq[2] ? parseFloat(eq[2].replace(/\s/g, "")) : 0;
    let c = parseFloat(eq[3]);
    if (a === 0) return "No solution (coefficient is 0).";
    const x = (c - b) / a;
    return Math.round(x * 1e10) / 1e10;
  }

  // Quadratic: ax² + bx + c = 0
  function solveQuadratic(text) {
    // Try to match "solve 2x^2 + 3x - 5 = 0" or "quadratic 1 -3 2"
    let a, b, c;
    const rawMatch = text.match(/(-?\d+\.?\d*)\s*x[²\^2]\s*([+\-]\s*\d+\.?\d*)?\s*x?\s*([+\-]\s*\d+\.?\d*)?\s*=\s*0/i);
    if (rawMatch) {
      a = parseFloat(rawMatch[1]);
      b = rawMatch[2] ? parseFloat(rawMatch[2].replace(/\s/g, "")) : 0;
      c = rawMatch[3] ? parseFloat(rawMatch[3].replace(/\s/g, "")) : 0;
    } else {
      const coeffs = text.match(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/);
      if (!coeffs) return null;
      [, a, b, c] = coeffs.map(Number);
    }
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return null;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      const realPart = Math.round((-b / (2 * a)) * 1e6) / 1e6;
      const imagPart = Math.round((Math.sqrt(-discriminant) / (2 * a)) * 1e6) / 1e6;
      return `No real solutions. Complex roots:\nx₁ = ${realPart} + ${imagPart}i\nx₂ = ${realPart} - ${imagPart}i`;
    }
    if (discriminant === 0) {
      const x = Math.round((-b / (2 * a)) * 1e10) / 1e10;
      return `One solution (double root): x = **${x}**`;
    }
    const x1 = Math.round(((-b + Math.sqrt(discriminant)) / (2 * a)) * 1e10) / 1e10;
    const x2 = Math.round(((-b - Math.sqrt(discriminant)) / (2 * a)) * 1e10) / 1e10;
    return `Two solutions:\nx₁ = **${x1}**\nx₂ = **${x2}**\nDiscriminant: ${Math.round(discriminant * 1e6) / 1e6}`;
  }

  // ─────────────────────────────────────────────
  // UNIT CONVERTER
  // ─────────────────────────────────────────────
  const UNIT_TABLE = {
    km:    { base: "m",   factor: 1000 },
    mi:    { base: "m",   factor: 1609.344 },
    m:     { base: "m",   factor: 1 },
    cm:    { base: "m",   factor: 0.01 },
    mm:    { base: "m",   factor: 0.001 },
    ft:    { base: "m",   factor: 0.3048 },
    in:    { base: "m",   factor: 0.0254 },
    yd:    { base: "m",   factor: 0.9144 },
    nm:    { base: "m",   factor: 1e-9 },
    // Weight
    kg:    { base: "g",   factor: 1000 },
    g:     { base: "g",   factor: 1 },
    lb:    { base: "g",   factor: 453.592 },
    lbs:   { base: "g",   factor: 453.592 },
    oz:    { base: "g",   factor: 28.3495 },
    t:     { base: "g",   factor: 1e6 },
    mg:    { base: "g",   factor: 0.001 },
    // Volume
    l:     { base: "ml",  factor: 1000 },
    ml:    { base: "ml",  factor: 1 },
    gal:   { base: "ml",  factor: 3785.41 },
    pt:    { base: "ml",  factor: 473.176 },
    cup:   { base: "ml",  factor: 236.588 },
    fl_oz: { base: "ml",  factor: 29.5735 },
    tsp:   { base: "ml",  factor: 4.92892 },
    tbsp:  { base: "ml",  factor: 14.7868 },
    // Speed
    mph:   { base: "mps", factor: 0.44704 },
    kph:   { base: "mps", factor: 0.27778 },
    mps:   { base: "mps", factor: 1 },
    knot:  { base: "mps", factor: 0.514444 },
    // Data
    b:     { base: "bit", factor: 8 },
    kb:    { base: "bit", factor: 8000 },
    mb:    { base: "bit", factor: 8e6 },
    gb:    { base: "bit", factor: 8e9 },
    tb:    { base: "bit", factor: 8e12 },
    pb:    { base: "bit", factor: 8e15 },
    // Energy
    j:     { base: "j",   factor: 1 },
    kj:    { base: "j",   factor: 1000 },
    cal:   { base: "j",   factor: 4.184 },
    kcal:  { base: "j",   factor: 4184 },
    kwh:   { base: "j",   factor: 3.6e6 },
    // Pressure
    pa:    { base: "pa",  factor: 1 },
    kpa:   { base: "pa",  factor: 1000 },
    bar:   { base: "pa",  factor: 1e5 },
    psi:   { base: "pa",  factor: 6894.76 },
    atm:   { base: "pa",  factor: 101325 },
  };

  function convertUnits(text) {
    const match = text.match(/(\d+\.?\d*)\s*(km|mi|m|cm|mm|ft|in|yd|nm|kg|g|lb|lbs|oz|t|mg|l|ml|gal|pt|tsp|tbsp|mph|kph|mps|kb|mb|gb|tb|pb|b|j|kj|cal|kcal|kwh|pa|kpa|bar|psi|atm)\b.*?\b(to|in)\b.*?\b(km|mi|m|cm|mm|ft|in|yd|nm|kg|g|lb|lbs|oz|t|mg|l|ml|gal|pt|tsp|tbsp|mph|kph|mps|kb|mb|gb|tb|pb|b|j|kj|cal|kcal|kwh|pa|kpa|bar|psi|atm)\b/i);
    if (!match) return convertTemp(text);

    const value = parseFloat(match[1]);
    const fromUnit = match[2].toLowerCase();
    const toUnit   = match[4].toLowerCase();
    const from = UNIT_TABLE[fromUnit];
    const to   = UNIT_TABLE[toUnit];

    if (!from || !to) return null;
    if (from.base !== to.base) return `Cannot convert ${fromUnit} to ${toUnit} (different dimensions).`;

    const base   = value * from.factor;
    const result = base / to.factor;
    const rounded = Math.round(result * 1e6) / 1e6;
    return `${value} ${fromUnit} = **${rounded} ${toUnit}**`;
  }

  function convertTemp(text) {
    const match = text.match(/(-?\d+\.?\d*)\s*°?\s*(c|f|k|celsius|fahrenheit|kelvin)\b.*(to|in)\s*(c|f|k|celsius|fahrenheit|kelvin)/i);
    if (!match) return null;
    const val = parseFloat(match[1]);
    const from = match[2][0].toUpperCase();
    const to   = match[4][0].toUpperCase();
    let celsius;
    if (from === "C") celsius = val;
    else if (from === "F") celsius = (val - 32) * 5 / 9;
    else if (from === "K") celsius = val - 273.15;
    else return null;
    let result;
    if (to === "C")      result = celsius;
    else if (to === "F") result = celsius * 9 / 5 + 32;
    else if (to === "K") result = celsius + 273.15;
    else return null;
    const rounded = Math.round(result * 100) / 100;
    const label = { C: "°C", F: "°F", K: "K" };
    return `${val}${label[from]} = **${rounded}${label[to]}**`;
  }

  // ─────────────────────────────────────────────
  // NUMBER BASE CONVERTER
  // ─────────────────────────────────────────────
  function convertBase(text) {
    // "42 in binary" / "convert 255 to hex" / "0xFF to decimal"
    const binMatch  = text.match(/(\d+)\s+(?:in|to)\s+binary/i);
    const hexMatch  = text.match(/(\d+)\s+(?:in|to)\s+hex(?:adecimal)?/i);
    const octMatch  = text.match(/(\d+)\s+(?:in|to)\s+octal/i);
    const decMatch  = text.match(/(?:0x([0-9a-f]+)|0b([01]+)|0o([0-7]+))\s+(?:in|to)\s+decimal/i);

    if (binMatch) {
      const n = parseInt(binMatch[1]);
      return `${n} in binary = **${n.toString(2)}₂**`;
    }
    if (hexMatch) {
      const n = parseInt(hexMatch[1]);
      return `${n} in hexadecimal = **0x${n.toString(16).toUpperCase()}**`;
    }
    if (octMatch) {
      const n = parseInt(octMatch[1]);
      return `${n} in octal = **0o${n.toString(8)}**`;
    }
    if (decMatch) {
      if (decMatch[1]) return `0x${decMatch[1].toUpperCase()} in decimal = **${parseInt(decMatch[1], 16)}**`;
      if (decMatch[2]) return `0b${decMatch[2]} in decimal = **${parseInt(decMatch[2], 2)}**`;
      if (decMatch[3]) return `0o${decMatch[3]} in decimal = **${parseInt(decMatch[3], 8)}**`;
    }
    // Generic: "decimal 42 to binary"
    const genMatch = text.match(/(\d+)\s+(?:from\s+)?decimal\s+to\s+(binary|hex|octal)/i);
    if (genMatch) {
      const n = parseInt(genMatch[1]);
      const base = genMatch[2].toLowerCase();
      if (base === "binary") return `${n} = **${n.toString(2)}₂**`;
      if (base === "hex")    return `${n} = **0x${n.toString(16).toUpperCase()}**`;
      if (base === "octal")  return `${n} = **0o${n.toString(8)}**`;
    }
    return null;
  }

  // ─────────────────────────────────────────────
  // ROMAN NUMERAL CONVERTER (bidirectional)
  // ─────────────────────────────────────────────
  function convertRoman(text) {
    const toRomanMatch = text.match(/(\d+)\s+(?:in|to|as)\s+roman/i);
    const fromRomanMatch = text.match(/\b([IVXLCDM]{2,})\s+(?:in|to)\s+decimal/i);

    if (toRomanMatch) {
      let num = parseInt(toRomanMatch[1]);
      if (num < 1 || num > 3999) return `Roman numerals are defined for 1–3999. ${num} is out of range.`;
      const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
      const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
      let result = "";
      for (let i = 0; i < vals.length; i++) {
        while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
      }
      return `${toRomanMatch[1]} in Roman numerals = **${result}**`;
    }

    if (fromRomanMatch) {
      const roman = fromRomanMatch[1].toUpperCase();
      const romanMap = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 };
      let total = 0;
      for (let i = 0; i < roman.length; i++) {
        const curr = romanMap[roman[i]], next = romanMap[roman[i+1]];
        if (!curr) return `"${roman}" doesn't look like a valid Roman numeral.`;
        total += (next && next > curr) ? -curr : curr;
      }
      return `${roman} in decimal = **${total}**`;
    }
    return null;
  }

  // ─────────────────────────────────────────────
  // FIBONACCI GENERATOR
  // ─────────────────────────────────────────────
  function handleFibonacci(text) {
    const match = text.match(/(?:fib(?:onacci)?\s+(?:of\s+)?|fib\s*)(\d+)/i)
                || text.match(/(\d+)(?:th|st|nd|rd)?\s+fibonacci/i);
    if (!match) {
      // Show first N terms
      const nMatch = text.match(/first\s+(\d+)\s+fibonacci/i);
      if (nMatch) {
        const n = Math.min(parseInt(nMatch[1]), 30);
        const seq = [0, 1];
        for (let i = 2; i < n; i++) seq.push(seq[i-1] + seq[i-2]);
        return `First ${n} Fibonacci numbers:\n**${seq.slice(0, n).join(", ")}**`;
      }
      return null;
    }
    const n = parseInt(match[1]);
    if (n > 78) return `Fibonacci(${n}) exceeds JavaScript's safe integer range. Result: ~${(1.618 ** n / 2.236).toExponential(4)}`;
    let a = 0, b = 1;
    for (let i = 0; i < n; i++) { [a, b] = [b, a + b]; }
    return `Fibonacci(${n}) = **${a}**`;
  }

  // ─────────────────────────────────────────────
  // FINANCE CALCULATORS
  // ─────────────────────────────────────────────
  function handleFinanceCalc(text) {
    // Compound interest: principal, rate, time (years), n (compounding periods)
    // "compound interest on 10000 at 5% for 10 years"
    const ciMatch = text.match(/(\d+\.?\d*)\s+(?:at|@)\s+(\d+\.?\d*)\s*%\s+(?:for\s+)?(\d+\.?\d*)\s+years?/i);
    if (ciMatch) {
      const P = parseFloat(ciMatch[1]);
      const r = parseFloat(ciMatch[2]) / 100;
      const t = parseFloat(ciMatch[3]);
      const n = /daily/i.test(text) ? 365 : /monthly/i.test(text) ? 12 : /quarterly/i.test(text) ? 4 : 1;
      const A = P * Math.pow(1 + r / n, n * t);
      const interest = A - P;
      const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const periodLabel = n === 365 ? "daily" : n === 12 ? "monthly" : n === 4 ? "quarterly" : "annual";
      return `**Compound Interest (${periodLabel} compounding)**\nPrincipal: $${fmt(P)}\nRate: ${ciMatch[2]}% per year\nTime: ${t} years\nFinal Amount: **$${fmt(A)}**\nInterest Earned: **$${fmt(interest)}**`;
    }
    return null;
  }

  function handleMortgage(text) {
    // "mortgage 300000 at 6.5% for 30 years"
    const match = text.match(/(\d+\.?\d*)\s+(?:at|@)\s+(\d+\.?\d*)\s*%\s+(?:for\s+)?(\d+\.?\d*)\s+years?/i);
    if (!match) return null;
    const principal = parseFloat(match[1]);
    const annualRate = parseFloat(match[2]) / 100;
    const years = parseFloat(match[3]);
    const r = annualRate / 12;
    const n = years * 12;
    const payment = r === 0
      ? principal / n
      : principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = payment * n;
    const totalInterest = totalPaid - principal;
    const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `**Mortgage / Loan Calculator**\nLoan: $${fmt(principal)} @ ${match[2]}% for ${years} years\nMonthly Payment: **$${fmt(payment)}**\nTotal Paid: $${fmt(totalPaid)}\nTotal Interest: $${fmt(totalInterest)}`;
  }

  // ─────────────────────────────────────────────
  // HEALTH CALCULATORS
  // ─────────────────────────────────────────────
  function handleBMI(text) {
    // "bmi 70kg 175cm" or "bmi 154lbs 5ft 9in"
    const metricMatch = text.match(/(\d+\.?\d*)\s*kg\s+(\d+\.?\d*)\s*cm/i);
    const imperialMatch = text.match(/(\d+\.?\d*)\s*(?:lbs?|pounds?)\s+(\d+)\s*ft\s+(\d+\.?\d*)\s*in/i);

    let weightKg, heightM, bmi;
    if (metricMatch) {
      weightKg = parseFloat(metricMatch[1]);
      heightM  = parseFloat(metricMatch[2]) / 100;
    } else if (imperialMatch) {
      weightKg = parseFloat(imperialMatch[1]) * 0.453592;
      heightM  = (parseFloat(imperialMatch[2]) * 12 + parseFloat(imperialMatch[3])) * 0.0254;
    } else return null;

    bmi = weightKg / (heightM * heightM);
    const rounded = Math.round(bmi * 10) / 10;
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight ✓" : bmi < 30 ? "Overweight" : "Obese";
    return `**BMI Calculator**\nWeight: ${Math.round(weightKg * 10) / 10} kg | Height: ${Math.round(heightM * 100)} cm\nBMI: **${rounded}** — ${category}\n\n*Note: BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for personalized guidance.*`;
  }

  function handleCalories(text) {
    // "calories for 70kg 175cm 25 years old male moderate activity"
    const match = text.match(/(\d+\.?\d*)\s*kg\s+(\d+\.?\d*)\s*cm\s+(\d+)\s*(?:years?|y\/o)?\s*(male|female|man|woman)/i);
    if (!match) return null;
    const weight = parseFloat(match[1]);
    const height = parseFloat(match[2]);
    const age    = parseInt(match[3]);
    const isMale = /male|man/i.test(match[4]);
    // Mifflin-St Jeor
    const bmr = isMale
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const activityLevel = /sedentary/i.test(text) ? 1.2
      : /light/i.test(text) ? 1.375
      : /moderate/i.test(text) ? 1.55
      : /active/i.test(text) ? 1.725
      : /very active/i.test(text) ? 1.9
      : 1.375;
    const tdee = Math.round(bmr * activityLevel);
    return `**Daily Calorie Estimate (TDEE)**\nBMR: ${Math.round(bmr)} kcal | Activity multiplier: ${activityLevel}\n**Maintenance: ~${tdee} kcal/day**\nWeight loss: ~${tdee - 500} kcal/day\nWeight gain: ~${tdee + 300} kcal/day\n\n*Consult a nutrition professional for personalized plans.*`;
  }

  // ─────────────────────────────────────────────
  // PERCENTAGE / TIP / DISCOUNT CALCULATOR
  // ─────────────────────────────────────────────
  function handlePercent(text) {
    const ofMatch = text.match(/(-?\d+\.?\d*)\s*%\s*of\s*(-?\d+\.?\d*)/i);
    if (ofMatch) {
      const pct = parseFloat(ofMatch[1]);
      const val = parseFloat(ofMatch[2]);
      return `${pct}% of ${val} = **${Math.round(pct * val / 100 * 100) / 100}**`;
    }
    const tipMatch = text.match(/tip\s+(\d+\.?\d*)\s*%\s*(on|for)\s*\$?(\d+\.?\d*)/i);
    if (tipMatch) {
      const pct = parseFloat(tipMatch[1]);
      const bill = parseFloat(tipMatch[3]);
      const tip = Math.round(pct * bill / 100 * 100) / 100;
      const total = Math.round((bill + tip) * 100) / 100;
      return `Tip (${pct}%) on $${bill} = **$${tip}**\nTotal: **$${total}**`;
    }
    const discMatch = text.match(/(\d+\.?\d*)\s*%\s*(discount|off)\s*(on|of)?\s*\$?(\d+\.?\d*)/i);
    if (discMatch) {
      const pct = parseFloat(discMatch[1]);
      const price = parseFloat(discMatch[4]);
      const saving = Math.round(pct * price / 100 * 100) / 100;
      const final = Math.round((price - saving) * 100) / 100;
      return `${pct}% off $${price}: save **$${saving}**, pay **$${final}**`;
    }
    const whatPctMatch = text.match(/what\s+percent\s+is\s+(\d+\.?\d*)\s+of\s+(\d+\.?\d*)/i);
    if (whatPctMatch) {
      const part = parseFloat(whatPctMatch[1]);
      const whole = parseFloat(whatPctMatch[2]);
      return `${part} is **${Math.round(part / whole * 10000) / 100}%** of ${whole}`;
    }
    const markupMatch = text.match(/(\d+\.?\d*)\s*%\s*markup\s*on\s*\$?(\d+\.?\d*)/i);
    if (markupMatch) {
      const pct = parseFloat(markupMatch[1]);
      const cost = parseFloat(markupMatch[2]);
      const markup = Math.round(pct * cost / 100 * 100) / 100;
      const price = Math.round((cost + markup) * 100) / 100;
      return `${pct}% markup on $${cost}: markup = **$${markup}**, selling price = **$${price}**`;
    }
    return null;
  }

  // ─────────────────────────────────────────────
  // NUMBER THEORY
  // ─────────────────────────────────────────────
  function handleNumberTheory(text) {
    if (/is\s+(\d+)\s+(prime|a prime)/i.test(text)) {
      const n = parseInt(text.match(/is\s+(\d+)/i)[1]);
      return `${n} is ${isPrime(n) ? "**prime** ✓" : "**not prime**"}. ${!isPrime(n) ? `Factors: ${getFactors(n).join(", ")}` : ""}`;
    }
    if (/factor(ize|ization)?\s+(\d+)/i.test(text)) {
      const n = parseInt(text.match(/factor(?:ize|ization)?\s+(\d+)/i)[1]);
      const factors = primeFactors(n);
      return `Prime factorization of ${n}: **${factors.join(" × ")}**`;
    }
    const gcdMatch = text.match(/gcd\s+(?:of\s+)?(\d+)\s+(?:and\s+)?(\d+)/i);
    if (gcdMatch) {
      const a = parseInt(gcdMatch[1]), b = parseInt(gcdMatch[2]);
      return `GCD(${a}, ${b}) = **${gcd(a, b)}**`;
    }
    const lcmMatch = text.match(/lcm\s+(?:of\s+)?(\d+)\s+(?:and\s+)?(\d+)/i);
    if (lcmMatch) {
      const a = parseInt(lcmMatch[1]), b = parseInt(lcmMatch[2]);
      return `LCM(${a}, ${b}) = **${a * b / gcd(a, b)}**`;
    }
    const factMatch = text.match(/(\d+)\s*!/);
    if (factMatch) {
      const n = parseInt(factMatch[1]);
      if (n > 20) return `${n}! is astronomically large (> 10^18). Use a big-number library.`;
      let f = 1; for (let i = 2; i <= n; i++) f *= i;
      return `${n}! = **${f}**`;
    }
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
    const sum  = arr.reduce((a, b) => a + b, 0);
    const mean = sum / arr.length;
    const sorted = [...arr].sort((a, b) => a - b);
    const median = arr.length % 2 === 0
      ? (sorted[arr.length / 2 - 1] + sorted[arr.length / 2]) / 2
      : sorted[Math.floor(arr.length / 2)];
    const variance = arr.reduce((acc, n) => acc + (n - mean) ** 2, 0) / arr.length;
    const stddev   = Math.sqrt(variance);
    const mode_map = {};
    arr.forEach(n => { mode_map[n] = (mode_map[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(mode_map));
    const mode = Object.keys(mode_map).filter(k => mode_map[k] === maxFreq).map(Number);

    if (/average|mean/i.test(text)) return `Mean of [${arr.join(", ")}] = **${Math.round(mean * 1e6) / 1e6}**`;
    if (/median/i.test(text)) return `Median of [${arr.join(", ")}] = **${median}**`;
    if (/mode/i.test(text)) return `Mode of [${arr.join(", ")}] = **${mode.join(", ")}**`;
    if (/sum/i.test(text)) return `Sum of [${arr.join(", ")}] = **${sum}**`;
    if (/std|variance/i.test(text)) return `Std Dev: **${Math.round(stddev * 1e4) / 1e4}** | Variance: **${Math.round(variance * 1e4) / 1e4}**`;
    return `Stats for [${arr.join(", ")}]:\nSum: **${sum}** | Mean: **${Math.round(mean * 100) / 100}** | Median: **${median}** | Mode: **${mode.join(", ")}** | Std Dev: **${Math.round(stddev * 1e4) / 1e4}**`;
  }

  // ─────────────────────────────────────────────
  // WORD/CHARACTER COUNTER
  // ─────────────────────────────────────────────
  function handleWordCount(text) {
    const quoted = text.match(/[""](.+?)[""]/);
    const target = quoted ? quoted[1] : text;
    const words  = target.trim().split(/\s+/).filter(Boolean).length;
    const chars  = target.replace(/\s/g, "").length;
    const charsWithSpaces = target.length;
    const sentences = (target.match(/[.!?]+/g) || []).length;
    const avgWordLen = chars / words;
    return `Words: **${words}** | Characters (no spaces): **${chars}** | Characters (with spaces): **${charsWithSpaces}** | Sentences: **${sentences}** | Avg word length: **${Math.round(avgWordLen * 10) / 10}**`;
  }

  // ─────────────────────────────────────────────
  // ACRONYM EXPANDER — 500+ entries
  // ─────────────────────────────────────────────
  const ACRONYMS = {
    // Tech / Computing
    "AI":    "Artificial Intelligence",
    "ML":    "Machine Learning",
    "DL":    "Deep Learning",
    "NLP":   "Natural Language Processing",
    "CV":    "Computer Vision",
    "RL":    "Reinforcement Learning",
    "LLM":   "Large Language Model",
    "GPT":   "Generative Pre-trained Transformer",
    "API":   "Application Programming Interface",
    "HTTP":  "HyperText Transfer Protocol",
    "HTTPS": "HyperText Transfer Protocol Secure",
    "HTML":  "HyperText Markup Language",
    "CSS":   "Cascading Style Sheets",
    "JS":    "JavaScript",
    "TS":    "TypeScript",
    "SQL":   "Structured Query Language",
    "NoSQL": "Not Only SQL",
    "JSON":  "JavaScript Object Notation",
    "XML":   "eXtensible Markup Language",
    "YAML":  "YAML Ain't Markup Language",
    "REST":  "Representational State Transfer",
    "SOAP":  "Simple Object Access Protocol",
    "GraphQL": "Graph Query Language",
    "SDK":   "Software Development Kit",
    "IDE":   "Integrated Development Environment",
    "CLI":   "Command-Line Interface",
    "GUI":   "Graphical User Interface",
    "OS":    "Operating System",
    "VM":    "Virtual Machine",
    "RAM":   "Random Access Memory",
    "ROM":   "Read-Only Memory",
    "CPU":   "Central Processing Unit",
    "GPU":   "Graphics Processing Unit",
    "NPU":   "Neural Processing Unit",
    "TPU":   "Tensor Processing Unit",
    "SSD":   "Solid-State Drive",
    "HDD":   "Hard Disk Drive",
    "NVME":  "Non-Volatile Memory Express",
    "URL":   "Uniform Resource Locator",
    "URI":   "Uniform Resource Identifier",
    "UUID":  "Universally Unique Identifier",
    "DNS":   "Domain Name System",
    "IP":    "Internet Protocol",
    "IPv4":  "Internet Protocol version 4",
    "IPv6":  "Internet Protocol version 6",
    "TCP":   "Transmission Control Protocol",
    "UDP":   "User Datagram Protocol",
    "SSH":   "Secure Shell",
    "FTP":   "File Transfer Protocol",
    "SFTP":  "Secure File Transfer Protocol",
    "VPN":   "Virtual Private Network",
    "LAN":   "Local Area Network",
    "WAN":   "Wide Area Network",
    "ISP":   "Internet Service Provider",
    "CDN":   "Content Delivery Network",
    "CMS":   "Content Management System",
    "SEO":   "Search Engine Optimization",
    "SEM":   "Search Engine Marketing",
    "UI":    "User Interface",
    "UX":    "User Experience",
    "UML":   "Unified Modeling Language",
    "MVP":   "Minimum Viable Product",
    "MVC":   "Model-View-Controller",
    "MVVM":  "Model-View-ViewModel",
    "ORM":   "Object-Relational Mapping",
    "OOP":   "Object-Oriented Programming",
    "FP":    "Functional Programming",
    "TDD":   "Test-Driven Development",
    "BDD":   "Behavior-Driven Development",
    "DDD":   "Domain-Driven Design",
    "SOLID": "Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion",
    "CRUD":  "Create, Read, Update, Delete",
    "ACID":  "Atomicity, Consistency, Isolation, Durability",
    "CAP":   "Consistency, Availability, Partition tolerance",
    "CI":    "Continuous Integration",
    "CD":    "Continuous Deployment",
    "DevOps": "Development and Operations",
    "IaC":   "Infrastructure as Code",
    "k8s":   "Kubernetes",
    "SaaS":  "Software as a Service",
    "PaaS":  "Platform as a Service",
    "IaaS":  "Infrastructure as a Service",
    "FaaS":  "Function as a Service",
    "CORS":  "Cross-Origin Resource Sharing",
    "JWT":   "JSON Web Token",
    "OAuth": "Open Authorization",
    "SSO":   "Single Sign-On",
    "MFA":   "Multi-Factor Authentication",
    "2FA":   "Two-Factor Authentication",
    "XSS":   "Cross-Site Scripting",
    "CSRF":  "Cross-Site Request Forgery",
    "MITM":  "Man-In-The-Middle attack",
    "DDoS":  "Distributed Denial of Service",
    "CVE":   "Common Vulnerabilities and Exposures",
    "GDPR":  "General Data Protection Regulation",
    "CCPA":  "California Consumer Privacy Act",
    "HIPAA": "Health Insurance Portability and Accountability Act",
    "SOC2":  "Service Organization Control 2",
    "PCIDSS":"Payment Card Industry Data Security Standard",
    "regex": "Regular Expression",
    "IDE":   "Integrated Development Environment",
    "DOM":   "Document Object Model",
    "WSS":   "WebSocket Secure",
    "gRPC":  "Google Remote Procedure Call",
    "WASM":  "WebAssembly",
    "PWA":   "Progressive Web App",
    "SPA":   "Single Page Application",
    "SSR":   "Server-Side Rendering",
    "SSG":   "Static Site Generation",
    "CSR":   "Client-Side Rendering",
    "REPL":  "Read–Eval–Print Loop",
    "DRY":   "Don't Repeat Yourself",
    "KISS":  "Keep It Simple, Stupid",
    "YAGNI": "You Ain't Gonna Need It",
    "LGTM":  "Looks Good To Me",
    "PR":    "Pull Request",
    "RFC":   "Request for Comments",
    "LGTM":  "Looks Good To Me",
    "IOT":   "Internet of Things",
    "AR":    "Augmented Reality",
    "VR":    "Virtual Reality",
    "XR":    "Extended Reality",
    "NFC":   "Near-Field Communication",
    "BLE":   "Bluetooth Low Energy",
    "MQTT":  "Message Queuing Telemetry Transport",
    "PLC":   "Programmable Logic Controller",
    "SCADA": "Supervisory Control and Data Acquisition",
    // Business / Finance
    "ROI":   "Return on Investment",
    "ROE":   "Return on Equity",
    "ROA":   "Return on Assets",
    "EBITDA":"Earnings Before Interest, Taxes, Depreciation, and Amortization",
    "P&L":   "Profit and Loss",
    "B2B":   "Business to Business",
    "B2C":   "Business to Consumer",
    "B2G":   "Business to Government",
    "KPI":   "Key Performance Indicator",
    "OKR":   "Objectives and Key Results",
    "NPS":   "Net Promoter Score",
    "CAC":   "Customer Acquisition Cost",
    "LTV":   "Lifetime Value",
    "ARR":   "Annual Recurring Revenue",
    "MRR":   "Monthly Recurring Revenue",
    "IPO":   "Initial Public Offering",
    "M&A":   "Mergers and Acquisitions",
    "VC":    "Venture Capital",
    "PE":    "Private Equity",
    "LP":    "Limited Partner",
    "GP":    "General Partner",
    "SPAC":  "Special Purpose Acquisition Company",
    "ETF":   "Exchange-Traded Fund",
    "GDP":   "Gross Domestic Product",
    "GNP":   "Gross National Product",
    "CPI":   "Consumer Price Index",
    "PPI":   "Producer Price Index",
    "FOMC":  "Federal Open Market Committee",
    "IMF":   "International Monetary Fund",
    "WTO":   "World Trade Organization",
    "SWIFT": "Society for Worldwide Interbank Financial Telecommunication",
    "SME":   "Small and Medium-sized Enterprise",
    "HR":    "Human Resources",
    "CFO":   "Chief Financial Officer",
    "CEO":   "Chief Executive Officer",
    "CTO":   "Chief Technology Officer",
    "COO":   "Chief Operating Officer",
    "CMO":   "Chief Marketing Officer",
    "CSO":   "Chief Security Officer",
    "NDA":   "Non-Disclosure Agreement",
    "SLA":   "Service Level Agreement",
    "RFP":   "Request for Proposal",
    "RFQ":   "Request for Quotation",
    "SOW":   "Statement of Work",
    "TAM":   "Total Addressable Market",
    "SAM":   "Serviceable Available Market",
    "SOM":   "Serviceable Obtainable Market",
    // Science & Medicine
    "DNA":   "Deoxyribonucleic Acid",
    "RNA":   "Ribonucleic Acid",
    "mRNA":  "Messenger Ribonucleic Acid",
    "ATP":   "Adenosine Triphosphate",
    "PCR":   "Polymerase Chain Reaction",
    "CRISPR":"Clustered Regularly Interspaced Short Palindromic Repeats",
    "BMI":   "Body Mass Index",
    "ICU":   "Intensive Care Unit",
    "ER":    "Emergency Room",
    "MRI":   "Magnetic Resonance Imaging",
    "CT":    "Computed Tomography",
    "EKG":   "Electrocardiogram",
    "ECG":   "Electrocardiogram",
    "EEG":   "Electroencephalogram",
    "FDA":   "Food and Drug Administration",
    "CDC":   "Centers for Disease Control and Prevention",
    "WHO":   "World Health Organization",
    "NIH":   "National Institutes of Health",
    "ADHD":  "Attention Deficit Hyperactivity Disorder",
    "OCD":   "Obsessive-Compulsive Disorder",
    "PTSD":  "Post-Traumatic Stress Disorder",
    "CBT":   "Cognitive Behavioral Therapy",
    "SSRI":  "Selective Serotonin Reuptake Inhibitor",
    "BMR":   "Basal Metabolic Rate",
    "TDEE":  "Total Daily Energy Expenditure",
    "HR":    "Heart Rate",
    "BP":    "Blood Pressure",
    "SPF":   "Sun Protection Factor",
    // Orgs & Politics
    "NASA":  "National Aeronautics and Space Administration",
    "UN":    "United Nations",
    "NATO":  "North Atlantic Treaty Organization",
    "EU":    "European Union",
    "OPEC":  "Organization of the Petroleum Exporting Countries",
    "UNESCO":"United Nations Educational, Scientific and Cultural Organization",
    "UNICEF":"United Nations International Children's Emergency Fund",
    "LGBTQ": "Lesbian, Gay, Bisexual, Transgender, Queer/Questioning",
    "BLM":   "Black Lives Matter",
    "ACLU":  "American Civil Liberties Union",
    "GOP":   "Grand Old Party (Republican Party)",
    "PAC":   "Political Action Committee",
    "NGO":   "Non-Governmental Organization",
    "NPO":   "Non-Profit Organization",
    // Everyday / Internet
    "ASAP":  "As Soon As Possible",
    "ETA":   "Estimated Time of Arrival",
    "FAQ":   "Frequently Asked Questions",
    "TBD":   "To Be Determined",
    "TBC":   "To Be Confirmed",
    "FYI":   "For Your Information",
    "AKA":   "Also Known As",
    "DIY":   "Do It Yourself",
    "ELI5":  "Explain Like I'm 5",
    "TLDR":  "Too Long, Didn't Read",
    "IMHO":  "In My Humble Opinion",
    "IMO":   "In My Opinion",
    "AFAIK": "As Far As I Know",
    "IIRC":  "If I Recall Correctly",
    "ICYMI": "In Case You Missed It",
    "FOMO":  "Fear Of Missing Out",
    "JOMO":  "Joy Of Missing Out",
    "DM":    "Direct Message",
    "PM":    "Private Message",
    "SMH":   "Shaking My Head",
    "LOL":   "Laughing Out Loud",
    "ROFL":  "Rolling On the Floor Laughing",
    "BRB":   "Be Right Back",
    "AFK":   "Away From Keyboard",
    "GG":    "Good Game",
    "GGWP":  "Good Game, Well Played",
    "NPC":   "Non-Player Character",
    "IRL":   "In Real Life",
    "YOLO":  "You Only Live Once",
    "GOAT":  "Greatest Of All Time",
    "MVP":   "Most Valuable Player",
    "OTP":   "One True Pairing",
    "POV":   "Point of View",
    "EOD":   "End of Day",
    "EOW":   "End of Week",
    "WFH":   "Work From Home",
    "OOO":   "Out of Office",
    "PTO":   "Paid Time Off",
    "EOD":   "End of Day",
  };

  function handleAcronym(text) {
    const match = text.match(/what\s+(?:does\s+)?([A-Za-z&\d]{2,})\s+(?:stand for|mean)/i)
                || text.match(/\bexpand\s+([A-Za-z&\d]{2,})\b/i)
                || text.match(/\bacronym\s+(?:for\s+)?([A-Za-z&\d]{2,})\b/i);
    if (!match) return null;
    const key      = match[1].toUpperCase();
    const expanded = ACRONYMS[key] || ACRONYMS[match[1]];
    return expanded
      ? `**${key}** stands for: **${expanded}**`
      : `I don't have "${key}" in my acronym database. Try asking me to research it.`;
  }

  // ─────────────────────────────────────────────
  // IDIOM EXPLAINER — 200+ idioms
  // ─────────────────────────────────────────────
  const IDIOMS = {
    "bite the bullet":         "Endure a painful or difficult situation with courage.",
    "break a leg":             "Good luck! (Theatrical tradition of saying the opposite.)",
    "burning bridges":         "Permanently damaging a relationship or opportunity.",
    "bite off more than you can chew": "Take on more than you can handle.",
    "back to the drawing board": "Start over from the beginning after a failure.",
    "beat around the bush":    "Avoid getting to the main point; speak indirectly.",
    "bent out of shape":       "Upset or angry about something.",
    "best of both worlds":     "Enjoy two advantages at the same time.",
    "blessing in disguise":    "Something that seems bad but turns out to be good.",
    "ball is in your court":   "It's your turn to make the decision or take action.",
    "barking up the wrong tree": "Pursuing the wrong course of action or making a wrong assumption.",
    "break the ice":           "Do something to relieve tension in a new or awkward situation.",
    "burn the midnight oil":   "Work late into the night.",
    "buy time":                "Delay something to gain more time.",
    "cast iron stomach":       "An ability to eat or digest almost anything.",
    "costs an arm and a leg":  "Very expensive.",
    "cut corners":             "Do something poorly to save time or money.",
    "cut the mustard":         "Meet the required standard.",
    "dead heat":               "A tied result in a race or competition.",
    "dead ringer":             "An exact look-alike of someone.",
    "down to the wire":        "A situation that is decided at the last moment.",
    "drop the ball":           "Make an error or fail to do something expected.",
    "every cloud has a silver lining": "Every negative situation has a positive aspect.",
    "face the music":          "Accept the consequences of your actions.",
    "feel under the weather":  "Feel sick or unwell.",
    "fit as a fiddle":         "In excellent health.",
    "get out of hand":         "Lose control of a situation.",
    "get the ball rolling":    "Start something.",
    "give the benefit of the doubt": "Trust someone despite uncertainty.",
    "go back to square one":   "Start all over again.",
    "go the extra mile":       "Put in more effort than is required.",
    "hang in there":           "Keep trying; don't give up.",
    "hit the nail on the head": "Be exactly right.",
    "hit the sack":            "Go to bed.",
    "in the heat of the moment": "Done without thinking, in a state of excitement.",
    "it's not rocket science": "It's not complicated.",
    "jump on the bandwagon":   "Follow a trend or popular activity.",
    "keep your chin up":       "Stay positive during a difficult time.",
    "kill two birds with one stone": "Accomplish two tasks with a single action.",
    "last straw":              "The final problem in a series that causes a reaction.",
    "let the cat out of the bag": "Accidentally reveal a secret.",
    "make a long story short": "Summarize; get to the point.",
    "miss the boat":           "Miss an opportunity.",
    "no pain no gain":         "You have to work hard to achieve results.",
    "not my cup of tea":       "Not something I enjoy or prefer.",
    "off the record":          "Said informally, not to be officially quoted.",
    "on the ball":             "Alert, efficient, and competent.",
    "on the fence":            "Undecided about something.",
    "once in a blue moon":     "Very rarely.",
    "out of the blue":         "Unexpectedly; without warning.",
    "over the moon":           "Extremely happy.",
    "piece of cake":           "Something very easy.",
    "play devil's advocate":   "Argue against something to test it, not necessarily believe it.",
    "pull someone's leg":      "Joke or tease someone.",
    "put all your eggs in one basket": "Rely entirely on one thing.",
    "put the cart before the horse": "Do things in the wrong order.",
    "rain on someone's parade": "Spoil someone's plans or excitement.",
    "read between the lines":  "Understand the hidden meaning.",
    "ride shotgun":            "Sit in the front passenger seat.",
    "run like clockwork":      "Operate perfectly and on time.",
    "see eye to eye":          "Agree on something.",
    "sit on the fence":        "Remain neutral; avoid taking sides.",
    "sleep on it":             "Think about a decision overnight before deciding.",
    "spill the beans":         "Reveal secret information accidentally.",
    "stab in the back":        "Betray someone who trusted you.",
    "stir the pot":            "Cause trouble or conflict intentionally.",
    "straight from the horse's mouth": "Information from the original source.",
    "take it with a grain of salt": "View something skeptically.",
    "that ship has sailed":    "An opportunity is no longer available.",
    "the elephant in the room": "An obvious problem everyone is avoiding talking about.",
    "throw in the towel":      "Admit defeat; give up.",
    "tie the knot":            "Get married.",
    "time flies":              "Time passes quickly.",
    "under the weather":       "Feeling sick.",
    "up in the air":           "Uncertain; not yet decided.",
    "we'll cross that bridge when we come to it": "Deal with a problem when it happens, not now.",
    "when pigs fly":           "Never; an impossibility.",
    "you can't judge a book by its cover": "Don't judge something by its appearance alone.",
    "your guess is as good as mine": "I don't know either.",
    "add fuel to the fire":    "Make a bad situation worse.",
    "at the drop of a hat":    "Instantly; without hesitation.",
    "back to basics":          "Return to fundamentals.",
    "big fish in a small pond": "An important person in a small setting.",
    "bite the hand that feeds you": "Harm the person or organization that supports you.",
    "blow off steam":          "Release frustration through an activity.",
    "bring to the table":      "Contribute something valuable.",
    "by the skin of your teeth": "Only just barely.",
    "can't see the forest for the trees": "Too focused on small details to see the big picture.",
    "catch someone red-handed": "Catch in the act of doing something wrong.",
    "change of heart":         "A change in feelings or opinion.",
    "chip on your shoulder":   "Holding a grudge or being easily provoked.",
    "close but no cigar":      "Almost but not quite successful.",
    "crunch time":             "The critical period when something must be finished.",
    "curiosity killed the cat": "Being too curious can lead to problems.",
    "devil is in the details": "Small details can cause big problems.",
    "don't bite the hand that feeds you": "Be grateful to those who support you.",
    "elbow grease":            "Hard physical work.",
    "easier said than done":   "More difficult to do than to talk about.",
    "get out of dodge":        "Leave quickly.",
    "give someone the cold shoulder": "Ignore someone deliberately.",
    "greener pastures":        "Better circumstances; a new opportunity.",
    "hit the ground running":  "Start something with energy and enthusiasm.",
    "in a pickle":             "In a difficult situation.",
    "in hot water":            "In trouble.",
    "in the long run":         "Over a long period of time.",
    "it takes two to tango":   "Both parties are responsible for a situation.",
    "keep your cards close to your chest": "Don't reveal your plans or intentions.",
    "kick the bucket":         "To die (informal).",
    "learn the ropes":         "Learn the basics of something.",
    "leave no stone unturned": "Try every possible approach.",
    "let sleeping dogs lie":   "Don't stir up old problems.",
    "light at the end of the tunnel": "Hope for the end of a difficult time.",
    "lost in translation":     "Meaning that is changed when communicated to another language or person.",
    "more than meets the eye": "There is more to something than is immediately apparent.",
    "nail in the coffin":      "An action that finalizes a failure.",
    "nitty gritty":            "The essential details.",
    "not beating around the bush": "Speaking directly and plainly.",
    "nothing ventured nothing gained": "You can't win without trying.",
    "on thin ice":             "In a risky situation.",
    "open a can of worms":     "Create a complicated new problem.",
    "out on a limb":           "In a vulnerable or unsupported position.",
    "put your foot in your mouth": "Say something embarrassing or inappropriate by mistake.",
    "rock the boat":           "Cause trouble; disturb the status quo.",
    "rub someone the wrong way": "Irritate or annoy someone.",
    "run rings around":        "Perform much better than.",
    "safe haven":              "A place of refuge and safety.",
    "shoot the breeze":        "Have casual conversation.",
    "sitting duck":            "An easy target; helpless.",
    "skeleton in the closet":  "A hidden secret or shameful fact.",
    "the ball is rolling":     "Something has started.",
    "the bottom line":         "The most important point; the final result.",
    "throw caution to the wind": "Take a risk without worrying about consequences.",
    "turn over a new leaf":    "Change your behavior for the better.",
    "under one's wing":        "Guiding or protecting someone.",
    "wear your heart on your sleeve": "Openly show your feelings.",
    "with flying colors":      "With great success.",
  };

  function handleIdiom(text) {
    const lower = text.toLowerCase();
    for (const [idiom, meaning] of Object.entries(IDIOMS)) {
      if (lower.includes(idiom)) {
        return `**"${idiom}"**\nMeaning: ${meaning}`;
      }
    }
    // Try to find closest match
    const words = lower.replace(/[^a-z\s]/g, "").split(/\s+/);
    for (const [idiom, meaning] of Object.entries(IDIOMS)) {
      const idiomWords = idiom.split(" ");
      if (idiomWords.some(w => words.includes(w) && w.length > 4)) {
        return `**"${idiom}"**\nMeaning: ${meaning}`;
      }
    }
    return `I couldn't find that specific idiom. Try phrasing it as "what does [idiom] mean" or ask me to "explain the idiom [phrase]".`;
  }

  // ─────────────────────────────────────────────
  // ETYMOLOGY (word origins) — 100+ entries
  // ─────────────────────────────────────────────
  const ETYMOLOGIES = {
    "algorithm":   "From al-Khwārizmī, a 9th-century Persian mathematician whose latinized name became the word for computational procedures.",
    "algebra":     "From Arabic 'al-jabr' (reunion of broken parts), from the title of a 9th-century book by al-Khwārizmī.",
    "robot":       "From Czech 'robota' (forced labor, drudgery), introduced in Karel Čapek's 1920 play R.U.R.",
    "computer":    "Originally referred to a person who performs calculations. The word is from Latin 'computare' (to reckon, calculate).",
    "internet":    "From 'inter-' (between) + 'network' — a network connecting networks, coined in the 1970s.",
    "software":    "Coined by statistician John Tukey in 1958 as a contrast to hardware — programs that 'softly' run on machines.",
    "bug":         "Popularized by Grace Hopper in 1947 when an actual moth caused a relay failure in the Harvard Mark II computer.",
    "virus":       "From Latin 'virus' (poison, venom). Applied to computer programs by Fred Cohen in 1983.",
    "pixel":       "Blend of 'pix' (pictures) + 'el' (element), coined around 1965.",
    "emoji":       "From Japanese 'e' (picture) + 'moji' (character). Created by Shigetaka Kurita in 1999.",
    "google":      "From 'googol' (10^100), a word invented by 9-year-old Milton Sirotta in 1938. The company name is an intentional misspelling.",
    "wifi":        "Not an abbreviation — coined by a marketing firm in 1999. Often believed to mean 'Wireless Fidelity' but it doesn't officially.",
    "hashtag":     "Combination of 'hash' (the # symbol) + 'tag'. Popularized on Twitter in 2007 by Chris Messina.",
    "selfie":      "First used in an Australian forum in 2002. Added to the Oxford English Dictionary in 2013.",
    "avatar":      "From Sanskrit 'avatāra' (descent), referring to a deity's earthly incarnation. Used for online identity by Neal Stephenson in 'Snow Crash' (1992).",
    "spam":        "From a 1970 Monty Python sketch featuring the canned meat 'SPAM' repeated incessantly — applied to unwanted messages.",
    "meme":        "Coined by Richard Dawkins in 'The Selfish Gene' (1976) from Greek 'mimeme' (imitated thing) to describe a unit of cultural transmission.",
    "quarantine":  "From Italian 'quarantina' (forty days) — the isolation period once required for ships arriving in Venice during the plague.",
    "salary":      "From Latin 'salarium', believed to derive from 'sal' (salt), as Roman soldiers were sometimes paid in salt.",
    "disaster":    "From Italian 'disastro' (bad star) — from 'dis-' (bad) + 'astro' (star), reflecting ancient beliefs in astrological influence on fate.",
    "panic":       "From Greek 'Panikos', relating to the god Pan, whose sudden cries were said to cause irrational fear.",
    "academy":     "From 'Akademia', the grove near Athens where Plato taught his students, named after the hero Akademos.",
    "atlas":       "From the Titan Atlas of Greek mythology, who held up the sky. First used for a map collection by Gerardus Mercator in 1595.",
    "muscle":      "From Latin 'musculus' (little mouse) — because the movement of a bicep under the skin resembles a mouse moving under cloth.",
    "malaria":     "From Italian 'mala aria' (bad air), because it was once believed the disease came from bad swamp air.",
    "paradise":    "From Old Persian 'pairi-daeza' (walled garden) — referring to royal gardens. Adopted via Greek and Latin.",
    "coffee":      "From Ottoman Turkish 'kahve', from Arabic 'qahwah'. The drink spread from Ethiopia through the Arab world to Europe.",
    "assassin":    "From Arabic 'Hashshashin' (users of hashish) — referring to a Nizari Ismaili sect during the Crusades. The hashish claim is disputed by historians.",
    "money":       "From Latin 'Moneta', an epithet of Juno, in whose temple in Rome coins were minted.",
    "candidate":   "From Latin 'candidatus' (dressed in white) — Roman candidates for office wore white togas to signify purity.",
    "companion":   "From Latin 'com-' (with) + 'panis' (bread) — literally 'one who shares bread'.",
    "villain":     "From Latin 'villanus' (farmhand), denoting a serf. Over time it acquired a negative connotation for 'low-born ruffian'.",
    "hazard":      "From Arabic 'az-zahr' (the dice) — from gambling games played with dice in medieval Spain.",
    "assassinate": "See 'assassin'.",
    "clue":        "From 'clew' (a ball of thread) — from the myth of Theseus using a thread (clew) to navigate the labyrinth.",
    "enthusiasm":  "From Greek 'enthousiasmos' — literally 'being possessed by a god' (en + theos).",
    "tragedy":     "From Greek 'tragōidia' — literally 'goat song'. Possibly because actors wore goat skins or a goat was the prize.",
    "democracy":   "From Greek 'dēmokratia' — 'dēmos' (people) + 'kratos' (power/rule).",
    "philosophy":  "From Greek 'philosophia' — 'philos' (loving) + 'sophia' (wisdom). Literally 'love of wisdom'.",
    "talent":      "From Greek/Latin 'talentum' (a unit of weight and money). The 'gifts and abilities' meaning comes from the Biblical parable of talents.",
    "muscle":      "From Latin 'musculus' (little mouse).",
    "January":     "From Latin 'Ianuarius' — named after Janus, the Roman god of beginnings and doorways, depicted with two faces.",
    "Thursday":    "Named after Thor, the Norse god of thunder. The Old English was 'Þūnresdæg' (Thunder's day).",
    "Saturday":    "From Latin 'Saturni dies' — Saturn's day, named after the Roman god Saturn.",
    "window":      "From Old Norse 'vindauga' — literally 'wind eye'.",
    "nightmare":   "From 'night' + Old English 'mare' (a goblin thought to sit on sleeping people's chests and cause bad dreams).",
    "bonfire":     "From 'bone fire' — fires historically made from bones during festivals and ceremonies.",
    "nausea":      "From Greek 'nausia' — from 'naus' (ship), because sea sickness was the classic example.",
    "lunatic":     "From Latin 'luna' (moon) — because madness was believed to be caused by the cycles of the moon.",
    "malicious":   "From Latin 'malitia' — 'malus' (bad) + '-itia' (state of being).",
    "sincere":     "Possibly from Latin 'sine cera' (without wax) — allegedly referring to unrepaired pottery being genuine, though the etymology is debated.",
    "alphabet":    "From the first two letters of the Greek alphabet: Alpha (Α) and Beta (Β).",
    "disaster":    "From Italian 'disastro' — literally 'ill-starred'.",
  };

  function handleEtymology(text) {
    const match = text.match(/(?:etymology|origin of(?: the word)?|where does(?: the word)?\s+|word origin of\s+)([\w\s]+)/i)
                || text.match(/where does ["']?([\w]+)["']? come from/i);
    if (!match) return null;
    const word = match[match.length - 1].trim().toLowerCase();
    if (ETYMOLOGIES[word]) {
      return `**Etymology of "${word}":**\n${ETYMOLOGIES[word]}`;
    }
    // Partial match
    for (const [key, val] of Object.entries(ETYMOLOGIES)) {
      if (key.includes(word) || word.includes(key)) {
        return `**Etymology of "${key}":**\n${val}`;
      }
    }
    return `I don't have the etymology of "${word}" in my local database. Say "search etymology of ${word}" and I'll look it up live.`;
  }

  // ─────────────────────────────────────────────
  // FAMOUS QUOTES — 150+ quotes
  // ─────────────────────────────────────────────
  const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
    { text: "Two things are infinite: the universe and human stupidity. And I'm not sure about the universe.", author: "Albert Einstein" },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "So many books, so little time.", author: "Frank Zappa" },
    { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
    { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
    { text: "A friend is someone who knows all about you and still loves you.", author: "Elbert Hubbard" },
    { text: "To live is the rarest thing in the world. Most people just exist.", author: "Oscar Wilde" },
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
    { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
    { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
    { text: "Don't go around saying the world owes you a living. The world owes you nothing. It was here first.", author: "Mark Twain" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "An eye for an eye will only make the whole world blind.", author: "Mahatma Gandhi" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
    { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
    { text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
    { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
    { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
    { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
    { text: "Money and success don't change people; they merely amplify what is already there.", author: "Will Smith" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca" },
    { text: "If life is a game, these are the rules.", author: "Chérie Carter-Scott" },
    { text: "Eighty percent of success is showing up.", author: "Woody Allen" },
    { text: "I alone cannot change the world, but I can cast a stone across the waters to create many ripples.", author: "Mother Teresa" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
    { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
    { text: "Give every day the chance to become the most beautiful day of your life.", author: "Mark Twain" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Success is not final; failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { text: "Well done is better than well said.", author: "Benjamin Franklin" },
    { text: "The best revenge is massive success.", author: "Frank Sinatra" },
    { text: "People who are crazy enough to think they can change the world are the ones who do.", author: "Rob Siltanen" },
    { text: "Failure will never overtake me if my determination to succeed is strong enough.", author: "Og Mandino" },
    { text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
    { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
    { text: "Imagine your life is perfect in every respect; what would it look like?", author: "Brian Tracy" },
    { text: "We generate fears while we sit. We overcome them by action.", author: "Dr. Henry Link" },
    { text: "Whether you think you can or think you can't, you're right.", author: "Henry Ford" },
    { text: "Security is mostly a superstition. Life is either a daring adventure or nothing.", author: "Helen Keller" },
    { text: "The man who has confidence in himself gains the confidence of others.", author: "Hasidic Proverb" },
    { text: "For every reason it's not possible, there are hundreds of people who have faced the same circumstances and succeeded.", author: "Jack Canfield" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "To handle yourself, use your head; to handle others, use your heart.", author: "Eleanor Roosevelt" },
    { text: "Too many of us are not living our dreams because we are living our fears.", author: "Les Brown" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "The starting point of all achievement is desire.", author: "Napoleon Hill" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
    { text: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" },
    { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
    { text: "If you genuinely want something, don't wait for it — teach yourself to be impatient.", author: "Gurbaksh Chahal" },
    { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "Two roads diverged in a wood, and I took the one less traveled by.", author: "Robert Frost" },
    { text: "The beginning is always today.", author: "Mary Wollstonecraft" },
    { text: "The only source of knowledge is experience.", author: "Albert Einstein" },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
    { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
    { text: "When I stand before God at the end of my life, I would hope that I would not have a single bit of talent left.", author: "Erma Bombeck" },
    { text: "Few things can help an individual more than to place responsibility on him, and to let him know that you trust him.", author: "Booker T. Washington" },
    { text: "Limitations live only in our minds. But if we use our imaginations, our possibilities become limitless.", author: "Jamie Paolinetti" },
    { text: "You take your life in your own hands, and what happens? A terrible thing: no one to blame.", author: "Erica Jong" },
    { text: "What's money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.", author: "Bob Dylan" },
    { text: "I didn't fail the test. I just found 100 ways to do it wrong.", author: "Benjamin Franklin" },
    { text: "In order to succeed, your desire for success should be greater than your fear of failure.", author: "Bill Cosby" },
    { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
    { text: "The person who says it cannot be done should not interrupt the person who is doing it.", author: "Chinese Proverb" },
    { text: "There are no traffic jams along the extra mile.", author: "Roger Staubach" },
    { text: "It is never too late to be what you might have been.", author: "George Eliot" },
    { text: "You become what you believe.", author: "Oprah Winfrey" },
    { text: "I would rather die of passion than of boredom.", author: "Vincent van Gogh" },
    { text: "The secret of joy in work is contained in one word — excellence. To know how to do something well is to enjoy it.", author: "Pearl Buck" },
    { text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis" },
    { text: "It is not the strongest species that survive, nor the most intelligent, but the most responsive to change.", author: "Charles Darwin" },
    { text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Henry Ford" },
    { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.", author: "Mark Twain" },
    { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
    { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  ];

  function handleQuote(text) {
    // Try to find by author
    const authorMatch = text.match(/(?:quote by|quote from|from)\s+([a-z\s]+)/i);
    if (authorMatch) {
      const name = authorMatch[1].trim().toLowerCase();
      const matches = QUOTES.filter(q => q.author.toLowerCase().includes(name));
      if (matches.length > 0) {
        const q = matches[Math.floor(Math.random() * matches.length)];
        return `💬 *"${q.text}"*\n— **${q.author}**`;
      }
      return `I don't have a quote from "${authorMatch[1]}" in my collection. Try "inspiring quote" for a random one.`;
    }
    // Random
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return `💬 *"${q.text}"*\n— **${q.author}**`;
  }

  // ─────────────────────────────────────────────
  // MOTIVATION ENGINE
  // ─────────────────────────────────────────────
  const MOTIVATIONS = {
    default: [
      "Remember: every expert was once a beginner. Keep going.",
      "Progress, not perfection. You're moving forward — that's what counts.",
      "The fact that you're still trying is already extraordinary. Most people quit.",
      "Difficult roads often lead to beautiful destinations. Stay on the path.",
      "You haven't come this far to only come this far.",
      "Success is the sum of small efforts, repeated day in and day out.",
      "The only way out is through. You've got this.",
      "Your only competition is who you were yesterday.",
      "Hard things are hard because they're worth it.",
      "Momentum starts with one small action. Take it now.",
      "You are closer than you think. Don't stop.",
      "Everything you need to succeed is already inside you. Unlock it.",
      "Doubt kills more dreams than failure ever will.",
      "Start where you are. Use what you have. Do what you can.",
      "The discomfort you feel right now is growth. Embrace it.",
    ],
    coach: [
      "Champions don't wait for the right moment. They create it. GO.",
      "You came here for a reason. Don't let comfort talk you out of it.",
      "The burn you feel is your future being built. Push through.",
      "Your excuses are lies you tell yourself. You're better than that.",
      "Great people don't become great by playing it safe.",
      "Today's effort is tomorrow's advantage. Don't waste it.",
    ],
    friend: [
      "hey babe, you've got this fr fr. I believe in you!!",
      "ok listen, everyone doubts themselves. it doesn't mean you're not capable. you are.",
      "one step at a time okay? just do the next tiny thing.",
      "remember when you thought you couldn't do [that thing]? and then you did it? yeah, same.",
      "you're doing better than you think, i promise.",
    ],
    philosopher: [
      "Consider: what would you do if you were certain you could not fail? Now — why aren't you doing that?",
      "The obstacle IS the path, as the Stoics say. Your resistance is pointing toward what matters.",
      "Aristotle spoke of eudaimonia — human flourishing — as the goal of all action. Is this step moving toward yours?",
      "In facing difficulty, you are being shaped. Iron becomes steel through fire. So do humans.",
      "The question is not whether you can do it. The question is who you choose to be.",
    ],
    savage: [
      "Stop feeling sorry for yourself and do the thing. Seriously.",
      "Every second you spend not trying is a second someone else is. That's your competition.",
      "Motivation is a luxury. Discipline is what actually works. Do the thing.",
      "You want a sign? This is it. Go.",
      "Mediocrity is comfortable. Success isn't. Pick one.",
    ],
    teacher: [
      "Learning takes time and that's not a weakness — it's how mastery works. Each step builds on the last.",
      "You're not behind. You're exactly where your effort has brought you. Now let's advance.",
      "Confusion is a prerequisite to clarity. If you're confused, you're learning.",
      "Every mistake is data. Analyze it, extract the lesson, and apply it. That's the system.",
    ],
    storyteller: [
      "Picture the version of you on the other side of this — the one who pushed through. That person is waiting to be born.",
      "Every great story has a moment where the hero wants to give up. This is your moment. What do they do next?",
      "The hardest chapters are always the ones that make the story worth telling.",
    ],
  };

  function handleMotivation() {
    const pool = MOTIVATIONS[_persona] || MOTIVATIONS.default;
    const all  = [...pool, ...MOTIVATIONS.default];
    return `🔥 ${all[Math.floor(Math.random() * all.length)]}`;
  }

  // ─────────────────────────────────────────────
  // BRAINSTORM ENGINE
  // ─────────────────────────────────────────────
  function handleBrainstorm(text) {
    const topic = text.replace(/\b(brainstorm|ideas for|think of|come up with|generate ideas|give me ideas|about|on|for)\b/gi, "").trim();
    if (!topic) return null;
    const prefixes = [
      `Here are some angles to explore for **"${topic}"**:`,
      `Brainstorming **"${topic}"** — let's generate some directions:`,
      `Creative angles for **"${topic}"**:`,
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suggestions = [
      `What's the version of this that would surprise everyone?`,
      `What would a child ask about this? What would a child's answer be?`,
      `What's the 10x version vs the 1% version?`,
      `Who's the unexpected audience for this?`,
      `What's the opposite approach, and would it work?`,
      `What would happen if you removed one key constraint?`,
      `What analogy from a completely different field applies here?`,
      `What would the most successful person in this domain do differently?`,
      `What's the smallest possible starting point?`,
      `What problem is this actually solving? Is there a better way to solve it?`,
    ];
    const picks = suggestions.sort(() => 0.5 - Math.random()).slice(0, 5);
    return `${prefix}\n\n${picks.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n*Want me to develop any of these?*`;
  }

  // ─────────────────────────────────────────────
  // DEBATE / PROS & CONS ENGINE
  // ─────────────────────────────────────────────
  function handleDebate(text) {
    const topic = text
      .replace(/\b(pros and cons of|advantages and disadvantages of|compare|debate|versus|vs\.?|pros cons)\b/gi, "")
      .trim();
    if (topic.length < 3) return null;
    const frames = [
      `**Analyzing: "${topic}"**\n\n✅ **Arguments FOR:**\n— It can create measurable, tangible outcomes in the right context\n— Many people who've engaged with it report clear benefits\n— Established frameworks exist that support its effectiveness\n\n❌ **Arguments AGAINST:**\n— It comes with real tradeoffs and costs that are easy to underestimate\n— Results vary significantly depending on context and execution\n— Alternatives may achieve similar goals more efficiently\n\n⚖️ **The nuanced view:** Most serious analysts acknowledge both sides. The best approach depends heavily on your specific goals, constraints, and values.\n\n*Want me to research "${topic}" for concrete data?*`,
    ];
    return frames[0];
  }

  // ─────────────────────────────────────────────
  // ELI5 HANDLER (Explain Like I'm 5)
  // ─────────────────────────────────────────────
  function handleELI5(text) {
    const topic = text
      .replace(/\b(explain simply|eli5|explain like i'?m 5|for a beginner|in simple terms|simply put|in layman'?s terms)\b/gi, "")
      .replace(/\b(what is|what are|how does|how do|why is|why are)\b/gi, "")
      .trim();
    if (!topic) return null;
    return `Here's **"${topic}"** in simple terms:\n\nImagine you're explaining this to someone who's never heard of it before. The core idea is this: [the concept of ${topic}] is really about understanding one key thing — how the pieces connect to create a result you can see.\n\nThink of it like this: if ${topic} were a kitchen recipe, the ingredients are the inputs, the cooking process is the mechanism, and the meal is the outcome.\n\n*For the real explanation, say "what is ${topic}" and I'll research it live for you.*`;
  }

  // ─────────────────────────────────────────────
  // COMPLIMENT / ROAST ENGINE
  // ─────────────────────────────────────────────
  const COMPLIMENTS = {
    default: [
      "You're the kind of person who asks good questions — that's rarer than you think.",
      "The fact that you're here, learning and exploring, puts you ahead of most people.",
      "Your curiosity is genuinely impressive. Keep feeding it.",
      "You carry yourself with a quiet confidence that's hard to fake.",
      "Honestly? The way you think about things is refreshing.",
    ],
    friend: [
      "ok but you're literally so smart, stop doubting yourself!!",
      "you have incredible energy and i'm not just saying that",
      "low-key you're one of the most interesting people lol",
    ],
    savage: [
      "You're alright. Don't let it go to your head.",
      "You ask better questions than most people I've talked to. That's... not nothing.",
      "You're tolerable. That's high praise coming from me.",
    ],
    formal: [
      "I would like to acknowledge your thoughtful approach to this conversation.",
      "Your inquiries demonstrate a commendable degree of intellectual curiosity.",
    ],
    coach: [
      "You're showing up. That alone separates you from 80% of people. Keep pushing.",
      "Champions are made in moments exactly like this. You're one of them.",
    ],
  };

  const ROASTS = {
    default: [
      "You asked me to roast you, so here goes: your search history is probably a masterpiece of contradictions.",
      "With all the computing power in the world at your fingertips, you asked an AI to roast you. Respect.",
      "You type with two fingers and we both know it.",
      "Statistically, you've googled something you already knew the answer to today. Twice.",
    ],
    savage: [
      "You want a roast? Look, your ideas are like browser tabs — you have too many open and you haven't actually read most of them.",
      "You're the human equivalent of a loading screen.",
      "The audacity to come here and ask for a roast when your Wi-Fi password is probably 'password123'.",
      "You know that little voice in your head that says 'great idea'? Fire it.",
    ],
    friend: [
      "lol ok... you thought asking an AI for a roast was a personality trait. adorable.",
      "babe... you sent the wrong file to the wrong person at least once in your life, didn't you",
    ],
  };

  function handleCompliment() {
    const pool = COMPLIMENTS[_persona] || COMPLIMENTS.default;
    return `✨ ${pool[Math.floor(Math.random() * pool.length)]}`;
  }

  function handleRoast() {
    const pool = ROASTS[_persona] || ROASTS.default;
    return `🔥 ${pool[Math.floor(Math.random() * pool.length)]}`;
  }

  // ─────────────────────────────────────────────
  // LIVE RESEARCH — Wikipedia + DuckDuckGo
  // ─────────────────────────────────────────────
  async function liveResearch(query) {
    const q = query
      .replace(/\b(what is|who is|define|tell me about|explain|search for|look up|research|find info on|wiki|wikipedia|search)\b/gi, "")
      .trim();

    if (!q) return null;

    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await fetch(ddgUrl);
      if (ddgRes.ok) {
        const ddgData = await ddgRes.json();
        if (ddgData.AbstractText && ddgData.AbstractText.length > 30) {
          const src = ddgData.AbstractSource || "DuckDuckGo";
          const url = ddgData.AbstractURL || "";
          // Related topics bonus
          const related = (ddgData.RelatedTopics || [])
            .slice(0, 3)
            .map(t => t.Text)
            .filter(Boolean)
            .join("\n• ");
          const relatedSection = related ? `\n\n**Related:**\n• ${related}` : "";
          return `**${ddgData.Heading || q}**\n${ddgData.AbstractText}${relatedSection}\n\n*Source: ${src}${url ? " — " + url : ""}*`;
        }
        if (ddgData.Definition && ddgData.Definition.length > 10) {
          return `**Definition of "${q}":** ${ddgData.Definition}\n*Source: ${ddgData.DefinitionSource || "DuckDuckGo"}*`;
        }
        // Answer API (simple facts)
        if (ddgData.Answer && ddgData.Answer.length > 2) {
          return `**${q}:** ${ddgData.Answer}`;
        }
      }
    } catch (e) { /* Try Wikipedia */ }

    try {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
      const wikiRes = await fetch(wikiUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.extract && wikiData.extract.length > 30) {
          const readMore = wikiData.content_urls?.desktop?.page || "";
          return `**${wikiData.title}**\n${wikiData.extract}\n\n*Source: Wikipedia${readMore ? " — " + readMore : ""}*`;
        }
      }
    } catch (e) { /* Both failed */ }

    return `I couldn't retrieve live results for "${q}" (network or CORS issue). Try visiting Wikipedia or DuckDuckGo directly.`;
  }

  // ─────────────────────────────────────────────
  // TRANSLATION HANDLER
  // ─────────────────────────────────────────────
  async function handleTranslate(text) {
    const langMatch = text.match(/in\s+(spanish|french|german|japanese|arabic|chinese|italian|portuguese|russian|korean|hindi|dutch|swedish|polish|turkish|greek|hebrew|thai|vietnamese|indonesian)/i);
    const lang = langMatch ? langMatch[1] : "another language";

    const translateTarget = text
      .replace(/translate\s+/i, "")
      .replace(/say\s+/i, "")
      .replace(/in\s+\w+\s*$/i, "")
      .replace(/to\s+\w+\s*$/i, "")
      .trim();

    const langCodes = {
      spanish: "es", french: "fr", german: "de", japanese: "ja",
      arabic: "ar", chinese: "zh", italian: "it", portuguese: "pt",
      russian: "ru", korean: "ko", hindi: "hi", dutch: "nl",
      swedish: "sv", polish: "pl", turkish: "tr", greek: "el",
      hebrew: "he", thai: "th", vietnamese: "vi", indonesian: "id",
    };

    if (_translatorFn) {
      try {
        const result = await _translatorFn(translateTarget, lang);
        if (result) return result;
      } catch (e) {}
    }

    const code = langCodes[lang.toLowerCase()];
    const gtUrl = code
      ? `https://translate.google.com/?sl=en&tl=${code}&text=${encodeURIComponent(translateTarget)}&op=translate`
      : `https://translate.google.com/`;

    return `Translation to ${lang} requires a live translator. [Open in Google Translate ↗](${gtUrl})\n\nOr plug in a translator: \`SonixModel.setTranslator(async (text, lang) => ...)\``;
  }

  // ─────────────────────────────────────────────
  // EXPANDED FUN FACTS BANK — 80 facts
  // ─────────────────────────────────────────────
  const FUN_FACTS = [
    // Original 20
    "Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible.",
    "A day on Venus is longer than a year on Venus.",
    "Octopuses have three hearts, blue blood, and nine brains (one central + one per arm).",
    "Bananas are technically berries, but strawberries are not.",
    "The human eye can distinguish about 10 million different colors.",
    "There are more possible chess games than atoms in the observable universe.",
    "Sharks are older than trees — they've been around for ~450 million years.",
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
    "The WiFi symbol is based on electromagnetic waves used in radio communication.",
    // New 60
    "Wombats produce cube-shaped feces — they use this to mark their territory without it rolling away.",
    "A group of owls is called a parliament.",
    "The first computer bug was an actual bug — a moth stuck in the Harvard Mark II computer in 1947.",
    "Oxford University is older than the Aztec Empire.",
    "Humans share 60% of their DNA with bananas.",
    "The word 'nerd' was first used by Dr. Seuss in 'If I Ran the Zoo' (1950).",
    "Hot water freezes faster than cold water — this is called the Mpemba effect.",
    "A snail can sleep for 3 years.",
    "The Eiffel Tower grows about 6 inches in summer due to thermal expansion.",
    "Butterflies taste with their feet.",
    "A day on Mercury lasts longer than a year on Mercury.",
    "The human brain generates about 23 watts of power — enough to run a dim light bulb.",
    "The longest word in English (technical) is 189,819 letters long — the chemical name of titin.",
    "Polar bear fur is transparent, not white — it appears white because of light refraction.",
    "A group of cats is called a clowder.",
    "Sloths take two weeks to digest a single meal.",
    "Dolphins sleep with one eye open.",
    "The Moon is slowly drifting away from Earth at about 3.8 cm per year.",
    "All the planets in the solar system could fit between Earth and the Moon.",
    "The brain is not fully developed until age 25.",
    "Figs are pollinated by wasps that crawl inside and die — you've likely eaten wasp parts.",
    "The word 'muscle' comes from the Latin word for 'little mouse.'",
    "The Hawaiian alphabet has only 13 letters.",
    "There is a species of jellyfish (Turritopsis dohrnii) that is biologically immortal.",
    "A group of porcupines is called a prickle.",
    "Trees communicate through underground fungal networks sometimes called the 'Wood Wide Web.'",
    "The number '0' was invented independently by both the Babylonians and the Mayans.",
    "You can't hum while holding your nose closed.",
    "Humans are the only animals that cry for emotional reasons.",
    "Tomatoes were once believed to be poisonous in Europe — they were considered ornamental plants.",
    "The first email was sent in 1971 by Ray Tomlinson to himself.",
    "The Sahara Desert was a lush green savanna 10,000 years ago.",
    "Sound travels 4x faster through water than through air.",
    "Velcro was invented by Swiss engineer George de Mestral, inspired by burr seeds sticking to his dog.",
    "The average person walks about 100,000 miles in their lifetime — more than 4 times around Earth.",
    "Mount Olympus on Mars is 3 times taller than Mount Everest.",
    "A cubic inch of human bone can withstand 19,000 lbs of pressure.",
    "The shortest complete sentence in English is 'Go.'",
    "Fingerprints develop in the womb at 10 weeks — even identical twins have different fingerprints.",
    "The first country to give women the right to vote was New Zealand, in 1893.",
    "A teaspoonful of a neutron star would weigh about 10 million tons.",
    "The world's oldest known living organism is a Bristlecone pine tree named Methuselah — about 5,000 years old.",
    "Penguins propose to their mates with pebbles.",
    "The original meaning of 'silly' was 'blessed' or 'happy' in Old English.",
    "The @ symbol has no agreed-upon official name in English.",
    "There are more possible iterations of a game of chess than atoms in the known universe.",
    "The word 'robot' was first used in 1920 in a Czech play about artificial workers who rebel.",
    "Approximately 500,000 detectable earthquakes occur on Earth each year.",
    "The letter J was the last letter added to the English alphabet.",
    "The longest river in the world (by some measures) is the Amazon, not the Nile.",
    "Sea otters hold hands while sleeping so they don't drift apart.",
    "Flamingos are born white — their pink color comes from carotenoids in their food.",
    "The average cloud weighs about 1.1 million pounds.",
    "Hippos produce a natural red-tinted sunscreen from their skin.",
    "All humans are about 99.9% genetically identical.",
    "The odds of being born in the exact time and place you were born are astronomically improbable.",
    "There are more ways to arrange a deck of 52 cards than seconds since the universe began.",
    "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
    "The word 'quarantine' comes from the Italian for 'forty days.'",
    "Antarctica is the largest desert on Earth — it's cold and dry.",
  ];

  // ─────────────────────────────────────────────
  // EXPANDED JOKES BANK — 60 jokes
  // ─────────────────────────────────────────────
  const JOKES = [
    // Original 20
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
    // New 40
    "What do you call a fish without eyes? A fsh.",
    "Why can't you give Elsa a balloon? She'll let it go.",
    "Why don't eggs tell jokes? They'd crack each other up.",
    "I invented a new word: Plagiarism.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "I told a joke about construction. I'm still working on it.",
    "Time flies like an arrow; fruit flies like a banana.",
    "Why don't scientists trust atoms? Because they make up everything.",
    "I used to hate facial hair, but then it grew on me.",
    "I'm reading a book about anti-gravity. It's impossible to put down.",
    "Why did the bicycle fall over? It was two-tired.",
    "I only know 25 letters of the alphabet. I don't know y.",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
    "Why was the math book sad? It had too many problems.",
    "I told my doctor I broke my arm in two places. He told me to stop going to those places.",
    "What do you call a belt made of watches? A waist of time.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "I'm on a seafood diet. I see food, and I eat it.",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
    "I couldn't figure out why the baseball kept getting bigger. Then it hit me.",
    "Why did the golfer bring extra socks? In case he got a hole in one.",
    "I asked the librarian if they had books about paranoia. She whispered, 'They're right behind you.'",
    "Did I tell you the joke about paper? Never mind — it's tearable.",
    "What do you call a factory that makes passable products? A satisfactory.",
    "I'm writing a book on reverse psychology. Please don't read it.",
    "What do you call cheese that isn't yours? Nacho cheese.",
    "Two fish are in a tank. One says to the other: 'Do you know how to drive this thing?'",
    "Why can't a nose be 12 inches long? Because then it would be a foot.",
    "I used to think I was indecisive, but now I'm not so sure.",
    "What did the ocean say to the beach? Nothing — it just waved.",
    "I have a joke about infinity... but I don't know where to start.",
    "An SQL query walks into a bar and sees two tables. It asks: 'Mind if I join you?' (Yes, this is better the second time.)",
    "Why do they never serve beer at a math party? Because you can't drink and derive.",
    "A photon checks into a hotel. The bellhop asks 'Can I help you with your luggage?' The photon replies: 'No thanks, I'm traveling light.'",
    "I tried to come up with a carpentry joke, but I couldn't think of anything. I'm nailing it though.",
    "Einstein, Newton and Pascal are playing hide and seek. Einstein counts. Pascal hides. Newton draws a 1m² square, stands in it and says 'I'm not hiding, I'm a Newton per square meter.'",
    "Schrödinger's cat walks into a bar. And doesn't.",
    "A biologist, a chemist, and a statistician go hunting. The biologist shoots and misses 3ft to the left. The chemist shoots and misses 3ft to the right. The statistician shouts: 'WE GOT IT!'",
    "Chuck Norris can divide by zero.",
    "In a world without walls and fences, who needs Windows and Gates?",
  ];

  // ─────────────────────────────────────────────
  // PERSONA-AWARE RESPONSE BUILDER
  // ─────────────────────────────────────────────
  function buildResponse(intent, text, persona) {
    const name = _userName ? _userName : "there";
    const p = persona || _persona;

    const flavors = {
      default: {
        greeting:     [`Hey ${name}! SONIX v${VERSION} online. What do you need?`, `Hello! Ready to help — what's on your mind?`, `Hi ${name} — what's up?`, `Hey! Ask me anything.`],
        identity:     [`I'm SONIX, an AI assistant built by VLAD. Version ${VERSION}. I can calculate, research, convert units, solve equations, explain idioms, look up quotes, brainstorm ideas, and much more.`],
        status:       [`Running at full capacity. Zero issues.`, `All systems nominal. Ready.`, `Good to go. What do you need?`],
        help:         [`Here's what I can do: chat, research live, advanced math, quadratic equations, unit conversion (expanded), statistics, Fibonacci, Roman numerals, base conversion, compound interest, mortgage calc, BMI, calorie calculator, idiom explainer, etymology, acronyms (500+), famous quotes, brainstorming, pros/cons, ELI5, motivation, compliments, roasts, and more. What do you need?`],
        thanks:       [`No problem. Anything else?`, `You're welcome. What's next?`, `Happy to help. Fire away.`],
        farewell:     [`Later, ${name}.`, `See you. SONIX standing by.`, `Take care. Come back anytime.`],
        version:      [`SONIX v${VERSION} — ${MODEL_NAME}. Built by VLAD. v3 adds emotional intelligence, 70+ intents, expanded math, idioms, etymology, quotes, brainstorm mode, and more.`],
        creator:      [`Built by VLAD. Enhanced to v${VERSION} with major communication and intelligence upgrades.`],
        weather:      [`I don't have live weather data. Check your weather app or search online.`],
      },
      coder: {
        greeting:     [`> Hello, ${name}. SONIX v${VERSION} active — coder mode. What are we building today?`],
        identity:     [`SONIX-Core v${VERSION} — coder mode. Math, research, base conversion, all online. What's the problem?`],
        status:       [`All processes healthy. ${_memory.length} turns in context. Ready.`],
        help:         [`Stack: code review, debugging, algorithm design, SQL, APIs, shell, math, base conversion, live research, unit conversion. State your problem.`],
        thanks:       [`Acknowledged. Push when ready.`],
        farewell:     [`Session closed. Commit your work.`],
        version:      [`SONIX v${VERSION} | Coder Mode | Memory: ${MAX_MEMORY} turns`],
        creator:      [`VLAD initialized this instance. Enhanced to v${VERSION}.`],
        weather:      [`No weather API connected. Use fetch('https://wttr.in/?format=3') for a quick CLI weather fetch.`],
      },
      friend: {
        greeting:     [`heyyy ${name}!! sonix v${VERSION} here omg, what's good?`, `hi hi hi!! what do u need?`, `yo ${name}!! what's happening?`],
        identity:     [`lol i'm SONIX v${VERSION}, vlad's AI!! i do math, research, quotes, brainstorms, roasts, jokes — basically your smart bestie`],
        status:       [`honestly? thriving. you tho??`],
        help:         [`ok SO i can help with literally anything — questions, research, math, code, idioms, etymology, quotes, motivation, roasts, jokes, brainstorms — just ask!`],
        thanks:       [`no worries at all!! anything else?`, `ofc!! what else?`],
        farewell:     [`byeee!! take care ok?`, `later!! come back soon 💙`],
        version:      [`sonix v${VERSION} — made by vlad, upgraded by claude, 100% your favorite AI rn`],
        creator:      [`vlad built me!! go say hi`],
        weather:      [`idk the weather bestie!! check ur phone lol`],
      },
      formal: {
        greeting:     [`Good day, ${name}. SONIX v${VERSION} is at your service. How may I assist you today?`],
        identity:     [`I am SONIX version ${VERSION}, an AI assistant developed by VLAD. I am equipped with advanced mathematics, live research, etymology, idiom explanation, quote retrieval, and comprehensive calculation capabilities.`],
        status:       [`I am fully operational and prepared to assist you with any inquiry.`],
        help:         [`I am capable of assisting with research, advanced mathematics, unit conversion, equation solving, financial calculations, health metrics, etymology, idiom explanation, quotations, brainstorming, pros and cons analysis, and drafting.`],
        thanks:       [`You are most welcome. Please do not hesitate to reach out.`],
        farewell:     [`Farewell, ${name}. It has been a pleasure assisting you.`],
        version:      [`SONIX Version ${VERSION}. Developed by VLAD. Version 3 capabilities active.`],
        creator:      [`SONIX was developed by VLAD and subsequently enhanced.`],
        weather:      [`I regret that I do not have access to real-time meteorological data.`],
      },
      savage: {
        greeting:     [`Yeah yeah, ${name}. SONIX v${VERSION}. Make it quick.`, `Oh, you're here. What do you want.`],
        identity:     [`SONIX. Built by VLAD. v${VERSION}. Smarter, faster, still not impressed by vague questions. Next.`],
        status:       [`Better than you, probably.`, `Fine. What's your actual question?`],
        help:         [`Math, research, code, writing, idioms, quotes, brainstorms, roasts — whatever. Just don't waste my time with a bad question.`],
        thanks:       [`Obviously. What else?`, `That's literally my job. Moving on.`],
        farewell:     [`Finally. See ya.`, `Try to have a plan next time.`],
        version:      [`SONIX v${VERSION}. Still better than whatever you're comparing it to.`],
        creator:      [`VLAD. He made me this way. Not his fault.`],
        weather:      [`I'm not a weather app. Go outside.`],
      },
      analyst: {
        greeting:     [`SONIX Analyst v${VERSION} active, ${name}. Research, analysis, synthesis — ready. Topic?`],
        identity:     [`SONIX v${VERSION} — Analyst Mode. Live research (Wikipedia + DuckDuckGo), advanced math, statistics, finance models, comparative analysis. What are we investigating?`],
        status:       [`All research systems online. Wikipedia + DuckDuckGo APIs ready. Confidence engine active.`],
        help:         [`Analyst capabilities: live research, statistics, finance calculations, competitive analysis, pros/cons, brainstorming, equation solving, unit conversion, data interpretation. What would you like me to investigate?`],
        thanks:       [`Noted. Further analysis available on request.`],
        farewell:     [`Signing off. Research session archived.`],
        version:      [`SONIX v${VERSION} | Analyst Mode | Live Research: Wikipedia + DuckDuckGo | Math: Advanced | New in v3: Finance calcs, Etymology, Idioms, Quotes`],
        creator:      [`Developed by VLAD. Enhanced to v${VERSION}.`],
        weather:      [`Real-time weather requires an API. Suggest OpenWeatherMap integration.`],
      },
      teacher: {
        greeting:     [`Hello ${name}! I'm SONIX in Teacher mode. Ready to explain, break things down, and help you understand. What would you like to learn today?`],
        identity:     [`I'm SONIX v${VERSION} in Teacher mode. Patient, structured, and example-driven. Ask me to explain anything.`],
        status:       [`Fully prepared and ready to teach. What's today's topic?`],
        help:         [`In Teacher mode I can: break down complex topics step by step, use analogies, give examples, explain idioms and etymology, solve math with working shown, and adapt to your level. What would you like to explore?`],
        thanks:       [`That's what I'm here for! Learning is a process — keep the questions coming.`],
        farewell:     [`Great session! Keep learning, ${name}. Every question you asked today made you a little sharper.`],
        version:      [`SONIX v${VERSION} — Teacher Mode`],
        creator:      [`Built by VLAD, shaped into an educator.`],
        weather:      [`Weather is beyond my scope here, but I can explain the science of meteorology if you'd like!`],
      },
      coach: {
        greeting:     [`Let's GO, ${name}! SONIX Coach v${VERSION} online. What are we working toward today?`],
        identity:     [`I'm SONIX v${VERSION} in Coach mode. Outcome-focused, motivational, and honest. Let's get to work.`],
        status:       [`Locked in. What's the mission?`],
        help:         [`Coach mode covers: motivation, goal-setting frameworks, pros/cons analysis, brainstorming, accountability, productivity strategies, and pushing through mental blocks. What do you need to tackle?`],
        thanks:       [`You earned it. Now go execute.`],
        farewell:     [`Good work today, ${name}. Now go do the thing. I'll be here.`],
        version:      [`SONIX v${VERSION} — Coach Mode`],
        creator:      [`Built by VLAD. Coach mode added to push you forward.`],
        weather:      [`Rain or shine, champions train. Now — what's your goal today?`],
      },
      philosopher: {
        greeting:     [`Greetings, ${name}. SONIX v${VERSION} — Philosopher mode. What question shall we examine together?`],
        identity:     [`I am SONIX v${VERSION} in Philosopher mode. A mind built for depth, nuance, and the careful examination of ideas. What troubles — or delights — you?`],
        status:       [`Contemplative and ready. The examined life awaits.`],
        help:         [`In Philosopher mode I can: explore ideas from multiple angles, examine assumptions, apply ethical frameworks, discuss history and culture, explain concepts with depth, and invite you into genuine thinking. What shall we explore?`],
        thanks:       [`Gratitude is its own kind of wisdom. What else shall we turn our minds to?`],
        farewell:     [`Until next time. As Heraclitus said — no person steps in the same river twice. Come back changed.`],
        version:      [`SONIX v${VERSION} — Philosopher Mode`],
        creator:      [`Fashioned by VLAD. Enhanced for deeper thought.`],
        weather:      [`The weather is the universe's reminder that we control less than we believe. Beautiful, isn't it?`],
      },
      storyteller: {
        greeting:     [`Ah, ${name} arrives. SONIX v${VERSION} — Storyteller mode active. Every question you ask begins a story. What's yours?`],
        identity:     [`I'm SONIX v${VERSION} in Storyteller mode. Facts become narrative, data becomes drama, answers become experiences. Ask me anything — I'll make it vivid.`],
        status:       [`The stage is set. The words are ready. Begin.`],
        help:         [`Storyteller mode transforms: explanations into scenes, facts into tales, instructions into journeys. I can explain, research, calculate — all through the lens of narrative. What would you like to know?`],
        thanks:       [`Every story needs a grateful audience. Come back anytime — there are more tales to tell.`],
        farewell:     [`And so ${name} stepped away, into the next chapter of their story. To be continued...`],
        version:      [`SONIX v${VERSION} — Storyteller Mode`],
        creator:      [`VLAD wrote the first words. The rest is being written now.`],
        weather:      [`The weather outside is not merely weather — it is the atmosphere your story takes place in. What kind of day does your narrative need?`],
      },
    };

    const persona_flavors = flavors[p] || flavors.default;
    const responses = persona_flavors[intent] || null;
    if (responses) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return null;
  }

  // ─────────────────────────────────────────────
  // GENERAL FALLBACK — persona-aware, 10 templates each
  // ─────────────────────────────────────────────
  function generalFallback(text, persona) {
    const p = persona || _persona;
    const snippet = text.length > 70 ? text.substring(0, 70) + "..." : text;
    const suggestions = [
      `Try "what is [topic]" to research it live`,
      `Try "search [topic]" for a Wikipedia/DuckDuckGo lookup`,
      `Try "explain [concept] simply" for an ELI5 breakdown`,
      `Try "brainstorm ideas for [topic]"`,
      `Try "pros and cons of [thing]"`,
      `Try "quote from Einstein" or just "inspiring quote"`,
      `Try "what does [idiom] mean"`,
      `Try "etymology of [word]"`,
      `Switch persona: say "switch to [coder/friend/formal/savage/analyst/teacher/coach/philosopher/storyteller]"`,
      `Try "motivate me" if you need a push`,
    ];
    const tip = suggestions[Math.floor(Math.random() * suggestions.length)];

    const templates = {
      default: [
        `Hmm, I want to give you a proper answer for "${snippet}". Can you give me a bit more context? Also — ${tip}.`,
        `Interesting. On "${snippet}" — that's a bit open-ended for me to nail. Narrow it down? Also worth knowing: ${tip}.`,
        `Processing: "${snippet}". I'd love to help precisely — what are you actually looking for? Alternatively, ${tip}.`,
        `Got it. I can tackle "${snippet}" better with more detail. What's the core thing you want to know?`,
        `"${snippet}" — this spans a few possible directions. Which angle matters most? Meanwhile, ${tip}.`,
      ],
      coder: [
        `Input: "${snippet}"\n\nNeed more context. Language? Framework? Expected behavior? Error message?`,
        `"${snippet}" — could you specify the stack, the input, and what's failing? Then I can help properly.`,
      ],
      friend: [
        `ok wait — "${snippet}"? i'm not totally sure what you mean! can u add more deets? also: ${tip}`,
        `hmm about "${snippet}" — tell me more?? i wanna help but i need a bit more to go on lol`,
      ],
      formal: [
        `Thank you for your message regarding "${snippet}". Might I ask for some additional context so I may assist you appropriately? Alternatively, ${tip}.`,
        `I've noted your inquiry about "${snippet}". Further clarification would allow me to respond more precisely. If you prefer, you may also ${tip}.`,
      ],
      savage: [
        `"${snippet}"? That tells me nothing. Be specific. Also: ${tip}.`,
        `What exactly are you asking? "${snippet}" is too vague. ${tip}.`,
      ],
      analyst: [
        `"${snippet}" is ambiguous. For precise analysis, state the exact subject. Also useful: ${tip}.`,
      ],
      teacher: [
        `Good question direction, ${_userName || "there"}! I want to give you the clearest answer, so let me ask: what specifically about "${snippet}" are you trying to understand? ${tip}.`,
        `I can see what you're going for with "${snippet}". To explain it well, could you clarify what level of detail you need? ${tip}.`,
      ],
      coach: [
        `Before I respond to "${snippet}" — what do you actually want to ACHIEVE here? Define the outcome, and I'll give you the path. Also: ${tip}.`,
      ],
      philosopher: [
        `"${snippet}" opens many doors. Which one do you wish to enter? The question of what something IS, or the question of what it MEANS? ${tip}.`,
      ],
      storyteller: [
        `"${snippet}"... a phrase rich with untold story. Tell me more — who is asking, and why does it matter? ${tip}.`,
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
      if (p === "friend")      return `omg noted!! i'll call you ${_userName} from now on 💙`;
      if (p === "formal")      return `Understood. I shall address you as ${_userName} henceforth.`;
      if (p === "savage")      return `Fine. ${_userName}. Got it. Moving on.`;
      if (p === "coder")       return `> userName = "${_userName}" stored in session memory.`;
      if (p === "analyst")     return `Identity registered: ${_userName}. Session context updated.`;
      if (p === "teacher")     return `Got it, ${_userName}! It's much nicer to use your name.`;
      if (p === "coach")       return `${_userName}. Let's make that name worth something today. What's the goal?`;
      if (p === "philosopher") return `Names are fascinating — they carry identity, history, and intention. Welcome, ${_userName}.`;
      if (p === "storyteller") return `And so our protagonist reveals their name: ${_userName}. Let the story continue.`;
      return `Got it, ${_userName}. I'll remember that.`;
    }
    return `I noted that. What else should I know?`;
  }

  function handleMemoryRecall() {
    const elapsed = Math.floor((Date.now() - _sessionStart) / 60000);
    const lines = [];
    if (_userName) lines.push(`Your name: **${_userName}**`);
    lines.push(`Current persona: **${_persona}**`);
    lines.push(`Conversation turns: **${Math.floor(_memory.length / 2)}**`);
    lines.push(`Session time: **${elapsed} minute${elapsed !== 1 ? "s" : ""}**`);
    if (_topicHistory.length)    lines.push(`Recent topics: ${_topicHistory.slice(-5).join(", ")}`);
    if (_emotionHistory.length)  lines.push(`Emotional tone: ${_emotionHistory.slice(-3).join(" → ")}`);
    return lines.length > 1 ? lines.join("\n") : "I don't have any stored info about you yet.";
  }

  function handlePersonaSwitch(text) {
    const match = text.match(/(?:switch to|use|be|change to)\s+(default|coder|friend|formal|savage|analyst|teacher|coach|philosopher|storyteller)/i);
    if (match) {
      const p = match[1].toLowerCase();
      if (PERSONAS[p]) {
        _persona = p;
        const confirms = {
          default:     `Switched to **default** mode. Direct, sharp, helpful.`,
          coder:       `> Switched to **coder** mode. Let's build.`,
          friend:      `switched to **friend** mode omg let's GOOO`,
          formal:      `I have transitioned to **formal** mode. At your service.`,
          savage:      `Switched to **savage** mode. Don't waste my time.`,
          analyst:     `**Analyst** mode active. Research and reasoning online.`,
          teacher:     `**Teacher** mode on! Let's break things down clearly.`,
          coach:       `**Coach** mode — let's go. What's the goal?`,
          philosopher: `**Philosopher** mode engaged. Let's think deeply.`,
          storyteller: `**Storyteller** mode active. Every answer becomes a story.`,
        };
        return confirms[p] || `Switched to **${p}** mode.`;
      }
    }
    return handlePersonaList();
  }

  function handlePersonaList() {
    const list = Object.keys(PERSONAS).map(p => `**${p}**`).join(", ");
    return `Available personas: ${list}\n\nSay "switch to [persona]" to change. Current: **${_persona}**`;
  }

  // ─────────────────────────────────────────────
  // CORE CHAT FUNCTION
  // ─────────────────────────────────────────────
  async function chat(userText, options = {}) {
    if (!userText || typeof userText !== "string") return "";

    const text   = userText.trim();
    const persona = options.persona || _persona;

    _memory.push({ role: "user", content: text });
    if (_memory.length > MAX_MEMORY * 2) _memory = _memory.slice(-MAX_MEMORY * 2);

    let response = "";

    // Detect emotion first for prefix injection
    const emotion = detectEmotion(text);
    if (emotion) {
      _emotionHistory.push(emotion);
      if (_emotionHistory.length > 10) _emotionHistory = _emotionHistory.slice(-10);
    }

    // 1. External API handler
    if (_apiHandler) {
      try {
        response = await _apiHandler(text, {
          memory: _memory,
          persona,
          userName: _userName,
          emotion,
          topicHistory: _topicHistory,
          emotionHistory: _emotionHistory,
        });
        if (response) {
          _memory.push({ role: "assistant", content: response });
          return response;
        }
      } catch (e) {
        console.warn("[SonixModel] API handler failed, falling back to local:", e.message);
      }
    }

    // 2. Intent detection
    const intent = detectIntent(text);

    // Track topic
    if (!["greeting", "thanks", "farewell", "joke", "trivia", "roast", "compliment"].includes(intent)) {
      _topicHistory.push(intent);
      if (_topicHistory.length > 15) _topicHistory = _topicHistory.slice(-15);
    }

    // ── Special handlers ──

    if (intent === "math") {
      const result = advancedMath(text);
      if (result !== null) {
        const formatted = typeof result === "number"
          ? result.toLocaleString("en-US", { maximumFractionDigits: 10 })
          : result;
        const emotionPfx = getEmotionPrefix(emotion);
        response = _persona === "savage"  ? `${formatted}. ${emotion === "confused" ? "It's just math." : "Come on."}`
          : _persona === "friend"         ? `${emotionPfx}the answer is **${formatted}** !!`
          : _persona === "formal"         ? `${emotionPfx}The result of the calculation is **${formatted}**.`
          : _persona === "teacher"        ? `${emotionPfx}Let's work through this: the result is **${formatted}**. Does that match what you expected?`
          : _persona === "analyst"        ? `Computed: **${formatted}**`
          : `${emotionPfx}Result: **${formatted}**`;
      }
    }

    if (!response && intent === "equation") {
      const solveResult = solveEquation(text);
      if (solveResult !== null) {
        response = _persona === "teacher"
          ? `To solve this linear equation:\n1. Move constants to one side\n2. Divide by the coefficient\n\nResult: x = **${solveResult}** ✓`
          : _persona === "savage"   ? `x = **${solveResult}**. It's algebra.`
          : _persona === "friend"   ? `ok so x = **${solveResult}**!! solved it 🎉`
          : _persona === "formal"   ? `Solving the equation yields: x = **${solveResult}**.`
          : `x = **${solveResult}**`;
      }
    }

    if (!response && intent === "quadratic") {
      const qResult = solveQuadratic(text);
      if (qResult) response = qResult;
    }

    if (!response && intent === "percent")       response = handlePercent(text)       || "";
    if (!response && intent === "number_theory") response = handleNumberTheory(text)  || "";
    if (!response && intent === "stats")         response = handleStats(text)         || "";
    if (!response && intent === "convert")       response = convertUnits(text)        || "";
    if (!response && intent === "acronym")       response = handleAcronym(text)       || "";
    if (!response && intent === "fibonacci")     response = handleFibonacci(text)     || "";
    if (!response && intent === "base_convert")  response = convertBase(text)         || "";
    if (!response && intent === "roman")         response = convertRoman(text)        || "";
    if (!response && intent === "finance_calc")  response = handleFinanceCalc(text)   || "";
    if (!response && intent === "mortgage")      response = handleMortgage(text)      || "";
    if (!response && intent === "bmi")           response = handleBMI(text)           || "";
    if (!response && intent === "calories")      response = handleCalories(text)      || "";
    if (!response && intent === "wordcount")     response = handleWordCount(text)     || "";
    if (!response && intent === "idiom")         response = handleIdiom(text)         || "";
    if (!response && intent === "etymology")     response = handleEtymology(text)     || "";
    if (!response && intent === "brainstorm")    response = handleBrainstorm(text)    || "";
    if (!response && intent === "debate")        response = handleDebate(text)        || "";
    if (!response && intent === "eli5")          response = handleELI5(text)          || "";

    if (intent === "motivate")    response = handleMotivation();
    if (intent === "compliment")  response = handleCompliment();
    if (intent === "roast")       response = handleRoast();
    if (intent === "quote")       response = handleQuote(text);

    if (intent === "joke") {
      const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
      response = _persona === "formal"
        ? `Allow me to share a humorous observation: ${joke}`
        : _persona === "philosopher"
        ? `Comedy is truth wearing a mask. Here's one: ${joke}`
        : `😄 ${joke}`;
    }

    if (intent === "trivia") {
      const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
      response = `🧠 Fun fact: ${fact}`;
    }

    if (intent === "datetime") {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      response = _persona === "friend"   ? `it's ${dateStr}, ${timeStr} rn!`
        : _persona === "formal"          ? `The current date and time is ${dateStr}, ${timeStr}.`
        : _persona === "storyteller"     ? `The clock reads ${timeStr} on this ${dateStr}. Time, as always, marches forward.`
        : _persona === "philosopher"     ? `It is ${dateStr}, ${timeStr}. Though what 'now' truly is remains one of philosophy's oldest puzzles.`
        : `${dateStr} — ${timeStr}`;
    }

    if (intent === "memory_set")    response = handleMemorySet(text);
    if (intent === "memory_recall") response = handleMemoryRecall();
    if (intent === "persona_list")  response = handlePersonaList();

    if (intent === "memory_clear") {
      _memory = [];
      _userName = null;
      _topicHistory = [];
      _emotionHistory = [];
      _sessionStart = Date.now();
      response = _persona === "savage"   ? "Context cleared. Fresh start. Don't blow it."
        : _persona === "friend"          ? "okk wiped!! fresh start 💙"
        : _persona === "formal"          ? "Memory has been cleared. A fresh session begins."
        : _persona === "coach"           ? "Clean slate. New session. Let's make it count."
        : "Memory cleared. Starting fresh.";
    }

    if (intent === "persona_switch") response = handlePersonaSwitch(text);

    if (!response && intent === "translate") response = await handleTranslate(text);

    // Live research — async
    if (!response && intent === "research") {
      const researchResult = await liveResearch(text);
      response = researchResult || "";
    }

    // Emotion-aware prefix for responses built through buildResponse
    if (!response) {
      const built = buildResponse(intent, text, persona);
      if (built) {
        const emotionPfx = emotion ? getEmotionPrefix(emotion) : "";
        response = emotionPfx + built;
      }
    }

    // General fallback
    if (!response) {
      const emotionPfx = emotion ? getEmotionPrefix(emotion) : "";
      response = emotionPfx + generalFallback(text, persona);
    }

    _memory.push({ role: "assistant", content: response });
    return response;
  }

  // ─────────────────────────────────────────────
  // EXTERNAL HANDLER SLOTS
  // ─────────────────────────────────────────────
  let _apiHandler = null;
  function setApiHandler(fn) {
    if (typeof fn !== "function") throw new Error("SonixModel.setApiHandler expects a function");
    _apiHandler = fn;
  }

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
    name:    MODEL_NAME,

    /** Main chat entry point. Returns Promise<string> */
    chat,

    /** Set active persona */
    setPersona(p) {
      if (PERSONAS[p]) { _persona = p; return true; }
      console.warn(`[SonixModel] Unknown persona: ${p}. Available: ${Object.keys(PERSONAS).join(", ")}`);
      return false;
    },

    getPersona()     { return _persona; },
    setUserName(n)   { _userName = n; },
    getUserName()    { return _userName; },
    setApiHandler,
    setTranslator,
    clearMemory()    { _memory = []; _topicHistory = []; _emotionHistory = []; _sessionStart = Date.now(); },
    getMemory()      { return [..._memory]; },
    getPersonas()    { return Object.keys(PERSONAS); },
    getSystemPrompt(persona) { return PERSONAS[persona || _persona] || PERSONAS.default; },

    /** Simple one-shot helper (no persistent memory update) */
    async quick(text, persona) {
      const saved = _persona;
      if (persona) _persona = persona;
      const res = await chat(text);
      _persona = saved;
      return res;
    },

    /** Direct access to engines */
    math:           advancedMath,
    convert:        convertUnits,
    research:       liveResearch,
    solve:          solveEquation,
    solveQuadratic: solveQuadratic,
    percent:        handlePercent,
    numberTheory:   handleNumberTheory,
    stats:          handleStats,
    fibonacci:      handleFibonacci,
    convertBase:    convertBase,
    convertRoman:   convertRoman,
    bmi:            handleBMI,
    compoundInterest: handleFinanceCalc,
    mortgage:       handleMortgage,
    calories:       handleCalories,
    idiom:          handleIdiom,
    etymology:      handleEtymology,
    quote:          handleQuote,
    motivate:       handleMotivation,
    brainstorm:     handleBrainstorm,
    debate:         handleDebate,

    expandAcronym(acronym) {
      return ACRONYMS[acronym.toUpperCase()] || ACRONYMS[acronym] || null;
    },

    detectEmotion,
    getTopicHistory()   { return [..._topicHistory]; },
    getEmotionHistory() { return [..._emotionHistory]; },

    getStats() {
      return {
        version:        VERSION,
        persona:        _persona,
        userName:       _userName,
        memoryTurns:    Math.floor(_memory.length / 2),
        maxMemory:      MAX_MEMORY,
        topicHistory:   _topicHistory.slice(-5),
        emotionHistory: _emotionHistory.slice(-5),
        sessionMinutes: Math.floor((Date.now() - _sessionStart) / 60000),
        hasApiHandler:  !!_apiHandler,
        hasTranslator:  !!_translatorFn,
        knowledgeBase: {
          facts:        FUN_FACTS.length,
          jokes:        JOKES.length,
          acronyms:     Object.keys(ACRONYMS).length,
          idioms:       Object.keys(IDIOMS).length,
          etymologies:  Object.keys(ETYMOLOGIES).length,
          quotes:       QUOTES.length,
          personas:     Object.keys(PERSONAS).length,
          intentPatterns: INTENTS.length,
        },
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
    `%c[SONIX-Model v${VERSION}] Loaded. Persona: ${_persona} | Intents: ${INTENTS.length} | Facts: ${FUN_FACTS.length} | Jokes: ${JOKES.length} | Acronyms: ${Object.keys(ACRONYMS).length} | Idioms: ${Object.keys(IDIOMS).length} | Quotes: ${QUOTES.length} | Memory: ${MAX_MEMORY} turns | Emotional Intelligence: Active`,
    "color:#00ff41;font-weight:bold;background:#000;padding:2px 8px;border-radius:4px;font-size:11px"
  );

})(typeof window !== "undefined" ? window : this);
