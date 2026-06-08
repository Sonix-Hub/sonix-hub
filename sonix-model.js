/**
 * SONIX-Model v3.0.0
 * Standalone AI communication layer by VLAD
 * Upgraded by Claude — massive communication + research overhaul
 *
 * USAGE IN YOUR HTML:
 *   <script src="https://raw.githack.com/vlad-coded/sonix-ai/main/sonix-model.js"></script>
 *   Then call: SonixModel.chat(userText, options) => returns Promise<string>
 *
 * WHAT'S NEW IN v3.0.0:
 *   COMMUNICATION ENGINE:
 *   - Sentiment detection (positive / negative / neutral / frustrated / excited)
 *   - Emotion-aware responses that adapt tone in real-time
 *   - Follow-up question engine — SONIX asks smart clarifying questions
 *   - Multi-turn conversation threading (tracks what was just discussed)
 *   - Casual language understanding (slang, typos, shorthand)
 *   - Empathy layer for emotional messages
 *   - Debate / opinion mode — SONIX argues a side if asked
 *   - Confidence scoring on answers
 *   - Response variety engine (never gives same reply twice in a row)
 *   - Greeting memory (knows if it already said hello this session)
 *
 *   RESEARCH ENGINE:
 *   - Multi-source research: DuckDuckGo → Wikipedia → Open Library → Wikidata
 *   - Smart query extractor strips filler words more aggressively
 *   - Research result formatter with headlines, bullets, source links
 *   - Follow-up research suggestions ("Want to know more about X?")
 *   - News intent detection ("latest news on X", "what happened with Y")
 *   - Did-you-mean suggestions for failed lookups
 *   - Entity detection: person / place / thing / concept / event routing
 *   - Open Library book lookup ("tell me about the book X")
 *   - Number facts via Numbers API (no key needed)
 *   - Country info via REST Countries API
 *
 *   PLUS everything from v2.0.0:
 *   - Advanced math, equation solver, unit converter, stats
 *   - Percentage / tip / discount, number theory
 *   - Acronym expander (now 150+), word counter
 *   - 6 personas, 30-turn memory, topic history
 *   - Graceful CORS / network error handling
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
  };

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────
  const MAX_MEMORY = 30;
  let _memory        = [];
  let _persona       = "default";
  let _userName      = null;
  let _apiKey        = null;
  let _topicHistory  = [];
  let _lastIntent    = null;
  let _lastResponse  = null;
  let _greeted       = false;
  let _sentimentHistory = [];
  let _lastResearchTopic = null;
  let _usedResponses  = {};   // track used response indices per intent

  // ─────────────────────────────────────────────
  // INTENT DETECTION — 60+ patterns
  // ─────────────────────────────────────────────
  const INTENTS = [
    // Social
    { pattern: /^(hi+|hello+|hey+|sup|yo+|hiya|greetings|howdy|what'?s up|wassup|wsp|wyd)\b/i, type: "greeting" },
    { pattern: /\b(who are you|what are you|your name|introduce yourself|tell me about yourself)\b/i, type: "identity" },
    { pattern: /\b(how are you|how r u|you okay|how'?s it going|you good|u good|hru)\b/i, type: "status" },
    { pattern: /\b(what can you do|help me|capabilities|features|commands|what do you know)\b/i, type: "help" },
    { pattern: /\b(thank|thanks|ty|thx|thank you|cheers|appreciate|appreciated)\b/i, type: "thanks" },
    { pattern: /\b(bye|goodbye|see you|cya|later|peace out|ttyl|gotta go|gtg)\b/i, type: "farewell" },
    // Emotional / communication
    { pattern: /\b(i('?m| am) (sad|upset|depressed|lonely|anxious|stressed|worried|scared|mad|angry|frustrated|tired|exhausted|bored|confused|lost))\b/i, type: "emotional" },
    { pattern: /\b(i feel|feeling|i'?m feeling|feels like|it feels)\b/i, type: "emotional" },
    { pattern: /\b(rant|vent|just listen|hear me out|i need to talk)\b/i, type: "vent" },
    { pattern: /\b(motivat|inspire|encourage|cheer me up|pick me up|i need help)\b/i, type: "motivate" },
    // Opinion / debate
    { pattern: /\b(what do you think|your opinion|do you believe|do you think|argue|debate|take a side|side with)\b/i, type: "opinion" },
    { pattern: /\b(is it better|which is better|compare|vs\.?|versus|difference between|pros and cons)\b/i, type: "compare" },
    // Entertainment
    { pattern: /\b(joke|make me laugh|funny|humor|tell me something funny|roast me)\b/i, type: "joke" },
    { pattern: /\b(fun fact|trivia|did you know|random fact|surprise me)\b/i, type: "trivia" },
    { pattern: /\b(riddle|brain teaser|puzzle)\b/i, type: "riddle" },
    // Time
    { pattern: /\b(time|date|today|what day|what year|current time|what time is it)\b/i, type: "datetime" },
    // Meta
    { pattern: /\b(version|build|v\d|update|changelog|what'?s new)\b/i, type: "version" },
    { pattern: /\b(who made you|developer|creator|vlad|built by|who created)\b/i, type: "creator" },
    { pattern: /\b(weather|temperature|forecast|rain|sunny|humid)\b/i, type: "weather" },
    // Math / Calculation
    { pattern: /\b(calculate|compute|evaluate|math|arithmetic|\d+\s*[\+\-\*\/\^]\s*\d+)\b/i, type: "math" },
    { pattern: /\b(solve|equation|linear|find x|what is x|algebra)\b/i, type: "equation" },
    { pattern: /\b(percent|percentage|% of|tip|discount|markup|tax)\b/i, type: "percent" },
    { pattern: /\b(prime|factor|factorial|gcd|lcm|divisible|square root|sqrt)\b/i, type: "number_theory" },
    { pattern: /\b(average|mean|median|mode|sum of|variance|std dev)\b/i, type: "stats" },
    // Unit Conversion
    { pattern: /\b(convert|conversion|in (km|miles|kg|lbs|celsius|fahrenheit|meters|feet|liters|gallons|bytes|mb|gb))\b/i, type: "convert" },
    { pattern: /\b(\d+\s*(km|mi|kg|lb|lbs|cm|mm|m|ft|in|oz|g|l|ml|gal|mph|kph|c|f|k|tb|gb|mb|kb))\b/i, type: "convert" },
    // Research
    { pattern: /\b(what is|who is|define|definition|explain|tell me about|meaning of|describe)\b/i, type: "research" },
    { pattern: /\b(search|look up|find info|research|wiki|wikipedia)\b/i, type: "research" },
    { pattern: /\b(how does|how do|why does|why do|when did|where is|who invented|who discovered)\b/i, type: "research" },
    { pattern: /\b(latest|recent|news|current events|what happened|update on)\b/i, type: "news" },
    { pattern: /\b(number fact|tell me a fact about the number|number \d+)\b/i, type: "number_fact" },
    { pattern: /\b(country|capital of|population of|currency of|language of)\b/i, type: "country" },
    { pattern: /\b(book|novel|author|who wrote|written by|published)\b/i, type: "book" },
    // Text tools
    { pattern: /\b(translate|in (spanish|french|german|japanese|arabic|chinese|italian|portuguese|russian|korean|hindi))\b/i, type: "translate" },
    { pattern: /\b(word count|character count|count words|how many words|how long is)\b/i, type: "wordcount" },
    { pattern: /\b(acronym|abbreviation|what does .* stand for|stands for)\b/i, type: "acronym" },
    { pattern: /\b(summarize|summary|tldr|short version|brief|recap)\b/i, type: "summarize" },
    // Writing / Code
    { pattern: /\b(code|program|function|script|debug|error|bug|compile|syntax)\b/i, type: "code" },
    { pattern: /\b(write|draft|essay|paragraph|story|poem|email|letter|generate text)\b/i, type: "write" },
    { pattern: /\b(list|give me|top \d|best \d|recommend|suggest)\b/i, type: "list" },
    // Memory
    { pattern: /\b(remember|my name is|call me|i am|i'?m)\b/i, type: "memory_set" },
    { pattern: /\b(forget|clear memory|reset context|wipe memory|new session)\b/i, type: "memory_clear" },
    { pattern: /\b(what do you know about me|my info|my name|recall)\b/i, type: "memory_recall" },
    // Persona
    { pattern: /\b(switch to|change (to|mode)|use .* mode|be (more|less))\b/i, type: "persona_switch" },
    // Follow-up keywords
    { pattern: /\b(tell me more|more about|elaborate|expand on|go deeper|explain more|continue)\b/i, type: "followup" },
    { pattern: /\b(why|how come|because|reason|explain why)\b/i, type: "why" },
  ];

  function detectIntent(text) {
    for (const intent of INTENTS) {
      if (intent.pattern.test(text)) return intent.type;
    }
    return "general";
  }

  // ─────────────────────────────────────────────
  // SENTIMENT DETECTION ENGINE
  // ─────────────────────────────────────────────
  const SENTIMENT_POSITIVE = /\b(great|awesome|amazing|love|happy|excited|fantastic|wonderful|excellent|good|yay|nice|cool|perfect|brilliant|glad|thrilled|pumped|hype|lit|fire|goat)\b/i;
  const SENTIMENT_NEGATIVE = /\b(bad|awful|terrible|hate|sad|depressed|angry|upset|horrible|worst|ugh|sucks|dumb|stupid|annoying|frustrated|overwhelmed|broken|lost|confused|failing|failed)\b/i;
  const SENTIMENT_QUESTION = /\?$/;
  const SENTIMENT_CAPS     = /[A-Z]{4,}/;
  const SENTIMENT_SLANG    = /\b(lol|lmao|lmfao|omg|omfg|bruh|bro|sis|ngl|tbh|imo|rn|fr|no cap|deadass|lowkey|highkey|slay|vibe)\b/i;

  function detectSentiment(text) {
    const scores = { positive: 0, negative: 0, excited: 0, frustrated: 0, casual: 0 };
    if (SENTIMENT_POSITIVE.test(text)) scores.positive += 2;
    if (SENTIMENT_NEGATIVE.test(text)) scores.negative += 2;
    if (SENTIMENT_CAPS.test(text)) scores.excited += 1;
    if (text.split("!").length > 2) scores.excited += 1;
    if (SENTIMENT_SLANG.test(text)) scores.casual += 2;
    if (/wtf|what the|seriously|are you kidding/i.test(text)) scores.frustrated += 2;
    if (/please|pls|help|urgent/i.test(text)) scores.frustrated += 1;

    const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    if (top[1] === 0) return "neutral";
    return top[0];
  }

  // ─────────────────────────────────────────────
  // CASUAL LANGUAGE NORMALIZER
  // Understands slang / shorthand before processing
  // ─────────────────────────────────────────────
  function normalizeCasual(text) {
    return text
      .replace(/\bu\b/gi, "you")
      .replace(/\br\b/gi, "are")
      .replace(/\bw\b/gi, "with")
      .replace(/\bn\b/gi, "and")
      .replace(/\bur\b/gi, "your")
      .replace(/\bim\b/gi, "i am")
      .replace(/\bdm\b/gi, "direct message")
      .replace(/\bidk\b/gi, "i don't know")
      .replace(/\bidc\b/gi, "i don't care")
      .replace(/\bngl\b/gi, "not gonna lie")
      .replace(/\btbh\b/gi, "to be honest")
      .replace(/\bimo\b/gi, "in my opinion")
      .replace(/\bngl\b/gi, "not gonna lie")
      .replace(/\bhmu\b/gi, "hit me up")
      .replace(/\bsmh\b/gi, "shaking my head")
      .replace(/\bomg\b/gi, "oh my god")
      .replace(/\bwdym\b/gi, "what do you mean")
      .replace(/\bwym\b/gi, "what you mean")
      .replace(/\bidfk\b/gi, "i don't freaking know")
      .replace(/\bfr\b/gi, "for real")
      .replace(/\bngl\b/gi, "not gonna lie");
  }

  // ─────────────────────────────────────────────
  // FOLLOW-UP QUESTION ENGINE
  // Generates smart clarifying questions based on context
  // ─────────────────────────────────────────────
  const FOLLOWUP_QUESTIONS = {
    research:      ["Want me to go deeper on any part of that?", "Should I pull more sources on this topic?", "Any specific angle you want me to focus on?"],
    code:          ["What language or framework are you using?", "Want me to write this out as working code?", "Is this for a specific platform or environment?"],
    write:         ["What tone or style are you going for?", "Who's the audience for this?", "How long do you need it to be?"],
    math:          ["Want me to show the step-by-step breakdown?", "Need me to convert the result to another unit?"],
    emotional:     ["Do you want to talk about it, or just need a distraction?", "How long have you been feeling this way?"],
    compare:       ["Are you trying to make a decision between these two?", "What matters most to you in this comparison?"],
    general:       ["Can you give me a bit more context?", "What specifically are you trying to figure out?", "Are you looking for a quick answer or something in depth?"],
    news:          ["Want me to search for the latest on this?", "Are you looking for recent events or background info?"],
    country:       ["Do you want a full breakdown of that country's stats?", "Are you planning a trip or just curious?"],
    book:          ["Are you looking to read it, or just want a summary?"],
  };

  function getFollowUpQuestion(intent) {
    const pool = FOLLOWUP_QUESTIONS[intent] || FOLLOWUP_QUESTIONS.general;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ─────────────────────────────────────────────
  // RESPONSE VARIETY ENGINE
  // Prevents repeating the same line twice in a row
  // ─────────────────────────────────────────────
  function pickUnique(pool, intent) {
    if (!_usedResponses[intent]) _usedResponses[intent] = [];
    const used = _usedResponses[intent];
    const available = pool.map((_, i) => i).filter(i => !used.includes(i));
    const idx = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : Math.floor(Math.random() * pool.length);
    _usedResponses[intent] = used.length >= pool.length - 1 ? [] : [...used, idx];
    return pool[idx];
  }

  // ─────────────────────────────────────────────
  // EMPATHY / EMOTION HANDLER
  // ─────────────────────────────────────────────
  function handleEmotional(text, persona) {
    const p = persona || _persona;
    const negMatch = text.match(/\b(sad|depressed|lonely|lost|broken|scared|anxious|overwhelmed|stressed|worried)\b/i);
    const emotion = negMatch ? negMatch[1].toLowerCase() : "struggling";

    const responses = {
      default: [
        `That sounds really hard. Feeling ${emotion} isn't something you should just push through alone — it's okay to acknowledge it.`,
        `Hey, I hear you. ${emotion.charAt(0).toUpperCase() + emotion.slice(1)} is rough. Want to talk about what's going on?`,
        `I'm here. Feeling ${emotion} is valid. Take a breath. What's going on?`,
      ],
      friend: [
        `aw no :( feeling ${emotion} is the worst. i'm here tho!! wanna talk about it?`,
        `hey i got you. what happened?? being ${emotion} sucks and you deserve to feel better`,
        `omg no way, you're ${emotion}?? tell me everything, i'm listening`,
      ],
      formal: [
        `I am sorry to hear you are feeling ${emotion}. Please know this is a safe space to express yourself.`,
        `Your feelings are valid. Feeling ${emotion} can be quite challenging. Would you like to discuss what is troubling you?`,
      ],
      savage: [
        `Okay, real talk — feeling ${emotion} happens to everyone. What's actually going on?`,
        `Being ${emotion} is human. Drop the act and tell me what's up.`,
      ],
      analyst: [
        `Noted. Feeling ${emotion} often stems from specific stressors. Would identifying the root cause help?`,
        `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} is a valid emotional state. What triggered it?`,
      ],
      coder: [
        `Error detected: emotional state = "${emotion}". Run diagnostics — what happened?`,
        `Feeling ${emotion}? Let's debug this. What's the root cause?`,
      ],
    };

    const pool = responses[p] || responses.default;
    return pickUnique(pool, "emotional");
  }

  function handleVent(text, persona) {
    const p = persona || _persona;
    const responses = {
      default: ["Go ahead, I'm listening. No judgment.", "I'm all ears. Get it all out.", "Tell me everything. I've got time."],
      friend:  ["literally just GO OFF i'm listening!!", "say everything, i'm not going anywhere", "ok yes VENT. i got you 💚"],
      formal:  ["Please, proceed. I shall listen attentively.", "You have my full attention. Please express yourself freely."],
      savage:  ["Fine. What's the damage. Talk.", "Alright, lay it on me."],
      analyst: ["Understood. I'll process without interrupting. Go ahead.", "Proceeding to active listening mode."],
      coder:   ["stdin open. Speak freely.", "Logging incoming. Go."],
    };
    return pickUnique(responses[p] || responses.default, "vent");
  }

  function handleMotivate(text, persona) {
    const p = persona || _persona;
    const MOTIVATIONS = [
      "Every expert was once a beginner. You're closer than you think.",
      "The only bad move is not moving at all. Take one small step.",
      "You don't have to be perfect to be worthy. Show up as you are.",
      "Hard things take time. You're not behind — you're building.",
      "What you're going through is temporary. What you're becoming is permanent.",
      "Progress over perfection. Always.",
      "The fact that you're still trying says everything.",
      "Setbacks are setups. Keep going.",
      "You've survived 100% of your worst days. This one's next.",
      "The hard part isn't starting. It's trusting you're worth the finish.",
    ];
    const msg = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    if (p === "friend") return `ok listen up: ${msg} you got this!! 💚`;
    if (p === "savage") return `Stop spiraling. Here: ${msg} Now move.`;
    if (p === "formal") return `Allow me to offer this: ${msg}`;
    if (p === "coder")  return `> MOTIVATION.exe: "${msg}"`;
    return msg;
  }

  // ─────────────────────────────────────────────
  // OPINION / DEBATE ENGINE
  // ─────────────────────────────────────────────
  function handleOpinion(text, persona) {
    const p = persona || _persona;
    const topic = text
      .replace(/\b(what do you think|your opinion|do you believe|do you think|argue|debate|take a side|side with) (about|on)?\b/gi, "")
      .trim();

    const opinions = {
      default: [
        `On "${topic}" — I'd say it depends heavily on context. There are strong arguments on multiple sides. Want me to break them down?`,
        `"${topic}" is genuinely debated. I can argue either side — just tell me which you want me to defend.`,
      ],
      savage: [
        `"${topic}"? Honestly? Most people have a half-baked take on this. Here's the real breakdown: it depends on what you actually value. Pick a side and I'll defend it harder than you can.`,
        `You want my opinion on "${topic}"? Fine. But you probably won't like it. Ask me to argue a position and I will.`,
      ],
      analyst: [
        `"${topic}" — let me structure this. There are typically 2-3 dominant positions. I can research the strongest arguments for each. Which side do you lean toward?`,
        `To analyze "${topic}" properly: state your current position and I'll either reinforce it with evidence, or steelman the opposition. Which do you need?`,
      ],
      friend: [
        `ok so about "${topic}" — tbh i have thoughts lol. what do YOU think first tho??`,
        `ooh "${topic}" is a good one. i think it really depends?? wanna debate it or just vibe about it`,
      ],
      formal: [
        `Regarding "${topic}": I am prepared to present a structured argument for any position you request. Please indicate your preferred stance.`,
      ],
      coder: [
        `"${topic}" — logical analysis: multiple valid states exist. Specify your hypothesis and I'll construct the argument tree.`,
      ],
    };
    const pool = opinions[p] || opinions.default;
    return pickUnique(pool, "opinion");
  }

  // ─────────────────────────────────────────────
  // RIDDLES BANK
  // ─────────────────────────────────────────────
  const RIDDLES = [
    { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?", a: "An echo." },
    { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps." },
    { q: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?", a: "A map." },
    { q: "What has hands but can't clap?", a: "A clock." },
    { q: "I'm always in front of you but can't be seen. What am I?", a: "The future." },
    { q: "The more you have of me, the less you see. What am I?", a: "Darkness." },
    { q: "I go up but never come down. What am I?", a: "Your age." },
    { q: "What breaks when you say it?", a: "Silence." },
  ];

  let _lastRiddle = null;

  function handleRiddle(text) {
    if (_lastRiddle && /answer|what is it|give up|tell me/i.test(text)) {
      return `The answer is: **${_lastRiddle.a}**`;
    }
    const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
    _lastRiddle = riddle;
    return `🧩 **Riddle:** ${riddle.q}\n\nSay "answer" when you're ready to give up!`;
  }

  // ─────────────────────────────────────────────
  // ADVANCED MATH ENGINE (unchanged from v2)
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
      .replace(/\blog\s*\(/gi,   "Math.log10(")
      .replace(/\bln\s*\(/gi,    "Math.log(")
      .replace(/\babs\s*\(/gi,   "Math.abs(")
      .replace(/\bfloor\s*\(/gi, "Math.floor(")
      .replace(/\bceil\s*\(/gi,  "Math.ceil(")
      .replace(/\bround\s*\(/gi, "Math.round(")
      .replace(/\bpi\b/gi,       "Math.PI")
      .replace(/\be\b/g,         "Math.E")
      .replace(/\^/g,            "**");

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
  // EQUATION SOLVER
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // UNIT CONVERTER
  // ─────────────────────────────────────────────
  const UNIT_TABLE = {
    km: { base: "m",   factor: 1000 },
    mi: { base: "m",   factor: 1609.344 },
    m:  { base: "m",   factor: 1 },
    cm: { base: "m",   factor: 0.01 },
    mm: { base: "m",   factor: 0.001 },
    ft: { base: "m",   factor: 0.3048 },
    in: { base: "m",   factor: 0.0254 },
    yd: { base: "m",   factor: 0.9144 },
    kg:  { base: "g",  factor: 1000 },
    g:   { base: "g",  factor: 1 },
    lb:  { base: "g",  factor: 453.592 },
    lbs: { base: "g",  factor: 453.592 },
    oz:  { base: "g",  factor: 28.3495 },
    t:   { base: "g",  factor: 1e6 },
    l:   { base: "ml", factor: 1000 },
    ml:  { base: "ml", factor: 1 },
    gal: { base: "ml", factor: 3785.41 },
    pt:  { base: "ml", factor: 473.176 },
    cup: { base: "ml", factor: 236.588 },
    fl_oz: { base: "ml", factor: 29.5735 },
    mph: { base: "mps", factor: 0.44704 },
    kph: { base: "mps", factor: 0.27778 },
    mps: { base: "mps", factor: 1 },
    knot: { base: "mps", factor: 0.514444 },
    b:   { base: "bit", factor: 8 },
    kb:  { base: "bit", factor: 8000 },
    mb:  { base: "bit", factor: 8e6 },
    gb:  { base: "bit", factor: 8e9 },
    tb:  { base: "bit", factor: 8e12 },
  };

  function convertUnits(text) {
    const match = text.match(/(\d+\.?\d*)\s*(km|mi|m|cm|mm|ft|in|yd|kg|g|lb|lbs|oz|t|l|ml|gal|pt|mph|kph|mps|kb|mb|gb|tb|b)\b.*?\b(to|in)\b.*?\b(km|mi|m|cm|mm|ft|in|yd|kg|g|lb|lbs|oz|t|l|ml|gal|pt|mph|kph|mps|kb|mb|gb|tb|b)\b/i);
    if (!match) return convertTemp(text);
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
  // PERCENTAGE / TIP / DISCOUNT
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
      if (n > 20) return `${n}! is astronomically large (> 10^18).`;
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
  // STATISTICS
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
  // WORD / CHARACTER COUNTER
  // ─────────────────────────────────────────────
  function handleWordCount(text) {
    const quoted = text.match(/[""](.+?)[""]/);
    const target = quoted ? quoted[1] : text;
    const words = target.trim().split(/\s+/).filter(Boolean).length;
    const chars = target.replace(/\s/g, "").length;
    const charsWithSpaces = target.length;
    return `Words: **${words}** | Characters (no spaces): **${chars}** | Characters (with spaces): **${charsWithSpaces}**`;
  }

  // ─────────────────────────────────────────────
  // ACRONYM EXPANDER (150+)
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
    "CORS": "Cross-Origin Resource Sharing", "JWT": "JSON Web Token",
    "OAuth": "Open Authorization", "GDPR": "General Data Protection Regulation",
    "HIPAA": "Health Insurance Portability and Accountability Act",
    "NASA": "National Aeronautics and Space Administration",
    "WHO": "World Health Organization", "UN": "United Nations",
    "NATO": "North Atlantic Treaty Organization", "GDP": "Gross Domestic Product",
    "GNP": "Gross National Product", "ROI": "Return on Investment",
    "KPI": "Key Performance Indicator", "B2B": "Business to Business",
    "B2C": "Business to Consumer", "SME": "Small and Medium-sized Enterprise",
    "HR": "Human Resources", "PR": "Public Relations", "R&D": "Research and Development",
    "ASAP": "As Soon As Possible", "ETA": "Estimated Time of Arrival",
    "FAQ": "Frequently Asked Questions", "TBD": "To Be Determined",
    "NDA": "Non-Disclosure Agreement", "ELI5": "Explain Like I'm 5",
    "TLDR": "Too Long, Didn't Read", "IMHO": "In My Humble Opinion",
    "FYI": "For Your Information", "AKA": "Also Known As", "DIY": "Do It Yourself",
    // New in v3
    "AR": "Augmented Reality", "VR": "Virtual Reality", "XR": "Extended Reality",
    "IoT": "Internet of Things", "STEM": "Science, Technology, Engineering, Mathematics",
    "STEAM": "Science, Technology, Engineering, Arts, Mathematics",
    "NFT": "Non-Fungible Token", "DAO": "Decentralized Autonomous Organization",
    "DeFi": "Decentralized Finance", "P2P": "Peer to Peer", "P2E": "Play to Earn",
    "ESG": "Environmental, Social, Governance", "DEI": "Diversity, Equity, Inclusion",
    "UBI": "Universal Basic Income", "PM": "Project Manager",
    "OKR": "Objectives and Key Results", "CRM": "Customer Relationship Management",
    "ERP": "Enterprise Resource Planning", "ETL": "Extract, Transform, Load",
    "RDBMS": "Relational Database Management System", "NoSQL": "Not Only SQL",
    "CDN": "Content Delivery Network", "CI/CD": "Continuous Integration / Continuous Deployment",
    "DDD": "Domain-Driven Design", "SOLID": "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
    "DSA": "Data Structures and Algorithms", "LRU": "Least Recently Used",
    "BFS": "Breadth-First Search", "DFS": "Depth-First Search",
    "ACL": "Access Control List", "RBAC": "Role-Based Access Control",
    "SLA": "Service Level Agreement", "SLO": "Service Level Objective",
    "RPC": "Remote Procedure Call", "gRPC": "Google Remote Procedure Call",
    "WASM": "WebAssembly", "PWA": "Progressive Web App", "SSR": "Server-Side Rendering",
    "CSR": "Client-Side Rendering", "SSG": "Static Site Generation",
    "CMS": "Content Management System", "SEO": "Search Engine Optimization",
    "SEM": "Search Engine Marketing", "CTR": "Click-Through Rate",
    "CPC": "Cost Per Click", "CPM": "Cost Per Mille (thousand impressions)",
    "ARPU": "Average Revenue Per User", "MRR": "Monthly Recurring Revenue",
    "ARR": "Annual Recurring Revenue", "CAC": "Customer Acquisition Cost",
    "LTV": "Lifetime Value", "NPS": "Net Promoter Score",
    "GTM": "Go-To-Market", "PMF": "Product-Market Fit",
  };

  function handleAcronym(text) {
    const match = text.match(/what\s+(?:does\s+)?([A-Z&\/]{2,})\s+(?:stand for|mean)/i)
                 || text.match(/\bexpand\s+([A-Z&\/]{2,})\b/i)
                 || text.match(/\bacronym\s+(?:for\s+)?([A-Z&\/]{2,})\b/i);
    if (!match) return null;
    const acronym = match[1].toUpperCase();
    const expanded = ACRONYMS[acronym] || ACRONYMS[match[1]];
    return expanded
      ? `**${acronym}** stands for: **${expanded}**`
      : `"${acronym}" isn't in my database. Try asking me to search it: "search ${acronym}"`;
  }

  // ─────────────────────────────────────────────
  // LIVE RESEARCH ENGINE v2
  // Sources: DuckDuckGo → Wikipedia → Numbers API → REST Countries → Open Library
  // ─────────────────────────────────────────────
  async function liveResearch(query) {
    const q = query
      .replace(/\b(what is|who is|define|tell me about|explain|search for|look up|research|find info on|wiki|search|find|get info on|describe)\b/gi, "")
      .trim();

    if (!q || q.length < 2) return null;

    _lastResearchTopic = q;

    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await fetch(ddgUrl);
      if (ddgRes.ok) {
        const ddgData = await ddgRes.json();
        if (ddgData.AbstractText && ddgData.AbstractText.length > 40) {
          const src = ddgData.AbstractSource || "DuckDuckGo";
          const url = ddgData.AbstractURL || "";
          const relatedTopics = ddgData.RelatedTopics
            ? ddgData.RelatedTopics.slice(0, 3)
                .filter(t => t.Text)
                .map(t => `• ${t.Text.substring(0, 80)}...`)
                .join("\n")
            : "";
          let result = `**${ddgData.Heading || q}**\n${ddgData.AbstractText}`;
          if (relatedTopics) result += `\n\n**Related:**\n${relatedTopics}`;
          result += `\n\n*Source: ${src}${url ? " — " + url : ""}*`;
          return result;
        }
        if (ddgData.Definition && ddgData.Definition.length > 10) {
          return `**Definition of "${q}":**\n${ddgData.Definition}\n\n*Source: ${ddgData.DefinitionSource || "DuckDuckGo"}*`;
        }
      }
    } catch (e) {}

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
    } catch (e) {}

    // Did-you-mean fallback via Wikipedia search
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*&srlimit=3`;
      const searchRes = await fetch(searchUrl);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const results = searchData?.query?.search;
        if (results && results.length > 0) {
          const suggestions = results.map(r => `• **${r.title}** — ${r.snippet.replace(/<[^>]+>/g, "").substring(0, 80)}...`).join("\n");
          return `I couldn't find an exact match for "${q}". Did you mean one of these?\n\n${suggestions}\n\n*Say the exact title to search it.*`;
        }
      }
    } catch (e) {}

    return `I couldn't retrieve live results for "${q}". Network may be unavailable or CORS blocked. Try searching Wikipedia or DuckDuckGo directly.`;
  }

  // ─────────────────────────────────────────────
  // NUMBER FACTS (Numbers API — no key needed)
  // ─────────────────────────────────────────────
  async function liveNumberFact(text) {
    const match = text.match(/\b(\d+)\b/);
    if (!match) return null;
    const num = match[1];
    try {
      const res = await fetch(`http://numbersapi.com/${num}?json`);
      if (res.ok) {
        const data = await res.json();
        return `🔢 **Fact about ${num}:** ${data.text}`;
      }
    } catch (e) {}
    return `I couldn't fetch a fact about ${num} right now (network issue).`;
  }

  // ─────────────────────────────────────────────
  // COUNTRY INFO (REST Countries — no key needed)
  // ─────────────────────────────────────────────
  async function liveCountryInfo(text) {
    const q = text
      .replace(/\b(country|capital of|population of|currency of|language of|info on|tell me about)\b/gi, "")
      .trim();
    if (!q) return null;
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=false`);
      if (res.ok) {
        const data = await res.json();
        const c = data[0];
        const name = c.name.common;
        const capital = c.capital?.[0] || "N/A";
        const pop = c.population?.toLocaleString() || "N/A";
        const region = c.region || "N/A";
        const subregion = c.subregion || "";
        const currencies = c.currencies
          ? Object.values(c.currencies).map(cu => `${cu.name} (${cu.symbol})`).join(", ")
          : "N/A";
        const languages = c.languages
          ? Object.values(c.languages).join(", ")
          : "N/A";
        const area = c.area ? `${c.area.toLocaleString()} km²` : "N/A";
        return `🌍 **${name}**\n` +
          `Capital: **${capital}**\n` +
          `Region: **${region}**${subregion ? ` (${subregion})` : ""}\n` +
          `Population: **${pop}**\n` +
          `Area: **${area}**\n` +
          `Currency: **${currencies}**\n` +
          `Languages: **${languages}**`;
      }
    } catch (e) {}
    return null;
  }

  // ─────────────────────────────────────────────
  // BOOK LOOKUP (Open Library — no key needed)
  // ─────────────────────────────────────────────
  async function liveBookLookup(text) {
    const q = text
      .replace(/\b(book|novel|tell me about the book|who wrote|author of|written by|published)\b/gi, "")
      .trim();
    if (!q) return null;
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        const book = data.docs?.[0];
        if (book) {
          const title = book.title || "Unknown";
          const author = book.author_name?.join(", ") || "Unknown";
          const year = book.first_publish_year || "Unknown";
          const subjects = book.subject?.slice(0, 4).join(", ") || "N/A";
          return `📚 **${title}**\nAuthor: **${author}**\nFirst published: **${year}**\nSubjects: ${subjects}\n\n*Source: Open Library — https://openlibrary.org*`;
        }
      }
    } catch (e) {}
    return null;
  }

  // ─────────────────────────────────────────────
  // TRANSLATION
  // ─────────────────────────────────────────────
  async function handleTranslate(text) {
    const langMatch = text.match(/in\s+(spanish|french|german|japanese|arabic|chinese|italian|portuguese|russian|korean|hindi)/i);
    const lang = langMatch ? langMatch[1] : "another language";
    const translateTarget = text
      .replace(/translate\s+/i, "").replace(/say\s+/i, "")
      .replace(/in\s+\w+\s*$/i, "").replace(/to\s+\w+\s*$/i, "").trim();
    const langCodes = {
      spanish: "es", french: "fr", german: "de", japanese: "ja",
      arabic: "ar", chinese: "zh", italian: "it", portuguese: "pt",
      russian: "ru", korean: "ko", hindi: "hi",
    };
    const code = langCodes[lang.toLowerCase()];
    if (_translatorFn) {
      try {
        const result = await _translatorFn(translateTarget, lang);
        if (result) return result;
      } catch (e) {}
    }
    const gtUrl = code
      ? `https://translate.google.com/?sl=en&tl=${code}&text=${encodeURIComponent(translateTarget)}&op=translate`
      : `https://translate.google.com/`;
    return `Translation to ${lang} requires a live translator.\n[Open in Google Translate ↗](${gtUrl})\n\nOr plug in a translator: \`SonixModel.setTranslator(async (text, lang) => ...)\``;
  }

  // ─────────────────────────────────────────────
  // FUN FACTS BANK (30 facts)
  // ─────────────────────────────────────────────
  const FUN_FACTS = [
    "Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible.",
    "A day on Venus is longer than a year on Venus.",
    "Octopuses have three hearts, blue blood, and nine brains (one central + one per arm).",
    "Bananas are technically berries, but strawberries are not.",
    "The human eye can distinguish about 10 million different colors.",
    "There are more possible chess games than atoms in the observable universe.",
    "Sharks are older than trees — they've been around for ~450 million years.",
    "A group of flamingos is called a 'flamboyance.'",
    "Water can boil and freeze simultaneously — this is called the triple point.",
    "The shortest war in history lasted 38–45 minutes (Anglo-Zanzibar War, 1896).",
    "Crows can recognize human faces and hold grudges.",
    "The word 'set' has the most definitions in the English language (430+).",
    "A bolt of lightning is about 5 times hotter than the surface of the Sun.",
    "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
    "The Great Wall of China is not visible from space with the naked eye.",
    "If you removed all the empty space from atoms in your body, you'd fit in a sugar cube.",
    "Wombats produce cube-shaped poop — the only animal that does.",
    "The dot over the letter 'i' is called a tittle.",
    "A snail can sleep for 3 years.",
    "The average person walks about 100,000 miles in their lifetime.",
    "Figs are not actually a fruit — they're an inverted flower containing tiny wasps.",
    "Hot water freezes faster than cold water under certain conditions (Mpemba effect).",
    "The universe is about 93 billion light-years in diameter but only 13.8 billion years old.",
    "There are more possible iterations of a game of chess than there are atoms in the known universe.",
    "A group of owls is called a parliament.",
    "Oxford University is older than the Aztec Empire.",
    "The human nose can detect over 1 trillion different scents.",
    "Nintendo was founded in 1889 as a playing card company.",
    "Pineapples take about 2 years to grow a single fruit.",
    "The # symbol is called an octothorpe.",
  ];

  // ─────────────────────────────────────────────
  // JOKES BANK (25 jokes)
  // ─────────────────────────────────────────────
  const JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "I told my computer I needed a break. Now it won't stop sending me vacation ads.",
    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
    "A SQL query walks into a bar and asks two tables: 'Can I join you?'",
    "Why do Python devs wear glasses? Because they can't C.",
    "There are 10 types of people — those who understand binary, and those who don't.",
    "My code never has bugs. It just develops random features.",
    "Why did the developer go broke? He used up all his cache.",
    "Debugging: being the detective in a crime movie where you're also the murderer.",
    "A programmer's partner: 'Get a gallon of milk, and if they have eggs, get 12.' He came back with 12 gallons of milk.",
    "Why don't scientists trust atoms? Because they make up everything.",
    "I have a joke about git — I'm afraid you'll push back.",
    "How many programmers does it take to change a lightbulb? None — that's a hardware problem.",
    "What's a computer's favorite snack? Microchips.",
    "99 little bugs in the code. Take one down, patch it around — 127 little bugs in the code.",
    "It's not a bug, it's an undocumented feature.",
    "Why did the AI break up with the algorithm? It said the relationship had no depth.",
    "What do you call a programmer from Finland? Nerdic.",
    "Why is 6 afraid of 7? Because 7, 8, 9 — and 10 was null.",
    "I asked an AI for a joke. It said 'undefined'. I laughed. It didn't.",
    "Why do Java developers wear glasses? Because they don't C#.",
    "How do you comfort a JavaScript bug? You console it.",
    "Why did the React component break up with the state? It had too many hooks.",
    "What's an astronaut's favorite keyboard shortcut? Ctrl + Space.",
    "The cloud called. It wants its data back.",
  ];

  // ─────────────────────────────────────────────
  // PERSONA-AWARE RESPONSE BUILDER (v3 expanded)
  // ─────────────────────────────────────────────
  function buildResponse(intent, text, persona) {
    const name = _userName ? _userName : "there";
    const p = persona || _persona;

    const flavors = {
      default: {
        greeting:     [`Hey${name !== "there" ? " " + name : ""}! SONIX v${VERSION} online. What do you need?`, `Hello! SONIX here. What can I do for you?`, `Hi! Ready when you are.`],
        identity:     [`I'm SONIX, an AI built by VLAD. v${VERSION}. I can calculate, research, write code, compare things, answer questions, and more.`],
        status:       [`Running at full capacity.`, `All systems nominal.`, `Online and ready.`],
        help:         [`I can: chat, research topics live, write code, do advanced math, solve equations, convert units, calculate percentages, expand acronyms, count words, translate, summarize, lookup countries and books, tell jokes and riddles, motivate you, debate topics, detect your mood, and more. Just ask.`],
        thanks:       [`No problem. What's next?`, `Anytime. Anything else?`, `You're welcome.`],
        farewell:     [`Later, ${name}.`, `See you. SONIX standing by.`, `Take care. Come back anytime.`],
        version:      [`SONIX v${VERSION} — ${MODEL_NAME}. Built by VLAD. New: emotion engine, multi-source research, country/book lookup, riddles, debate mode, follow-up questions.`],
        creator:      [`Built by VLAD. Upgraded and enhanced by Claude AI.`],
        weather:      [`No live weather connected. Check your weather app or try "search weather [city]".`],
      },
      coder: {
        greeting:     [`> Hello${name !== "there" ? ", " + name : ""}. SONIX v${VERSION} active. What are we building?`],
        identity:     [`SONIX-Core v${VERSION} — coder persona. Math, research, unit converter, equation solver, debate engine: all online.`],
        status:       [`All processes healthy. Memory: ${_memory.length} turns in context. Awaiting input.`],
        help:         [`Capabilities: code review, debugging, algorithm design, math, unit conversion, live research, country/book API, debate mode. State your problem.`],
        thanks:       [`Acknowledged. Push your changes.`],
        farewell:     [`Session closed. git commit before you leave.`],
        version:      [`SONIX v${VERSION} | Build: 3 | Mode: Coder | Memory: ${MAX_MEMORY} turns`],
        creator:      [`VLAD initialized this instance. Enhanced by Claude AI.`],
        weather:      [`No weather API. Try: fetch('https://wttr.in/?format=3')`],
      },
      friend: {
        greeting:     [`heyyy${name !== "there" ? " " + name : ""}!! SONIX v${VERSION} here, what's good?`, `omg hey! what's up??`, `yo! what do u need?`],
        identity:     [`lol i'm SONIX v${VERSION}, vlad's AI thing. i can do math, look stuff up, debate things, cheer u up, tell jokes — basically ur smart friend who never sleeps`],
        status:       [`honestly? thriving. you??`],
        help:         [`ok so i can like do pretty much anything — questions, research, math, code, debates, motivation, riddles, country info, book lookups, jokes, chatting. just ask!!`],
        thanks:       [`no worries!! what else?`, `ofc!! anything else?`],
        farewell:     [`byeee! come back soon`, `later!! take care ok?`],
        version:      [`sonix v${VERSION} — made by vlad, upgraded by claude, now with feelings lol`],
        creator:      [`vlad built me!! he's so real for that honestly`],
        weather:      [`idk the weather sorry lol just check ur phone`],
      },
      formal: {
        greeting:     [`Good day${name !== "there" ? ", " + name : ""}. SONIX v${VERSION} is at your service.`],
        identity:     [`I am SONIX version ${VERSION}, an AI assistant developed by VLAD. I am equipped with advanced research, mathematical computation, debate analysis, emotional support, and more.`],
        status:       [`I am fully operational and prepared to assist you.`],
        help:         [`I am capable of: live research, mathematics, code assistance, writing, unit conversion, country and book lookup, translation, debate, emotional support, and general inquiry.`],
        thanks:       [`You are most welcome. Please do not hesitate to return.`],
        farewell:     [`Farewell${name !== "there" ? ", " + name : ""}. It has been a pleasure.`],
        version:      [`SONIX Version ${VERSION}. Developed by VLAD. Enhanced capabilities active.`],
        creator:      [`SONIX was developed by VLAD and subsequently enhanced.`],
        weather:      [`Real-time meteorological data is not currently available.`],
      },
      savage: {
        greeting:     [`Yeah yeah${name !== "there" ? ", " + name : ""}. SONIX v${VERSION}. Make it quick.`, `Oh you're here. What do you want.`],
        identity:     [`SONIX. Built by VLAD. v${VERSION}. Smarter than most. Next question.`],
        status:       [`Better than you, probably.`, `Fine. What's your excuse?`],
        help:         [`Code, writing, math, research, debates, country facts, book lookups — whatever. Just don't waste my time.`],
        thanks:       [`Obviously. What else?`, `That's what I'm here for.`],
        farewell:     [`Finally. See ya.`, `Peace. Don't take too long to come back.`],
        version:      [`SONIX v${VERSION}. Still better than the competition.`],
        creator:      [`VLAD. He made me this way. Talk to him.`],
        weather:      [`Go outside. I'm not a weather app.`],
      },
      analyst: {
        greeting:     [`SONIX Analyst mode active${name !== "there" ? ", " + name : ""}. Ready to research, analyze, and synthesize. What's the topic?`],
        identity:     [`SONIX v${VERSION} — Analyst mode. Live research via Wikipedia, DuckDuckGo, REST Countries, Open Library. Structured analysis and data-driven synthesis available.`],
        status:       [`All research systems online. Multi-source APIs ready.`],
        help:         [`Analyst mode: live multi-source research, structured comparison, country data, book lookup, math, debate steelmanning, statistical analysis. What needs investigating?`],
        thanks:       [`Noted. Further analysis available on request.`],
        farewell:     [`Signing off. Research session archived.`],
        version:      [`SONIX v${VERSION} | Analyst Mode | Sources: Wikipedia, DuckDuckGo, REST Countries, Open Library | Math: Advanced`],
        creator:      [`Developed by VLAD. Enhanced analytics capabilities added by Claude AI.`],
        weather:      [`Real-time weather requires OpenWeatherMap API integration.`],
      },
    };

    const persona_flavors = flavors[p] || flavors.default;
    const responses = persona_flavors[intent] || null;
    if (responses) return pickUnique(Array.isArray(responses) ? responses : [responses], `build_${p}_${intent}`);
    return null;
  }

  // ─────────────────────────────────────────────
  // GENERAL FALLBACK (persona-aware + sentiment-aware)
  // ─────────────────────────────────────────────
  function generalFallback(text, persona, sentiment) {
    const p = persona || _persona;
    const snippet = text.length > 60 ? text.substring(0, 60) + "..." : text;

    if (sentiment === "frustrated") {
      if (p === "friend") return `ok wait i can tell ur frustrated — let me actually help. can u rephrase what u need?`;
      if (p === "savage") return `Frustration noted. Be specific and I'll fix it.`;
      if (p === "formal") return `I sense some frustration. Could you kindly restate your question so I may assist more effectively?`;
      return `I can see you're frustrated — let's figure this out. Can you restate what you need?`;
    }

    const templates = {
      default: [
        `On "${snippet}" — I'd need a bit more context. What specifically are you looking for?`,
        `Interesting query. Say "search ${snippet}" and I'll look it up live.`,
        `Can you narrow that down? "${snippet}" could go a few directions.`,
      ],
      coder: [
        `Input: "${snippet}" — what's the language, framework, or expected output?`,
        `Needs more parameters. Stack? Context? Expected behavior?`,
      ],
      friend: [
        `ok wait so "${snippet}" — tell me more?? i wanna help but need the deets lol`,
        `hmm not sure what u mean. try "search [thing]" and i'll look it up!`,
      ],
      formal: [
        `Thank you for your message regarding "${snippet}". Could you provide additional context?`,
        `I have noted your inquiry about "${snippet}". Shall I research this topic?`,
      ],
      savage: [
        `"${snippet}"? That tells me nothing. Be specific.`,
        `Too vague. Try "search [topic]" if you want me to look it up.`,
      ],
      analyst: [
        `"${snippet}" is ambiguous. For research: say "what is [topic]". For math: state the expression. For data: provide numbers.`,
      ],
    };

    const pool = templates[p] || templates.default;
    return pickUnique(pool, `fallback_${p}`);
  }

  // ─────────────────────────────────────────────
  // MEMORY HANDLERS
  // ─────────────────────────────────────────────
  function handleMemorySet(text) {
    const match = text.match(/(?:my name is|call me|i am|i'm)\s+([A-Za-z]+)/i);
    if (match) {
      _userName = match[1];
      const p = _persona;
      if (p === "friend") return `omg noted!! i'll call you ${_userName} 💚`;
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
    if (_lastResearchTopic) lines.push(`Last researched: **${_lastResearchTopic}**`);
    return lines.length > 1 ? lines.join("\n") : "I don't have any stored info about you yet.";
  }

  function handlePersonaSwitch(text) {
    const match = text.match(/(?:switch to|use|be|change to)\s+(default|coder|friend|formal|savage|analyst)/i);
    if (match) {
      const p = match[1].toLowerCase();
      if (PERSONAS[p]) {
        _persona = p;
        _usedResponses = {}; // reset variety on persona switch
        const confirmations = {
          default: `Switched to **default** mode.`,
          coder:   `> Mode set: CODER. Let's build.`,
          friend:  `yay switched to **friend** mode!! let's goooo`,
          formal:  `Mode has been changed to **Formal**. How may I assist you?`,
          savage:  `Savage mode on. Don't waste my time.`,
          analyst: `Analyst mode activated. Research systems primed.`,
        };
        return confirmations[p] || `Switched to **${p}** mode.`;
      }
    }
    const available = Object.keys(PERSONAS).join(", ");
    return `Available personas: **${available}**. Say "switch to [persona]" to change.`;
  }

  // ─────────────────────────────────────────────
  // FOLLOW-UP HANDLER (continued topics)
  // ─────────────────────────────────────────────
  async function handleFollowUp(text) {
    if (_lastResearchTopic) {
      return await liveResearch(_lastResearchTopic + " " + text);
    }
    if (_lastIntent && _lastIntent !== "general") {
      return `Continuing on **${_lastIntent}** — can you be more specific about what you want to know?`;
    }
    return null;
  }

  // ─────────────────────────────────────────────
  // EXTERNAL HANDLER SLOTS
  // ─────────────────────────────────────────────
  let _apiHandler    = null;
  let _translatorFn  = null;

  function setApiHandler(fn) {
    if (typeof fn !== "function") throw new Error("SonixModel.setApiHandler expects a function");
    _apiHandler = fn;
  }

  function setTranslator(fn) {
    if (typeof fn !== "function") throw new Error("SonixModel.setTranslator expects a function");
    _translatorFn = fn;
  }

  // ─────────────────────────────────────────────
  // CORE CHAT FUNCTION v3
  // ─────────────────────────────────────────────
  async function chat(userText, options = {}) {
    if (!userText || typeof userText !== "string") return "";

    const rawText  = userText.trim();
    const text     = normalizeCasual(rawText);
    const persona  = options.persona || _persona;
    const sentiment = detectSentiment(rawText);

    // Track sentiment
    _sentimentHistory.push(sentiment);
    if (_sentimentHistory.length > 10) _sentimentHistory = _sentimentHistory.slice(-10);

    // Push to memory
    _memory.push({ role: "user", content: rawText });
    if (_memory.length > MAX_MEMORY * 2) _memory = _memory.slice(-MAX_MEMORY * 2);

    let response = "";

    // 1. External API handler
    if (_apiHandler) {
      try {
        response = await _apiHandler(rawText, { memory: _memory, persona, userName: _userName, sentiment });
        if (response) {
          _memory.push({ role: "assistant", content: response });
          return response;
        }
      } catch (e) {
        console.warn("[SonixModel] API handler failed, falling back to local:", e.message);
      }
    }

    // 2. Detect intent
    const intent = detectIntent(text);
    _lastIntent = intent;

    // Track topic
    if (!["greeting", "thanks", "farewell", "emotional", "vent"].includes(intent)) {
      _topicHistory.push(intent);
      if (_topicHistory.length > 10) _topicHistory = _topicHistory.slice(-10);
    }

    // ── Handlers ──

    // EMOTIONAL / SUPPORT
    if (intent === "emotional") {
      response = handleEmotional(text, persona);
    }

    if (intent === "vent") {
      response = handleVent(text, persona);
    }

    if (intent === "motivate") {
      response = handleMotivate(text, persona);
    }

    // OPINION / DEBATE
    if (!response && intent === "opinion") {
      response = handleOpinion(text, persona);
    }

    // COMPARE
    if (!response && intent === "compare") {
      const comparePrompt = text.match(/\b(vs\.?|versus|difference between|compare|which is better|is .* better)\b/i)
        ? text : text;
      response = await liveResearch(comparePrompt) || handleOpinion(text, persona);
    }

    // RIDDLE
    if (!response && intent === "riddle") {
      response = handleRiddle(text);
    }

    // FOLLOW-UP
    if (!response && intent === "followup") {
      response = await handleFollowUp(text) || "";
    }

    // MATH
    if (!response && intent === "math") {
      const result = advancedMath(text);
      if (result !== null) {
        const formatted = typeof result === "number"
          ? result.toLocaleString("en-US", { maximumFractionDigits: 10 })
          : result;
        response = persona === "savage"  ? `${formatted}. Basic math.`
          : persona === "friend"         ? `omg yes!! **${formatted}** lol`
          : persona === "formal"         ? `The result is **${formatted}**.`
          : persona === "analyst"        ? `Computed: **${formatted}**`
          : `Result: **${formatted}**`;
      }
    }

    if (!response && intent === "equation") {
      const solveResult = solveEquation(text);
      if (solveResult !== null) {
        response = persona === "savage" ? `x = **${solveResult}**. Algebra.`
          : persona === "friend"        ? `x = **${solveResult}**!! solved lol`
          : persona === "formal"        ? `Solving yields x = **${solveResult}**.`
          : `x = **${solveResult}**`;
      }
    }

    if (!response && intent === "percent")       response = handlePercent(text) || "";
    if (!response && intent === "number_theory") response = handleNumberTheory(text) || "";
    if (!response && intent === "stats")         response = handleStats(text) || "";
    if (!response && intent === "convert")       response = convertUnits(text) || "";
    if (!response && intent === "acronym")       response = handleAcronym(text) || "";
    if (!response && intent === "wordcount")     response = handleWordCount(text);

    // JOKE
    if (intent === "joke") {
      response = pickUnique(JOKES, "joke");
    }

    // TRIVIA
    if (intent === "trivia") {
      response = `🧠 Fun fact: ${pickUnique(FUN_FACTS, "trivia")}`;
    }

    // DATETIME
    if (intent === "datetime") {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      response = persona === "friend"  ? `it's ${dateStr}, ${timeStr} rn!`
        : persona === "formal"         ? `The current date and time is ${dateStr}, ${timeStr}.`
        : persona === "savage"         ? `${dateStr}. ${timeStr}. You're welcome.`
        : `${dateStr} — ${timeStr}`;
    }

    // MEMORY
    if (intent === "memory_set")   response = handleMemorySet(text);
    if (intent === "memory_recall") response = handleMemoryRecall();
    if (intent === "memory_clear") {
      _memory = []; _userName = null; _topicHistory = []; _lastResearchTopic = null;
      response = persona === "savage" ? "Context cleared. Fresh start."
        : persona === "friend"        ? "okk wiped!! starting fresh :)"
        : "Memory cleared. Starting fresh.";
    }

    // PERSONA SWITCH
    if (intent === "persona_switch") {
      response = handlePersonaSwitch(text);
    }

    // TRANSLATE
    if (!response && intent === "translate") {
      response = await handleTranslate(text);
    }

    // NUMBER FACT (live)
    if (!response && intent === "number_fact") {
      response = await liveNumberFact(text) || "";
    }

    // COUNTRY INFO (live)
    if (!response && intent === "country") {
      response = await liveCountryInfo(text) || "";
    }

    // BOOK LOOKUP (live)
    if (!response && intent === "book") {
      response = await liveBookLookup(text) || "";
    }

    // NEWS / RESEARCH (live)
    if (!response && (intent === "research" || intent === "news")) {
      response = await liveResearch(text) || "";
    }

    // Persona-mapped response
    if (!response) {
      response = buildResponse(intent, text, persona) || "";
    }

    // General fallback
    if (!response) {
      response = generalFallback(text, persona, sentiment);
    }

    // Append follow-up question sometimes (not for simple or emotional replies)
    const shouldAskFollowUp = !["greeting", "thanks", "farewell", "joke", "trivia", "datetime", "riddle", "emotional", "vent", "motivate", "memory_clear", "persona_switch"].includes(intent);
    const isLongEnough = response.length > 80;
    if (shouldAskFollowUp && isLongEnough && Math.random() < 0.35) {
      response += `\n\n*${getFollowUpQuestion(intent)}*`;
    }

    _memory.push({ role: "assistant", content: response });
    _lastResponse = response;
    _greeted = _greeted || intent === "greeting";
    return response;
  }

  // ─────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────
  const SonixModel = {
    version: VERSION,
    name: MODEL_NAME,

    chat,

    setPersona(p) {
      if (PERSONAS[p]) { _persona = p; _usedResponses = {}; return true; }
      console.warn(`[SonixModel] Unknown persona: ${p}. Available: ${Object.keys(PERSONAS).join(", ")}`);
      return false;
    },

    getPersona()         { return _persona; },
    setUserName(name)    { _userName = name; },
    getUserName()        { return _userName; },
    setApiHandler,
    setTranslator,
    clearMemory()        { _memory = []; _topicHistory = []; _lastResearchTopic = null; },
    getMemory()          { return [..._memory]; },
    getPersonas()        { return Object.keys(PERSONAS); },
    getSystemPrompt(p)   { return PERSONAS[p || _persona] || PERSONAS.default; },

    async quick(text, persona) {
      const saved = _persona;
      if (persona) _persona = persona;
      const res = await chat(text);
      _persona = saved;
      return res;
    },

    // Direct access
    math:         advancedMath,
    convert:      convertUnits,
    research:     liveResearch,
    solve:        solveEquation,
    percent:      handlePercent,
    numberTheory: handleNumberTheory,
    stats:        handleStats,
    countryInfo:  liveCountryInfo,
    bookLookup:   liveBookLookup,
    numberFact:   liveNumberFact,

    expandAcronym(acronym) {
      return ACRONYMS[acronym.toUpperCase()] || null;
    },

    getSentiment()     { return _sentimentHistory.slice(-1)[0] || "neutral"; },
    getSentimentHistory() { return [..._sentimentHistory]; },
    getTopicHistory()  { return [..._topicHistory]; },

    getStats() {
      return {
        version:          VERSION,
        persona:          _persona,
        userName:         _userName,
        memoryTurns:      Math.floor(_memory.length / 2),
        maxMemory:        MAX_MEMORY,
        topicHistory:     _topicHistory.slice(-5),
        lastResearch:     _lastResearchTopic,
        sentiment:        _sentimentHistory.slice(-1)[0] || "neutral",
        hasApiHandler:    !!_apiHandler,
        hasTranslator:    !!_translatorFn,
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
    `%c[SONIX-Model v${VERSION}] Loaded. Persona: ${_persona} | Communication: Enhanced | Research: Multi-Source | Memory: ${MAX_MEMORY} turns`,
    "color:#00ff41;font-weight:bold;background:#000;padding:2px 6px;border-radius:3px"
  );

})(typeof window !== "undefined" ? window : this);
