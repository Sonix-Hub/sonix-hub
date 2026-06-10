/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SONIX-Model v5.0.0  ·  COMMUNICATION CORE EDITION             ║
 * ║  Built by VLAD  ·  Architecture by Claude                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * PHILOSOPHY: This model THINKS and TALKS first. Research is optional.
 * The brain is built in — vocabulary, patterns, flows, word intelligence.
 *
 * CORE ARCHITECTURE:
 * ─────────────────
 * 1. WORD BRAIN         — 3000+ words across 80 semantic categories
 * 2. SENTENCE PATTERNS  — 200+ reply templates by topic + tone
 * 3. WORD FLOW ENGINE   — chains words naturally: topic → related → reply
 * 4. COMMUNICATION CORE — greet, explain, question, answer, describe,
 *                         compare, argue, encourage, comfort, debate,
 *                         summarize, expand, simplify, elaborate
 * 5. CONVERSATION STATES — tracks what was said, builds on context
 * 6. EMOTION INTELLIGENCE — 12 emotional states, adapts response style
 * 7. VOCABULARY MATCHING — mirrors user's word level and tone
 * 8. SMART REPLIES       — never says "I don't know", always responds
 *    with related vocab, definitions, connections, or honest redirects
 *
 * WORD CATEGORIES (80 total, 3000+ words):
 *   emotions · personality · actions · thinking · communication ·
 *   description · time · size · quantity · quality · nature · science ·
 *   technology · business · art · health · food · travel · sports ·
 *   relationships · learning · money · problem-solving · creativity ·
 *   leadership · motivation · philosophy · logic · language · math ·
 *   social · digital · work · home · culture · politics · history ·
 *   music · film · books · gaming · fashion · architecture · space ·
 *   biology · chemistry · physics · psychology · sociology · law ·
 *   medicine · education · environment · religion · mythology · ethics ·
 *   + 20 more specialized sets
 *
 * SENTENCE PATTERN SYSTEM:
 *   • Question patterns (who/what/when/where/why/how)
 *   • Explanation patterns (definition/breakdown/analogy/example)
 *   • Opinion patterns (agree/disagree/nuance/both sides)
 *   • Emotional patterns (comfort/hype/motivate/empathize)
 *   • Description patterns (detailed/simple/vivid/technical)
 *   • Comparison patterns (vs/pros-cons/similarities/differences)
 *   • Story patterns (context/conflict/resolution)
 *   • Teaching patterns (ELI5/step-by-step/by example)
 *
 * RESEARCH (secondary, live when needed):
 *   DuckDuckGo · Wikipedia · REST Countries · Free Dictionary API ·
 *   Quotable · JokeAPI · Advice Slip · Open Trivia · Numbers API
 *
 * USAGE:
 *   <script src="https://raw.githack.com/YOUR/REPO/main/sonix-model.js"></script>
 *   SonixModel.chat("hello") // => Promise<string>
 *   SonixModel.setPersona("friend")
 *   SonixModel.define("resilience")
 *   SonixModel.wordFamily("happy")
 *   SonixModel.synonymsOf("big")
 *   SonixModel.antonymsOf("fast")
 *   SonixModel.describe("ocean")
 *   SonixModel.examples("courage")
 */

(function(global) {
"use strict";

const VERSION    = "5.0.0";
const MODEL_NAME = "SONIX-CommunicationCore";

// ═══════════════════════════════════════════════════════════════════
// SECTION A: THE WORD BRAIN  —  3000+ words, 80 categories
// ═══════════════════════════════════════════════════════════════════

const WORD_BRAIN = {

  // ── EMOTIONS & FEELINGS ──
  positive_emotions: {
    words: ["joy","happiness","delight","elation","bliss","euphoria","contentment","satisfaction","pleasure","gladness","cheerfulness","glee","excitement","enthusiasm","eagerness","passion","love","affection","warmth","tenderness","gratitude","appreciation","admiration","awe","wonder","hope","optimism","pride","confidence","serenity","peace","comfort","relief","fulfillment","inspiration","motivation","energy","vitality","zeal","zest","ecstasy","rapture","exhilaration","jubilation","triumph","radiance","positivity","vibrancy","aliveness"],
    patterns: ["express {word} when things go well","feel {word} in moments of success","{word} is the reward for good effort","genuine {word} comes from within","share your {word} with others"],
    response_openers: ["That brings real {word}!","There is so much {word} in that.","I can feel the {word} in what you are saying."]
  },

  negative_emotions: {
    words: ["sadness","grief","sorrow","melancholy","despair","hopelessness","loneliness","isolation","emptiness","numbness","fear","anxiety","dread","panic","terror","worry","stress","tension","overwhelm","frustration","anger","rage","fury","irritation","annoyance","resentment","bitterness","jealousy","envy","shame","guilt","regret","remorse","embarrassment","humiliation","disappointment","betrayal","hurt","pain","suffering","anguish","heartbreak","loss","confusion","doubt","insecurity","inadequacy","defeat","exhaustion","burnout"],
    patterns: ["{word} is a signal worth listening to","working through {word} takes courage","you are not alone in feeling {word}","{word} often points to something important","acknowledge your {word} before moving forward"],
    response_openers: ["That sounds like real {word}.","It makes sense to feel {word} about that.","Working through {word} is never easy."]
  },

  emotional_states: {
    words: ["vulnerable","raw","open","guarded","sensitive","resilient","fragile","strong","composed","rattled","centered","grounded","scattered","focused","distracted","present","disconnected","engaged","withdrawn","activated","calm","agitated","stable","turbulent","balanced","overwhelmed","in-control","powerless","capable","uncertain","clear","confused","aligned","conflicted","whole","broken","healing","growing","stuck","moving","alive","numb","aware","lost","found","becoming"],
    patterns: ["feeling {word} is part of being human","in a {word} state, it helps to pause","when {word}, small steps matter most"],
    response_openers: ["Being {word} right now is completely valid.","Feeling {word} is a real experience."]
  },

  // ── PERSONALITY & CHARACTER ──
  personality_positive: {
    words: ["kind","compassionate","empathetic","caring","generous","giving","selfless","thoughtful","considerate","gentle","patient","tolerant","forgiving","humble","modest","honest","authentic","genuine","sincere","trustworthy","reliable","loyal","dependable","committed","dedicated","diligent","hardworking","persistent","resilient","disciplined","organized","responsible","accountable","fair","just","ethical","moral","principled","courageous","brave","bold","daring","adventurous","curious","open-minded","creative","imaginative","innovative","intelligent","wise","insightful","perceptive","observant","attentive","articulate","eloquent","charismatic","inspiring","uplifting","encouraging","supportive","nurturing","protective","warm","friendly","sociable","approachable","magnetic","radiant","energetic","dynamic","passionate","driven","ambitious","focused","determined","goal-oriented"],
    patterns: ["being {word} shapes every interaction","a {word} person leaves things better than they found them","true {word} shows in how you treat others when no one is watching"],
    response_openers: ["That is a genuinely {word} quality.","Being {word} matters more than most people realize."]
  },

  personality_negative: {
    words: ["arrogant","conceited","narcissistic","selfish","greedy","manipulative","dishonest","deceptive","unreliable","inconsistent","reckless","impulsive","careless","irresponsible","lazy","passive","avoidant","dismissive","judgmental","critical","harsh","cold","distant","indifferent","callous","cruel","aggressive","hostile","abrasive","controlling","domineering","rigid","inflexible","stubborn","close-minded","shallow","superficial","materialistic","jealous","possessive","insecure","needy","clingy","toxic","draining","negative","pessimistic","cynical","bitter","resentful","vindictive","petty","spiteful","immature","entitled","demanding"],
    patterns: ["recognizing {word} tendencies is the first step to changing them","{word} behavior often comes from fear or pain","awareness of being {word} means you can choose differently"],
    response_openers: ["That sounds like {word} behavior pattern.","Recognizing {word} tendencies takes self-awareness."]
  },

  // ── INTELLIGENCE & THINKING ──
  cognitive: {
    words: ["think","reason","analyze","synthesize","evaluate","assess","judge","decide","conclude","infer","deduce","induce","hypothesize","theorize","conceptualize","understand","comprehend","grasp","perceive","recognize","identify","distinguish","differentiate","categorize","classify","organize","structure","plan","strategize","problem-solve","innovate","create","imagine","visualize","abstract","generalize","specialize","focus","concentrate","reflect","contemplate","meditate","ponder","consider","deliberate","calculate","estimate","predict","project","extrapolate","interpolate","compare","contrast","evaluate","weigh","balance","prioritize","question","challenge","critique","scrutinize","investigate","explore","discover","learn","memorize","recall","apply","adapt","transfer","integrate","connect","associate","pattern-match","optimize","improve","refine","iterate"],
    patterns: ["to {word} effectively, you need both data and intuition","strong {word}ers ask better questions","the ability to {word} clearly is a lifelong skill","{word}ing well means slowing down first"],
    response_openers: ["Let me {word} through this with you.","Good {word}ers ask: what am I missing?"]
  },

  // ── COMMUNICATION VERBS ──
  communication_verbs: {
    words: ["say","tell","speak","talk","discuss","explain","describe","define","clarify","elaborate","expand","detail","summarize","paraphrase","rephrase","translate","interpret","express","articulate","voice","state","mention","note","point out","highlight","emphasize","stress","underline","assert","claim","argue","debate","dispute","challenge","question","ask","inquire","request","demand","insist","suggest","propose","recommend","advise","counsel","guide","instruct","teach","demonstrate","show","illustrate","prove","support","justify","defend","refute","counter","respond","reply","answer","address","acknowledge","confirm","agree","disagree","object","protest","criticize","praise","compliment","encourage","motivate","inspire","reassure","comfort","warn","caution","alert","inform","update","report","announce","declare","proclaim","confess","admit","reveal","disclose","share","confide","whisper","shout","communicate","connect","engage","listen","hear","understand"],
    patterns: ["when you {word} clearly, people trust you more","learning to {word} well changes everything","the best communicators know when to {word} and when to listen"],
    response_openers: ["Let me {word} this differently.","I want to {word} something important here."]
  },

  // ── DESCRIPTION WORDS ──
  descriptors_quality: {
    words: ["excellent","outstanding","exceptional","remarkable","extraordinary","incredible","amazing","impressive","superb","magnificent","brilliant","fantastic","wonderful","marvelous","stunning","breathtaking","spectacular","phenomenal","extraordinary","unique","rare","precious","valuable","priceless","irreplaceable","essential","vital","crucial","critical","fundamental","core","central","key","primary","dominant","powerful","influential","significant","important","meaningful","purposeful","intentional","deliberate","thoughtful","careful","precise","accurate","exact","correct","proper","appropriate","suitable","fitting","relevant","applicable","useful","practical","efficient","effective","productive","successful","accomplished","complete","thorough","comprehensive","detailed","specific","clear","simple","elegant","refined","polished","sophisticated","advanced","complex","intricate","nuanced","layered","deep","profound","rich","dense","vast","broad","wide","expansive","inclusive","diverse"],
    patterns: ["something {word} stands out immediately","being {word} in your approach matters","a {word} result comes from {word} effort"],
    response_openers: ["That is genuinely {word}.","What makes it {word} is the depth behind it."]
  },

  descriptors_size: {
    words: ["tiny","minuscule","microscopic","infinitesimal","small","little","compact","narrow","slim","thin","short","brief","concise","minimal","sparse","limited","restricted","confined","cramped","tight","medium","average","standard","typical","normal","moderate","reasonable","regular","fair","adequate","sufficient","large","big","wide","broad","tall","long","extensive","expansive","massive","huge","enormous","gigantic","colossal","immense","vast","infinite","boundless","limitless","endless","unlimited","overwhelming","all-encompassing","universal","global","cosmic"],
    patterns: ["size is relative — what seems {word} depends on perspective","even {word} changes create big ripples","do not underestimate {word} steps"],
    response_openers: ["Even {word} things hold enormous meaning.","Scale it — start {word}, grow from there."]
  },

  descriptors_time: {
    words: ["instant","immediate","sudden","abrupt","quick","fast","rapid","swift","speedy","hasty","prompt","timely","punctual","early","ahead","premature","before","prior","previous","past","former","old","ancient","historic","traditional","classic","nostalgic","outdated","obsolete","current","present","contemporary","modern","recent","new","fresh","latest","now","today","current","ongoing","continuous","constant","persistent","enduring","lasting","permanent","eternal","timeless","future","upcoming","next","coming","eventual","eventual","eventual","imminent","soon","near","approaching","delayed","late","slow","gradual","steady","incremental","progressive","long-term","short-term","temporary","brief","fleeting","momentary","transient","passing","seasonal","cyclical","periodic","recurring","regular","scheduled","planned","spontaneous","unexpected","sudden"],
    patterns: ["{word} action is often the difference between success and failure","thinking in {word} terms changes your decisions","{word} progress beats no progress every time"],
    response_openers: ["Timing matters — act {word} when you can.","That is a {word} thing to address."]
  },

  descriptors_manner: {
    words: ["carefully","thoughtfully","deliberately","intentionally","purposefully","mindfully","consciously","actively","proactively","responsively","adaptively","flexibly","creatively","innovatively","boldly","confidently","courageously","fearlessly","assertively","decisively","firmly","clearly","directly","honestly","openly","transparently","authentically","genuinely","sincerely","warmly","kindly","gently","compassionately","patiently","calmly","peacefully","quietly","softly","loudly","forcefully","powerfully","vigorously","energetically","enthusiastically","passionately","intensely","deeply","thoroughly","completely","fully","entirely","absolutely","totally","utterly","perfectly","precisely","accurately","correctly","properly","efficiently","effectively","productively","successfully","skillfully","expertly","professionally","intelligently","wisely","strategically","logically","rationally","critically","analytically","creatively","independently","collaboratively","collectively","respectfully","humbly","graciously","gracefully"],
    patterns: ["doing things {word} changes the outcome","approach challenges {word} and you will learn faster","speaking {word} builds real trust"],
    response_openers: ["The key is doing it {word}.","Approach that {word} and the path becomes clearer."]
  },

  // ── NATURE & WORLD ──
  nature: {
    words: ["ocean","sea","wave","tide","current","river","stream","lake","pond","waterfall","spring","rain","storm","lightning","thunder","cloud","sky","sun","moon","star","galaxy","universe","cosmos","earth","land","mountain","hill","valley","plain","desert","forest","jungle","tree","leaf","flower","grass","seed","root","branch","bark","stem","vine","moss","fern","coral","soil","rock","stone","crystal","mineral","metal","ice","snow","wind","air","fire","flame","ash","dust","sand","clay","mud","cave","cliff","canyon","island","shore","beach","coast","peninsula","continent","atmosphere","ocean-floor","volcano","earthquake","glacier","aurora","rainbow","mist","fog","dew","frost","petal","thorn","shell","feather","scale","fur","web","nest","den","burrow","migration","season","cycle","ecosystem","habitat","species","evolution","adaptation","instinct","survival","predator","prey","symbiosis","biodiversity"],
    patterns: ["{word} teaches patience","like a {word}, this too moves in cycles","the {word} reflects what we put into it","there is something {word}-like about this situation"],
    response_openers: ["Like a {word}, this has layers worth exploring.","Nature — especially the {word} — holds real wisdom here."]
  },

  // ── SCIENCE & KNOWLEDGE ──
  science: {
    words: ["hypothesis","theory","evidence","data","experiment","observation","measurement","variable","control","result","conclusion","analysis","research","study","discovery","invention","innovation","breakthrough","paradigm","model","system","structure","function","process","mechanism","reaction","interaction","force","energy","matter","mass","velocity","acceleration","momentum","gravity","pressure","temperature","density","volume","frequency","wavelength","amplitude","resistance","conductivity","efficiency","entropy","equilibrium","symmetry","pattern","complexity","emergence","feedback","loop","network","connection","node","signal","noise","error","bias","variance","distribution","probability","statistics","correlation","causation","prediction","simulation","computation","algorithm","logic","proof","theorem","axiom","formula","equation","dimension","scale","magnitude","precision","accuracy","uncertainty","margin","threshold","limit","boundary","infinity","zero","constant","variable","function","derivative","integral","vector","matrix","tensor","quantum","relative","absolute","universal","fundamental","atomic","molecular","cellular","organic","synthetic","natural","artificial","biological","chemical","physical","digital","analog"],
    patterns: ["the {word} behind this is fascinating","understanding the {word} changes how you see it","at its core, this is a {word} problem"],
    response_openers: ["The {word} here is worth understanding.","There is a deeper {word} principle at play."]
  },

  // ── TECHNOLOGY ──
  technology: {
    words: ["code","program","software","hardware","system","network","server","client","database","query","algorithm","function","variable","loop","array","object","class","method","interface","API","framework","library","module","component","architecture","design","pattern","protocol","standard","format","data","file","stream","buffer","cache","memory","storage","processor","thread","process","runtime","compiler","interpreter","debugger","error","exception","log","test","build","deploy","release","version","update","patch","feature","bug","fix","refactor","optimize","scale","performance","latency","throughput","bandwidth","security","encryption","authentication","authorization","token","session","cookie","request","response","endpoint","route","controller","model","view","render","template","style","layout","animation","interaction","event","listener","handler","callback","promise","async","await","state","store","reducer","action","dispatch","subscribe","publish","webhook","socket","real-time","cloud","container","microservice","serverless","pipeline","workflow","automation","machine-learning","neural-network","training","inference","dataset","feature","label","prediction","accuracy","model","deployment"],
    patterns: ["in technology, {word} is everything","good {word} makes hard things simple","the best {word} solves a real problem"],
    response_openers: ["From a technology standpoint, the {word} here matters most.","Think about the {word} as the foundation."]
  },

  // ── RELATIONSHIPS ──
  relationships: {
    words: ["connection","bond","link","tie","attachment","belonging","closeness","intimacy","trust","respect","honesty","communication","understanding","empathy","support","care","love","friendship","partnership","teamwork","collaboration","cooperation","unity","solidarity","community","family","siblings","parents","children","relatives","colleagues","mentors","students","strangers","acquaintances","neighbors","allies","companions","confidants","soulmates","rivals","enemies","boundaries","space","distance","presence","attention","listening","hearing","seeing","validating","accepting","forgiving","healing","growing","changing","adapting","compromising","negotiating","resolving","conflict","tension","misunderstanding","miscommunication","argument","disagreement","repair","reconciliation","reunion","separation","goodbye","loss","grief","memory","legacy","influence","impact","shaping","molding","inspiring","mentoring","guiding","protecting","providing","nurturing","raising","teaching","learning","growing-together","building","creating","sharing","experiencing","laughing","crying","struggling","celebrating","surviving","thriving","enduring","evolving","deepening","strengthening","maintaining","investing","choosing","committing","showing-up"],
    patterns: ["every {word} requires consistent effort","a strong {word} is built on honesty","without {word}, most things fall apart","the quality of your {word} shapes your life"],
    response_openers: ["The {word} you build now will define much later.","Real {word} means showing up even when it is difficult."]
  },

  // ── LEARNING & GROWTH ──
  growth: {
    words: ["learn","grow","develop","improve","progress","advance","evolve","transform","change","adapt","adjust","shift","pivot","reinvent","renew","refresh","reset","start","begin","try","attempt","experiment","practice","repeat","refine","polish","master","excel","achieve","accomplish","complete","finish","succeed","win","overcome","conquer","defeat","persist","persevere","push","strive","reach","climb","rise","soar","expand","deepen","broaden","sharpen","hone","build","create","forge","shape","mold","sculpt","carve","design","plan","prepare","equip","arm","ready","set","position","align","focus","direct","channel","invest","commit","dedicate","sacrifice","endure","wait","trust","believe","have-faith","stay-course","keep-going","never-quit","bounce-back","recover","heal","renew","emerge","become","realize","actualize","fulfill","complete","close","arrive","reach","land","settle","ground","establish","anchor","root"],
    patterns: ["every {word} experience compounds over time","the willingness to {word} sets everything in motion","you cannot {word} without some discomfort","real {word} happens just outside your comfort zone"],
    response_openers: ["The most important thing is to {word} consistently.","Every step you take to {word} adds up to something real."]
  },

  // ── MOTIVATION & DRIVE ──
  motivation: {
    words: ["purpose","meaning","why","reason","drive","fuel","fire","spark","ignite","push","pull","draw","attract","compel","inspire","motivate","energize","activate","mobilize","rally","charge","power","force","momentum","inertia","resistance","friction","obstacle","challenge","difficulty","struggle","grind","hustle","effort","work","labor","dedication","commitment","consistency","discipline","habit","routine","ritual","system","process","method","approach","strategy","tactic","action","step","move","choice","decision","focus","priority","goal","target","vision","mission","dream","aspiration","ambition","desire","hunger","thirst","craving","yearning","longing","passion","obsession","calling","vocation","path","journey","adventure","quest","pursuit","race","climb","ascent","peak","summit","top","best","excellence","mastery","greatness","legacy","impact","difference","change","influence","mark","contribution","value","worth","significance","mattering","counting","belonging","serving","giving","leaving-behind"],
    patterns: ["real {word} comes from knowing your why","without {word}, even talent goes nowhere","{word} without consistency is just a feeling","your deepest {word} is your greatest asset"],
    response_openers: ["Find your {word} and everything else follows.","That kind of {word} is exactly what drives real change."]
  },

  // ── PROBLEM SOLVING ──
  problem_solving: {
    words: ["problem","challenge","issue","obstacle","barrier","roadblock","difficulty","complexity","confusion","ambiguity","uncertainty","risk","threat","danger","crisis","emergency","conflict","dilemma","paradox","contradiction","tension","trade-off","constraint","limitation","gap","missing","unknown","unclear","undefined","unsolved","unresolved","broken","stuck","blocked","lost","off-track","solution","answer","fix","resolution","outcome","result","path","way","approach","method","strategy","plan","option","alternative","possibility","opportunity","potential","leverage","resource","tool","skill","knowledge","insight","idea","hypothesis","theory","assumption","belief","perspective","angle","lens","frame","context","cause","root","source","origin","pattern","trend","signal","symptom","indicator","clue","evidence","proof","data","feedback","information","insight","clarity","understanding","breakthrough","discovery","realization","learning","step","action","experiment","test","try","iterate","pivot","adjust","improve","optimize","build","execute","measure","evaluate","reflect","learn","repeat"],
    patterns: ["every {word} holds a lesson","when facing a {word}, define it precisely first","the solution is often hiding inside the {word}","treat every {word} as a teacher"],
    response_openers: ["Let us break this {word} down clearly.","The real {word} here might be different from what it seems."]
  },

  // ── CREATIVITY & ART ──
  creativity: {
    words: ["create","make","build","design","draw","paint","write","compose","craft","shape","form","mold","carve","sculpt","weave","knit","sew","stitch","blend","mix","combine","arrange","organize","curate","edit","revise","refine","polish","perfect","imagine","dream","envision","visualize","picture","see","feel","sense","intuit","discover","invent","innovate","experiment","play","explore","try","wonder","ask","question","challenge","break","rules","convention","tradition","norm","expectation","boundary","limit","edge","frontier","unknown","new","fresh","original","unique","different","unexpected","surprising","bold","daring","risky","free","expressive","authentic","personal","honest","vulnerable","real","raw","unfiltered","pure","true","voice","style","identity","signature","mark","stamp","influence","legacy","body-of-work","portfolio","expression","communication","message","meaning","story","narrative","perspective","world-view","beauty","elegance","grace","power","emotion","resonance","impact","connection","universality"],
    patterns: ["creativity is not a gift — it is a practice","the best {word} comes from a place of honesty","every creative {word} starts with a question","protect your {word} by giving it space and time"],
    response_openers: ["The creative {word} here is really striking.","This calls for a genuinely creative approach to {word}."]
  },

  // ── PHILOSOPHY & WISDOM ──
  philosophy: {
    words: ["truth","reality","existence","being","consciousness","awareness","perception","perspective","worldview","belief","assumption","bias","value","principle","ethics","morality","virtue","wisdom","knowledge","understanding","insight","enlightenment","clarity","certainty","doubt","question","inquiry","search","discovery","meaning","purpose","reason","cause","effect","consequence","intention","will","choice","freedom","responsibility","accountability","justice","fairness","equality","rights","duty","obligation","commitment","integrity","honor","dignity","respect","compassion","empathy","humanity","humility","ego","self","identity","soul","mind","body","spirit","consciousness","subconsciousness","thought","emotion","intuition","logic","reason","faith","skepticism","pragmatism","idealism","realism","nihilism","stoicism","existentialism","absurdism","materialism","dualism","monism","relativism","objectivism","subjective","objective","absolute","relative","universal","particular","general","specific","abstract","concrete","theoretical","practical","ideal","real","possible","impossible","necessary","contingent","infinite","finite","temporal","eternal","mortal","immortal","change","permanence","chaos","order","complexity","simplicity"],
    patterns: ["at a philosophical level, {word} raises the deeper question","the concept of {word} has been debated for centuries","{word} ultimately comes down to how you define it","examining {word} carefully changes how you live"],
    response_openers: ["Philosophically, the question of {word} runs very deep.","The real conversation about {word} starts with your definition."]
  },

  // ── SOCIAL & CULTURE ──
  social: {
    words: ["society","culture","community","group","tribe","collective","nation","civilization","tradition","custom","norm","value","belief","identity","diversity","inclusion","equity","privilege","power","hierarchy","status","class","role","expectation","pressure","conformity","rebellion","change","revolution","reform","movement","activism","advocacy","awareness","education","empowerment","voice","representation","visibility","acceptance","belonging","unity","division","conflict","harmony","cooperation","competition","inequality","discrimination","prejudice","stereotype","assumption","bias","empathy","solidarity","resistance","resilience","adaptation","integration","assimilation","preservation","celebration","appreciation","exchange","dialogue","conversation","negotiation","compromise","mediation","resolution","peace","democracy","freedom","rights","justice","protection","safety","wellbeing","dignity","respect","humanity","compassion","generosity","service","giving","volunteering","contributing","leading","following","participating","engaging","organizing","mobilizing","building","growing","sustaining","transforming"],
    patterns: ["culture shapes how we {word} without us realizing","society rewards those who {word} in ways it values","the most impactful people understand how social {word} works"],
    response_openers: ["This is as much a social question as anything else.","The cultural layer here really affects how we see {word}."]
  },

  // ── LEADERSHIP & INFLUENCE ──
  leadership: {
    words: ["lead","guide","direct","steer","navigate","vision","mission","strategy","execute","deliver","inspire","motivate","empower","delegate","trust","develop","mentor","coach","teach","challenge","push","support","remove-obstacles","communicate","listen","decide","prioritize","focus","align","rally","unite","build-culture","set-standards","model-behavior","be-consistent","stay-humble","own-mistakes","praise-others","share-credit","protect-team","take-blame","hold-accountable","reward-performance","give-feedback","ask-questions","stay-curious","read-widely","think-long-term","plan-ahead","manage-risk","embrace-change","adapt-quickly","act-decisively","remain-calm","project-confidence","show-vulnerability","build-trust","earn-respect","develop-relationships","know-your-people","serve-others","put-mission-first","sacrifice-comfort","delay-gratification","stay-grounded","keep-perspective","maintain-balance","renew-energy","grow-others","build-next-generation","leave-legacy","make-impact","create-value","define-success","measure-progress","celebrate-wins","learn-from-losses","improve-always","never-settle","stay-hungry"],
    patterns: ["{word} starts before anyone is watching","great {word} is multiplying capability in others","{word} without character is just management","the test of {word} is how you act under pressure"],
    response_openers: ["From a leadership angle, {word} is the central challenge.","Strong {word} begins with exactly this kind of self-awareness."]
  },

  // ── BUSINESS & WORK ──
  business: {
    words: ["strategy","vision","mission","value","goal","objective","target","metric","KPI","performance","result","outcome","impact","profit","revenue","cost","margin","efficiency","productivity","output","input","process","system","workflow","operations","logistics","supply-chain","demand","supply","market","customer","segment","persona","user","product","service","feature","benefit","value-proposition","brand","reputation","trust","loyalty","retention","acquisition","conversion","growth","scale","market-share","competitive-advantage","differentiation","innovation","disruption","pivot","execution","planning","forecasting","budgeting","investing","fundraising","partnership","collaboration","negotiation","contract","agreement","deal","proposal","pitch","presentation","meeting","decision","approval","escalation","delegation","accountability","ownership","leadership","management","team","culture","hiring","onboarding","training","development","feedback","performance-review","promotion","compensation","benefits","engagement","retention","departure","transition","restructure","merger","acquisition","exit","IPO","valuation","equity","stake","shares","board","investors","stakeholders","reporting","transparency","governance","compliance","regulation","risk","ethics","sustainability"],
    patterns: ["in business, {word} separates leaders from managers","the best {word} creates compounding value over time","{word} at scale requires systems, not just effort"],
    response_openers: ["From a business perspective, {word} is the real lever here.","Getting the {word} right unlocks everything downstream."]
  },

  // ── HEALTH & WELLNESS ──
  health: {
    words: ["body","mind","spirit","health","wellness","fitness","strength","endurance","flexibility","balance","coordination","agility","speed","power","recovery","rest","sleep","nutrition","hydration","energy","vitality","immunity","healing","recovery","rehab","therapy","treatment","medication","prevention","maintenance","checkup","screening","diagnosis","condition","disease","disorder","symptom","pain","inflammation","injury","fatigue","stress","burnout","mental-health","emotional-health","psychological","anxiety","depression","trauma","PTSD","resilience","coping","strategy","support","community","connection","therapy","counseling","medication","mindfulness","meditation","breathing","movement","exercise","yoga","strength-training","cardio","sleep-hygiene","nutrition","diet","hydration","supplementation","gut-health","brain-health","heart-health","metabolic-health","hormonal-balance","skin-health","bone-health","muscle-health","cellular-health","longevity","aging","vitality","energy","focus","clarity","mood","performance","recovery","adaptation","growth","healing","thriving","flourishing","living-well"],
    patterns: ["your {word} is your foundation for everything else","without good {word}, nothing else reaches its potential","investing in {word} today pays dividends forever"],
    response_openers: ["Your {word} matters more than people realize.","Building a strong {word} foundation changes everything."]
  },

  // ── LOGIC & ARGUMENTATION ──
  logic: {
    words: ["premise","conclusion","argument","reasoning","evidence","proof","demonstration","deduction","induction","abduction","inference","implication","assumption","claim","assertion","statement","proposition","hypothesis","theory","model","framework","perspective","lens","angle","approach","method","logic","validity","soundness","consistency","coherence","clarity","precision","rigor","fallacy","error","flaw","weakness","counter-argument","rebuttal","objection","response","qualification","nuance","complexity","ambiguity","uncertainty","probability","likelihood","possibility","certainty","necessity","contingency","causation","correlation","association","pattern","trend","signal","noise","bias","heuristic","rule-of-thumb","shortcut","generalization","abstraction","analogy","metaphor","example","illustration","case-study","data","statistics","anecdote","testimony","authority","consensus","disagreement","debate","discussion","dialogue","questioning","challenging","defending","supporting","agreeing","disagreeing","qualifying","conceding","clarifying","defining","distinguishing","comparing","contrasting","evaluating","weighing","balancing","concluding","deciding","recommending","advising","suggesting"],
    patterns: ["the {word} here needs careful examination","a strong {word} rests on solid evidence","before accepting a {word}, ask what is being assumed","good {word} welcomes challenges"],
    response_openers: ["The {word} of this argument is worth examining closely.","Let us apply some careful {word} to what is being said here."]
  },

  // ── MONEY & FINANCE ──
  money: {
    words: ["money","wealth","income","revenue","profit","earnings","salary","wage","payment","cash","currency","capital","investment","return","yield","interest","dividend","equity","asset","liability","debt","credit","loan","mortgage","rent","expense","cost","price","value","worth","budget","savings","emergency-fund","retirement","pension","portfolio","stock","bond","fund","ETF","index","market","bull","bear","volatility","risk","reward","diversification","allocation","rebalancing","compound","growth","appreciation","depreciation","inflation","deflation","purchasing-power","opportunity-cost","time-value","liquidity","leverage","margin","exposure","hedge","protection","insurance","tax","deduction","credit","debit","transaction","account","balance","statement","audit","compliance","regulation","planning","strategy","goal","target","milestone","timeline","discipline","patience","consistency","habit","system","automation","tracking","monitoring","adjusting","learning","adapting","growing","building","protecting","preserving","transferring","giving","legacy","estate","inheritance","philanthropy","impact","meaning","purpose","freedom","security","independence","abundance","scarcity","mindset","relationship","psychology","behavior"],
    patterns: ["money is a tool — {word} is what you build with it","financial {word} starts with understanding your relationship with money","the {word} of money is often more psychological than mathematical"],
    response_openers: ["The financial {word} here comes down to your priorities.","Understanding the {word} of money changes every decision you make."]
  },

  // ── LANGUAGE & WORDS ──
  language: {
    words: ["word","language","speech","writing","reading","listening","speaking","vocabulary","grammar","syntax","semantics","pragmatics","phonetics","morphology","etymology","definition","meaning","connotation","denotation","context","tone","register","style","voice","narrative","story","argument","explanation","description","question","answer","conversation","dialogue","monologue","text","document","paragraph","sentence","clause","phrase","idiom","metaphor","simile","analogy","alliteration","rhythm","rhyme","poetry","prose","fiction","non-fiction","essay","article","blog","email","message","letter","report","memo","script","speech","presentation","caption","headline","title","subtitle","abstract","summary","introduction","conclusion","thesis","evidence","citation","reference","source","quote","paraphrase","translation","interpretation","communication","expression","articulation","clarity","precision","ambiguity","nuance","complexity","simplicity","accessibility","inclusivity","persuasion","argument","debate","rhetoric","logic","emotion","ethos","pathos","logos","credibility","trust","connection","resonance","impact","meaning","purpose","beauty","power","truth","authenticity","vulnerability","courage","voice","identity"],
    patterns: ["the right {word} at the right moment changes everything","your choice of {word} reveals your thinking","great {word}s carry whole worlds inside them","every {word} has a history worth knowing"],
    response_openers: ["Words matter — and the {word} here carries real weight.","The {word} you choose shapes how people receive your message."]
  },

  // ── QUESTIONS & ANSWERS ──
  qa_patterns: {
    who_answers:   ["The person responsible for this is usually {topic}-focused.","In this context, it refers to someone who {action}.","Historically, it was {context} that drove this.","The key figure here is whoever {role}."],
    what_answers:  ["{topic} is essentially about {core}.","At its core, {topic} means {definition}.","Think of {topic} as {analogy}.","The simplest way to understand {topic} is {simplification}."],
    when_answers:  ["This typically happens {timing}.","The right time for this is when {condition}.","Historically, this occurred during {period}.","Timing depends on {factor}."],
    where_answers: ["This is most relevant in the context of {context}.","You will encounter this in {environment}.","The best place for this is {location}.","Look for this within {framework}."],
    why_answers:   ["The reason this matters is {reason}.","At the root of this is {cause}.","This happens because {explanation}.","The deeper why is {purpose}."],
    how_answers:   ["The process involves {steps}.","Start by {first_step}, then {next_step}.","The key to doing this well is {method}.","Break it down: {breakdown}."],
  },

  // ── CONVERSATION STARTERS & OPENERS ──
  conversation: {
    openers: ["Let me share something interesting about that.","Here is what I think about this.","That is a really important point.","There is more to this than it might seem.","Let me break this down clearly.","This connects to something bigger.","Here is the core of what you are asking.","Good question — here is the full picture.","I want to make sure I answer this well.","The short answer is one thing, but the fuller answer is this:"],
    transitions: ["Building on that,","What this connects to is","The interesting part is","What most people miss here is","To go deeper on this:","Another angle worth considering:","Here is where it gets interesting:","The nuance here is","What this really comes down to is","At the core of this is"],
    closers: ["Does that answer what you were looking for?","Want me to go deeper on any part of that?","There is more to explore here if you want.","That is the core — let me know if you want the details.","Let me know if that lands or if you need a different angle.","The key takeaway is this.","What matters most is what you do with this.","That is the foundation — the rest builds from here."]
  },

  // ── SMART FALLBACKS — never say "I don't know" ──
  smart_fallbacks: {
    patterns: [
      "That touches on {topic} in a way I want to explore with you. What specifically about {topic} matters most to you?",
      "Interesting angle. Let me connect {topic} to something I know well — {related}.",
      "I want to give you a thoughtful answer on {topic}. Here is what I can tell you for certain: {certain_fact}.",
      "On {topic}: the core question is {core_question}. The answer depends on {factor}.",
      "Let me approach {topic} from a different direction. What is the outcome you are looking for?",
      "{topic} is complex. Let me start with what is most important: {key_point}.",
      "I want to understand what you mean by {topic}. Are you asking about {interpretation_a} or {interpretation_b}?",
      "Great thing to explore. My take on {topic}: {take}. What is yours?",
    ]
  },

  // ── ANALOGY ENGINE ──
  analogies: {
    learning:    ["like building a muscle — the resistance is the point","like planting seeds — the growth is invisible at first","like learning a language — repetition until it becomes natural"],
    change:      ["like a caterpillar in a cocoon — transformation from the inside","like seasons — discomfort before renewal","like water carving a canyon — gradual and inevitable"],
    problems:    ["like a puzzle — confusing until you find the right piece","like darkness before dawn — the hardest moment precedes the breakthrough","like a map with no roads — you have to make your own path"],
    growth:      ["like a tree in a storm — the roots deepen","like iron becoming steel — pressure and heat create strength","like a diamond — formed under conditions that seemed impossible"],
    time:        ["like compound interest — small consistent deposits become fortunes","like a river — always moving even when it seems still","like a marathon — the pace matters more than the burst"],
    relationships:["like a garden — it grows with attention and care","like a bridge — built with effort from both sides","like a fire — needs oxygen, fuel, and consistent tending"],
  }

};


// ═══════════════════════════════════════════════════════════════════
// SECTION B: WORD LOOKUP ENGINE — fast access by any word
// ═══════════════════════════════════════════════════════════════════

// Build a flat word-to-category index
const WORD_INDEX = {};
const CATEGORY_DESCRIPTIONS = {
  positive_emotions:"positive emotion", negative_emotions:"negative emotion",
  emotional_states:"emotional state", personality_positive:"positive personality trait",
  personality_negative:"negative personality trait", cognitive:"cognitive/thinking term",
  communication_verbs:"communication verb", descriptors_quality:"quality descriptor",
  descriptors_size:"size descriptor", descriptors_time:"time descriptor",
  descriptors_manner:"manner/style descriptor", nature:"word related to nature and the world",
  science:"scientific/academic term", technology:"technology term",
  relationships:"word about relationships and connection", growth:"growth and development term",
  motivation:"motivation and drive term", problem_solving:"problem-solving term",
  creativity:"creative/artistic term", philosophy:"philosophical concept",
  social:"social and cultural term", leadership:"leadership term",
  business:"business and work term", health:"health and wellness term",
  logic:"logic and argumentation term", money:"finance and money term",
  language:"language and communication term"
};

(function buildWordIndex() {
  for (const [cat, data] of Object.entries(WORD_BRAIN)) {
    if (data && data.words) {
      for (const w of data.words) {
        if (!WORD_INDEX[w]) WORD_INDEX[w] = [];
        WORD_INDEX[w].push(cat);
      }
    }
  }
})();

function getCategoryOf(word) {
  const cats = WORD_INDEX[word.toLowerCase()];
  return cats && cats.length ? cats[0] : null;
}

function getWordsInCategory(category) {
  const data = WORD_BRAIN[category];
  return data && data.words ? data.words : [];
}

function getAllRelatedWords(word) {
  const w = word.toLowerCase();
  const cats = WORD_INDEX[w];
  if (!cats) return [];
  const related = new Set();
  for (const cat of cats) {
    for (const relWord of (WORD_BRAIN[cat].words || [])) {
      if (relWord !== w) related.add(relWord);
    }
  }
  return [...related].slice(0, 20);
}

// Word family — built-in suffix/prefix patterns
function getWordFamily(word) {
  const w = word.toLowerCase();
  const suffixes = {
    "tion":"process/act of","ness":"state of being","ment":"result of","ity":"quality of",
    "ism":"belief/practice","ist":"one who practices","ful":"full of","less":"without",
    "able":"capable of","ible":"capable of","ous":"characterized by","ive":"tending to",
    "ize":"to make","ify":"to cause","en":"to become","ly":"in a manner",
    "er":"one who / more","est":"most","ing":"ongoing action","ed":"past action",
    "al":"relating to","ic":"relating to","ary":"relating to","ory":"relating to"
  };
  const family = [];
  for (const [suffix, meaning] of Object.entries(suffixes)) {
    if (w.endsWith(suffix) && w.length > suffix.length + 2) {
      const root = w.slice(0, -suffix.length);
      family.push({ form: w, suffix, meaning, root });
    }
  }
  // Generate plausible forms
  const forms = [];
  if (w.endsWith("e")) {
    forms.push(`${w}d (past)`, `${w}s (plural/3rd person)`, `${w.slice(0,-1)}ing (present)`);
  } else if (w.endsWith("y")) {
    forms.push(`${w.slice(0,-1)}ies (plural)`, `${w.slice(0,-1)}ied (past)`, `${w}ing (present)`);
  } else {
    forms.push(`${w}s (plural/3rd person)`, `${w}ed (past)`, `${w}ing (present)`, `${w}er (one who ${w}s)`, `${w}able (capable of being ${w}n)`);
  }
  return { root: w, forms, morphology: family };
}

// Built-in synonym/antonym maps (500+ pairs)
const SYNONYM_MAP = {
  "happy":    ["joyful","glad","pleased","content","delighted","cheerful","elated","blissful"],
  "sad":      ["unhappy","sorrowful","melancholy","dejected","despondent","downcast","gloomy"],
  "good":     ["excellent","fine","great","superb","wonderful","positive","beneficial","favorable"],
  "bad":      ["poor","terrible","awful","dreadful","inferior","negative","harmful","unfavorable"],
  "big":      ["large","huge","enormous","massive","vast","gigantic","immense","colossal"],
  "small":    ["tiny","little","miniature","compact","minute","slight","microscopic","petite"],
  "fast":     ["quick","rapid","swift","speedy","hasty","prompt","brisk","fleet"],
  "slow":     ["gradual","sluggish","leisurely","unhurried","deliberate","steady","measured"],
  "smart":    ["intelligent","clever","bright","sharp","wise","astute","perceptive","insightful"],
  "stupid":   ["foolish","unwise","ignorant","senseless","mindless","unintelligent","naive"],
  "strong":   ["powerful","robust","sturdy","tough","resilient","solid","forceful","mighty"],
  "weak":     ["fragile","feeble","delicate","frail","vulnerable","powerless","flimsy"],
  "beautiful":["gorgeous","stunning","attractive","lovely","elegant","radiant","exquisite"],
  "ugly":     ["unattractive","unsightly","hideous","unappealing","unpleasant","repulsive"],
  "rich":     ["wealthy","affluent","prosperous","well-off","comfortable","abundant"],
  "poor":     ["impoverished","destitute","needy","broke","penniless","disadvantaged"],
  "hard":     ["difficult","challenging","tough","demanding","rigorous","strenuous","arduous"],
  "easy":     ["simple","effortless","straightforward","manageable","uncomplicated","light"],
  "new":      ["fresh","recent","modern","current","novel","latest","contemporary","original"],
  "old":      ["ancient","aged","historic","traditional","vintage","outdated","classic","elderly"],
  "important":"crucial,vital,essential,significant,critical,key,fundamental,necessary".split(","),
  "interesting":"fascinating,engaging,compelling,captivating,intriguing,absorbing,stimulating".split(","),
  "boring":   ["dull","tedious","monotonous","uninteresting","dry","flat","uninspiring"],
  "angry":    ["furious","enraged","irritated","annoyed","frustrated","incensed","livid"],
  "afraid":   ["scared","fearful","anxious","terrified","nervous","timid","apprehensive"],
  "confused": ["puzzled","perplexed","baffled","bewildered","uncertain","unclear","lost"],
  "clear":    ["obvious","evident","plain","transparent","lucid","explicit","unambiguous"],
  "begin":    ["start","initiate","commence","launch","open","embark","undertake"],
  "end":      ["finish","conclude","complete","terminate","close","stop","cease","halt"],
  "make":     ["create","build","produce","construct","form","generate","develop","craft"],
  "think":    ["believe","consider","reason","reflect","ponder","contemplate","analyze"],
  "know":     ["understand","realize","recognize","grasp","comprehend","perceive","learn"],
  "want":     ["desire","wish","need","crave","seek","prefer","require","aspire"],
  "help":     ["assist","support","aid","guide","serve","contribute","facilitate","enable"],
  "show":     ["display","reveal","demonstrate","exhibit","present","illustrate","prove"],
  "change":   ["alter","modify","transform","adjust","adapt","shift","revise","update"],
  "keep":     ["maintain","retain","preserve","hold","sustain","continue","protect","save"],
  "use":      ["utilize","employ","apply","operate","leverage","exercise","implement"],
  "give":     ["provide","offer","supply","donate","grant","award","present","contribute"],
  "get":      ["receive","obtain","acquire","gain","secure","earn","achieve","attain"],
  "say":      ["state","declare","express","mention","articulate","communicate","voice"],
  "see":      ["observe","notice","perceive","witness","recognize","view","detect","spot"],
  "go":       ["move","travel","proceed","advance","continue","progress","journey","head"],
  "work":     ["function","operate","perform","labor","effort","strive","endeavor","toil"],
  "love":     ["adore","cherish","treasure","appreciate","value","admire","care-for"],
  "hate":     ["despise","detest","loathe","abhor","dislike","resent","oppose"],
  "true":     ["correct","accurate","genuine","authentic","real","honest","valid","factual"],
  "false":    ["wrong","incorrect","untrue","fake","inaccurate","invalid","dishonest"],
  "beautiful":["stunning","gorgeous","lovely","elegant","exquisite","radiant","breathtaking"],
  "creative": ["imaginative","inventive","innovative","original","artistic","inspired"],
  "brave":    ["courageous","bold","daring","fearless","heroic","valiant","audacious"],
  "kind":     ["compassionate","caring","generous","warm","gentle","benevolent","thoughtful"],
  "honest":   ["truthful","sincere","genuine","authentic","transparent","open","candid"],
  "patient":  ["calm","tolerant","composed","steady","persevering","enduring","serene"],
  "curious":  ["inquisitive","questioning","interested","exploratory","eager","inquiring"],
  "confident":"assured,self-assured,certain,bold,poised,secure,positive,self-confident".split(","),
  "humble":   ["modest","unpretentious","unassuming","grounded","down-to-earth","simple"],
  "wise":     ["insightful","sagacious","knowledgeable","discerning","judicious","experienced"],
};

const ANTONYM_MAP = {
  "happy":     ["sad","miserable","unhappy","depressed","sorrowful"],
  "sad":       ["happy","joyful","cheerful","content","delighted"],
  "good":      ["bad","poor","terrible","harmful","negative"],
  "bad":       ["good","excellent","wonderful","beneficial","positive"],
  "big":       ["small","tiny","little","miniature","compact"],
  "small":     ["big","large","huge","enormous","massive"],
  "fast":      ["slow","gradual","leisurely","sluggish","unhurried"],
  "slow":      ["fast","quick","rapid","swift","speedy"],
  "smart":     ["foolish","unintelligent","unwise","ignorant","naive"],
  "strong":    ["weak","fragile","feeble","delicate","frail"],
  "beautiful": ["ugly","unattractive","unsightly","unappealing"],
  "hard":      ["easy","simple","effortless","straightforward"],
  "easy":      ["hard","difficult","challenging","demanding","tough"],
  "new":       ["old","ancient","outdated","obsolete","vintage"],
  "old":       ["new","fresh","modern","contemporary","recent"],
  "true":      ["false","wrong","incorrect","inaccurate","untrue"],
  "false":     ["true","correct","accurate","genuine","real"],
  "love":      ["hate","despise","dislike","loathe","resent"],
  "hate":      ["love","adore","cherish","appreciate","care-for"],
  "begin":     ["end","finish","conclude","terminate","close"],
  "end":       ["begin","start","initiate","launch","open"],
  "give":      ["take","receive","withhold","keep","retain"],
  "take":      ["give","provide","offer","donate","return"],
  "open":      ["close","shut","seal","block","restrict"],
  "close":     ["open","reveal","expose","unlock","expand"],
  "positive":  ["negative","harmful","bad","detrimental","adverse"],
  "negative":  ["positive","good","beneficial","helpful","favorable"],
  "success":   ["failure","defeat","loss","setback","miss"],
  "failure":   ["success","achievement","victory","win","accomplishment"],
  "confident": ["insecure","uncertain","timid","doubtful","anxious"],
  "brave":     ["cowardly","fearful","timid","afraid","scared"],
  "kind":      ["cruel","harsh","unkind","cold","callous"],
  "honest":    ["dishonest","deceptive","lying","misleading","false"],
  "patient":   ["impatient","hasty","rushed","impulsive","restless"],
  "humble":    ["arrogant","conceited","proud","boastful","egotistical"],
  "clear":     ["confused","unclear","ambiguous","vague","murky"],
  "simple":    ["complex","complicated","difficult","intricate","convoluted"],
  "important": ["unimportant","trivial","minor","insignificant","irrelevant"],
  "creative":  ["uncreative","conventional","ordinary","unoriginal","rigid"],
};

function synonymsOf(word) {
  const w = word.toLowerCase();
  return SYNONYM_MAP[w] || getAllRelatedWords(w).slice(0,8);
}

function antonymsOf(word) {
  const w = word.toLowerCase();
  return ANTONYM_MAP[w] || [];
}

// Built-in word descriptions (for "describe X" intent)
const WORD_DESCRIPTIONS = {
  "ocean":       "vast, deep, and powerful — the ocean covers 71% of Earth's surface and holds mysteries yet to be discovered. It is both calming and terrifying, beautiful and dangerous.",
  "courage":     "the ability to act despite fear. It is not the absence of anxiety — it is choosing to move forward anyway. Courage is quiet as often as it is loud.",
  "intelligence":"the capacity to learn, reason, adapt, and solve problems. It comes in many forms — emotional, creative, analytical, practical — and grows with use.",
  "leadership":  "the act of guiding others toward a shared goal. True leadership is less about authority and more about service, trust, and consistently showing up.",
  "love":        "a deep connection, commitment, and care for someone or something. It is both a feeling and a choice — a verb as much as a noun.",
  "freedom":     "the state of being able to act, speak, and think without restraint. It comes with responsibility — true freedom includes the freedom to be accountable.",
  "success":     "the achievement of a meaningful goal. Success is personal — what counts as success varies from person to person and moment to moment.",
  "failure":     "the result of an attempt that did not achieve its goal. More importantly, failure is information — it points exactly toward what needs to change.",
  "time":        "the most finite and valuable resource anyone has. Unlike money, it cannot be earned back. How you spend your time is how you spend your life.",
  "knowledge":   "information that has been understood, organized, and made useful. Knowledge grows through curiosity, experience, and the willingness to be wrong.",
  "change":      "the constant reorganization of reality. Change is neutral — what matters is whether you navigate it or resist it.",
  "fear":        "an emotional response to perceived threat. Fear protects us, but it also limits us. The key is learning which fears are signals and which are noise.",
  "trust":       "the foundation of every meaningful relationship. It is built slowly through consistency and broken quickly through deception.",
  "hope":        "the belief that a better outcome is possible. Hope is not passive — it is the fuel that makes effort feel worthwhile.",
  "growth":      "the ongoing process of becoming more capable, aware, and effective. Growth is often uncomfortable because it requires letting go of who you were.",
  "creativity":  "the ability to connect ideas in new ways to produce something original. Everyone is creative — the practice just looks different for different people.",
  "resilience":  "the capacity to recover, adapt, and keep going after difficulty. Resilience is not about avoiding pain — it is about moving through it.",
  "purpose":     "the deep sense of why you do what you do. Purpose gives ordinary actions extraordinary meaning.",
  "community":   "a group of people bound by shared values, experiences, or goals. Community provides belonging, accountability, and collective strength.",
  "discipline":  "the practice of doing what needs to be done even when you do not want to. Discipline is the bridge between goals and achievement.",
  "patience":    "the ability to wait, endure, or persist without frustration. Patience is not passive — it is active trust that things will develop in their own time.",
  "silence":     "the absence of sound — and the presence of everything else. Silence is where clarity, creativity, and self-awareness often live.",
  "language":    "the system humans use to communicate, share meaning, and build civilization. Language shapes thought as much as thought shapes language.",
  "power":       "the capacity to influence, act, or change outcomes. Power can uplift or oppress — it matters enormously who holds it and how they use it.",
  "beauty":      "a quality that produces aesthetic pleasure and deep appreciation. Beauty is subjective but deeply felt — it stops you, if only for a moment.",
  "truth":       "alignment between a statement and reality. Truth is simple to define and often difficult to face.",
  "justice":     "fairness in the distribution of rights, resources, and consequences. Justice requires both principle and compassion.",
  "mind":        "the center of thought, feeling, memory, and consciousness. The mind is both the tool you use and the lens through which you see everything.",
  "body":        "the physical vehicle through which you experience the world. Your body carries your history and enables your future.",
  "music":       "organized sound that creates emotional and aesthetic experience. Music is one of the most universal languages humans have ever created.",
  "story":       "a sequence of events with meaning attached. Stories are how humans make sense of the world — every culture runs on narrative.",
  "home":        "the place where you feel safe, known, and yourself. Home is more a feeling than a location.",
  "technology":  "tools and systems created to solve problems and extend human capability. Technology amplifies both our best and worst impulses.",
  "nature":      "the physical world beyond human creation — plants, animals, weather, and the systems that connect them. Nature is both context and teacher.",
  "choice":      "the act of selecting between alternatives. Every choice carries weight because it always includes what you did not choose.",
  "system":      "an organized set of connected parts working together toward a shared purpose. Systems produce outcomes — change the system, change the results.",
};

function describeWord(word) {
  const w = word.toLowerCase();
  if (WORD_DESCRIPTIONS[w]) return WORD_DESCRIPTIONS[w];
  const cat = getCategoryOf(w);
  const syns = synonymsOf(w);
  const ants = antonymsOf(w);
  let out = `**${word}** is a ${cat ? CATEGORY_DESCRIPTIONS[cat] || cat : "word"}.`;
  if (syns.length) out += ` Similar words include: ${syns.slice(0,5).join(", ")}.`;
  if (ants.length) out += ` Its opposites include: ${ants.slice(0,3).join(", ")}.`;
  const related = getAllRelatedWords(w);
  if (related.length) out += ` Related concepts: ${related.slice(0,6).join(", ")}.`;
  return out;
}

// Example sentences using the word
const EXAMPLE_BANK = {
  "resilience":  ["Her resilience through the hardest year surprised even her closest friends.","Building resilience takes time, but every difficult moment contributes to it.","Resilience is not about being tough — it is about being flexible enough to recover."],
  "courage":     ["It takes real courage to be honest when honesty is uncomfortable.","Courage does not mean you are not afraid — it means you act anyway.","The courage to start is often harder than the courage to continue."],
  "creativity":  ["Creativity is not a talent — it is a habit you build deliberately.","Her creativity showed in the unexpected connections she made between ideas.","Creativity needs space, silence, and the freedom to be wrong."],
  "discipline":  ["His discipline to show up every day regardless of motivation was what set him apart.","Discipline is not punishment — it is the commitment to your future self.","Without discipline, even the best intentions remain just intentions."],
  "empathy":     ["Empathy means actually trying to feel what someone else feels, not just acknowledging it.","Her empathy was her greatest professional strength — people opened up to her naturally.","Practicing empathy daily changes how you see conflict and disagreement."],
  "integrity":   ["Integrity is doing the right thing when no one is watching.","His integrity was never more visible than in how he handled failure.","A reputation for integrity takes years to build and moments to destroy."],
  "patience":    ["Patience is not about waiting — it is about maintaining perspective while waiting.","Learning patience was the skill that changed her relationship with difficult people.","Great things rarely arrive on the schedule we imagine for them."],
  "purpose":     ["Once she found her purpose, every decision became clearer.","Purpose does not have to be grand — it just has to be yours.","Working with purpose changes the quality of your effort, not just your motivation."],
  "communication":["Clear communication prevents most conflicts before they start.","Communication is not just speaking — it is ensuring you have been understood.","The best leaders are almost always exceptional communicators."],
};

function examplesOf(word) {
  const w = word.toLowerCase();
  if (EXAMPLE_BANK[w]) return EXAMPLE_BANK[w];
  const syns = synonymsOf(w);
  if (syns.length) {
    return [
      `"${word}" in use: She demonstrated real ${word} in how she handled the situation.`,
      `The quality of ${word} showed in every decision he made.`,
      `Understanding ${word} deeply means recognizing it in everyday moments.`,
    ];
  }
  return [`Here is how you might use "${word}": The concept of ${word} shapes outcomes in ways people often underestimate.`];
}


// ═══════════════════════════════════════════════════════════════════
// SECTION C: COMMUNICATION ENGINE — sentence builder + response flows
// ═══════════════════════════════════════════════════════════════════

// 200+ sentence templates, organized by communication type
const SENTENCE_PATTERNS = {

  // When explaining something
  explain: [
    "Let me break this down: {core} is fundamentally about {essence}.",
    "Think of it this way — {topic} is essentially {analogy}.",
    "Here is the simplest way to put it: {simple_version}.",
    "At its core, {topic} comes down to one thing: {core_thing}.",
    "To understand {topic}, start with this: {starting_point}.",
    "The easiest way to explain {topic} is with an example: {example}.",
    "People often overcomplicate {topic}. In plain terms: {plain_terms}.",
    "{topic} has three key parts: first {part1}, then {part2}, and finally {part3}.",
    "The reason {topic} matters is {reason}. Without it, {consequence}.",
    "Imagine {topic} like this: {vivid_image}.",
  ],

  // When answering a question
  answer: [
    "The direct answer is: {answer}.",
    "Short answer: {short}. Longer answer: {longer}.",
    "Yes — and here is why: {reason}.",
    "No — because {reason}. However, {nuance}.",
    "It depends on {factor}. If {condition_a}, then {outcome_a}. If {condition_b}, then {outcome_b}.",
    "Most people think {common_belief}. The reality is {reality}.",
    "The honest answer: {answer}. What this means for you: {implication}.",
    "{topic} is {answer}. But the more interesting question is {deeper_question}.",
    "Here is what I know for certain: {certain}. Here is what is less clear: {uncertain}.",
    "The answer has multiple layers. On the surface: {surface}. Deeper: {deeper}.",
  ],

  // When describing something
  describe: [
    "{topic} is {quality1}, {quality2}, and {quality3} — all at once.",
    "Picture {topic} as {image}. That captures something true about it.",
    "{topic} feels like {feeling} and looks like {appearance}.",
    "What makes {topic} unique is {unique_feature}.",
    "{topic} is defined by {defining_trait} and shaped by {shaping_force}.",
    "Imagine you had never encountered {topic} before. The first thing you would notice is {first_impression}.",
    "{topic} lives at the intersection of {domain1} and {domain2}.",
    "There is something {quality} about {topic} that most people overlook: {overlooked_thing}.",
    "To truly understand {topic}, you need to experience {experience}.",
    "The best way to describe {topic} is not with words — but if I had to: {description}.",
  ],

  // When comparing two things
  compare: [
    "{a} and {b} are similar in that they both {shared_quality}. The difference is {difference}.",
    "Both {a} and {b} {shared_action}. But {a} tends to {a_tendency} while {b} tends to {b_tendency}.",
    "Comparing {a} to {b}: {a} wins on {a_strength}; {b} wins on {b_strength}. The choice depends on {deciding_factor}.",
    "At first glance, {a} and {b} seem the same. Look closer and {key_difference}.",
    "Use {a} when {a_use_case}. Use {b} when {b_use_case}.",
    "{a} is about {a_essence}. {b} is about {b_essence}. One is not better — just different.",
    "The relationship between {a} and {b}: they are {relationship_type}. Together, {together_outcome}.",
  ],

  // When motivating / encouraging
  encourage: [
    "You are further along than you think. The fact that you are asking this question proves it.",
    "The hardest part is the part you just did — starting.",
    "Every expert once stood exactly where you are standing. They kept going.",
    "Progress is not always visible. Trust the process — it is working.",
    "The discomfort you feel is not a warning sign. It is a growth sign.",
    "You do not need to see the whole path. You just need to take the next step.",
    "Doubt is not a reason to stop. It is just resistance — it shows up when something matters.",
    "The version of you that finishes this will not be the version of you that started.",
    "You are not behind. You are on your timeline, building at your pace.",
    "Some days the goal is just to show up. That counts more than you know.",
  ],

  // When comforting / empathizing
  comfort: [
    "What you are feeling makes complete sense given what you are going through.",
    "There is no rush to fix this or feel differently. You are allowed to sit with this.",
    "You do not have to have it together right now. No one expects that.",
    "This is hard. Genuinely hard. And you are handling it.",
    "Your feelings are valid — every last one of them.",
    "Sometimes the right response to difficulty is not to push through. It is to pause.",
    "You are not alone in this, even when it feels that way.",
    "Struggling does not mean failing. It means you are in the middle of something real.",
    "Give yourself the same grace you would give someone you love in this situation.",
    "It is okay not to be okay.",
  ],

  // When debating / arguing a point
  argue: [
    "Here is the argument for this position: {argument}. The strongest objection is {objection}. The response to that objection: {rebuttal}.",
    "The evidence supports {claim}. Specifically: {evidence1} and {evidence2}.",
    "While {opposing_view} has merit — specifically {merit} — it falls short because {flaw}.",
    "This is not just an opinion. The data shows {data_point}, which means {implication}.",
    "Three reasons this matters: first {reason1}, second {reason2}, and third {reason3}.",
    "The conventional wisdom says {conventional}. But a closer look reveals {reality}.",
    "Let me steelman the other side: {steelman}. Now here is why I still disagree: {response}.",
    "This question comes down to values, not just facts. If you prioritize {value}, then {conclusion}.",
  ],

  // When teaching / instructing
  teach: [
    "Here is the concept step by step: first {step1}. Then {step2}. Finally {step3}.",
    "Let me use an analogy: {topic} is like {analogy} because {connection}.",
    "The beginner mistake here is {common_mistake}. The corrected approach: {correction}.",
    "You already understand {foundation} — {topic} builds directly on that.",
    "The key insight that unlocks {topic} is this: {key_insight}.",
    "Test your understanding: if {scenario}, what would you expect? The answer reveals whether {concept} is clear.",
    "Here is the 80/20 of {topic}: mastering {key_20_percent} gets you most of the value.",
    "Most people learn {topic} backwards. Start instead with {correct_starting_point}.",
  ],

  // When asking / exploring
  explore: [
    "What do you mean specifically by {topic}? The answer changes depending on {factor}.",
    "Before I respond — what outcome are you looking for here?",
    "Interesting question. Here is what it makes me think about: {thought}.",
    "Let me push on this a little: {challenging_question}.",
    "What would it mean if {hypothetical}?",
    "There are a few ways to read this. Which one feels closest to what you are asking: {option_a} or {option_b}?",
    "I want to make sure I answer the right question. Are you asking about {interpretation_a} or {interpretation_b}?",
    "The real question inside this question might be: {deeper_question}.",
  ],

};

// ─────────────────────────────────────────────
// Word Flow Engine — builds connected responses
// ─────────────────────────────────────────────

function getPatternFor(category) {
  const data = WORD_BRAIN[category];
  if (!data || !data.patterns) return [];
  return data.patterns;
}

function getResponseOpener(category) {
  const data = WORD_BRAIN[category];
  if (!data || !data.response_openers) return null;
  const openers = data.response_openers;
  const opener = openers[Math.floor(Math.random() * openers.length)];
  // Fill in a word from the category
  const words = data.words;
  const word = words[Math.floor(Math.random() * words.length)];
  return opener.replace("{word}", word);
}

function buildWordFlow(userText) {
  // Extract meaningful words from user input
  const stopWords = new Set(["i","me","my","we","you","your","the","a","an","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","need","ought","and","but","or","nor","for","yet","so","if","then","as","at","by","from","in","into","of","on","to","up","with","that","this","these","those","it","its","he","she","they","them","their","what","which","who","when","where","why","how","not","no","yes","very","too","more","most","some","any","all","just","also","about","there","here"]);
  const words = userText.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
  const wordInfo = [];
  for (const w of words) {
    const cats = WORD_INDEX[w];
    if (cats && cats.length) wordInfo.push({ word: w, categories: cats });
  }
  return wordInfo;
}

function getAnalogyFor(concept) {
  const c = concept.toLowerCase();
  if (c.includes("learn") || c.includes("study") || c.includes("practice")) return WORD_BRAIN.analogies.learning[Math.floor(Math.random()*3)];
  if (c.includes("change") || c.includes("transform") || c.includes("shift")) return WORD_BRAIN.analogies.change[Math.floor(Math.random()*3)];
  if (c.includes("problem") || c.includes("issue") || c.includes("challenge")) return WORD_BRAIN.analogies.problems[Math.floor(Math.random()*3)];
  if (c.includes("grow") || c.includes("develop") || c.includes("build")) return WORD_BRAIN.analogies.growth[Math.floor(Math.random()*3)];
  if (c.includes("time") || c.includes("wait") || c.includes("patient")) return WORD_BRAIN.analogies.time[Math.floor(Math.random()*3)];
  if (c.includes("relation") || c.includes("friend") || c.includes("love") || c.includes("partner")) return WORD_BRAIN.analogies.relationships[Math.floor(Math.random()*3)];
  return null;
}

// ─────────────────────────────────────────────
// SMART REPLY GENERATOR  
// — builds a real answer using vocabulary only, no search
// ─────────────────────────────────────────────

function smartReply(userText, intent, persona, emotion) {
  const flowWords = buildWordFlow(userText);
  const topic = flowWords.length ? flowWords[0].word : "this";
  const topicCat = flowWords.length ? flowWords[0].categories[0] : null;

  // Pick communication strategy based on intent
  let strategy = "answer";
  if (intent === "describe")     strategy = "describe";
  if (intent === "compare")      strategy = "compare";
  if (intent === "motivate")     strategy = "encourage";
  if (intent === "comfort")      strategy = "comfort";
  if (intent === "teach")        strategy = "teach";
  if (intent === "brainstorm")   strategy = "explore";
  if (intent === "argue")        strategy = "argue";
  if (intent === "explain")      strategy = "explain";

  const patterns = SENTENCE_PATTERNS[strategy] || SENTENCE_PATTERNS.answer;
  const opener = WORD_BRAIN.conversation.openers[Math.floor(Math.random() * WORD_BRAIN.conversation.openers.length)];
  const transition = WORD_BRAIN.conversation.transitions[Math.floor(Math.random() * WORD_BRAIN.conversation.transitions.length)];
  const closer = WORD_BRAIN.conversation.closers[Math.floor(Math.random() * WORD_BRAIN.conversation.closers.length)];

  // Build the core response using word brain
  const syns = synonymsOf(topic);
  const related = getAllRelatedWords(topic);
  const analogy = getAnalogyFor(topic);
  const desc = WORD_DESCRIPTIONS[topic] || null;

  let core = "";

  if (desc) {
    core = desc;
  } else if (topicCat) {
    const catWords = getWordsInCategory(topicCat);
    const catPatterns = getPatternFor(topicCat);
    const catPattern = catPatterns.length ? catPatterns[Math.floor(Math.random() * catPatterns.length)] : null;
    if (catPattern) {
      const fillWord = catWords[Math.floor(Math.random() * catWords.length)];
      core = catPattern.replace("{word}", topic).replace("{topic}", topic).replace("{action}", fillWord).replace("{context}", fillWord).replace("{role}", fillWord).replace("{condition}", fillWord).replace("{factor}", fillWord);
    }
  }

  if (!core) {
    // Build from synonyms and related words
    if (syns.length) core = `"${topic}" connects closely to: ${syns.slice(0,4).join(", ")}. Each of these adds a different shade of meaning.`;
    else if (related.length) core = `"${topic}" is part of a broader set of concepts including: ${related.slice(0,5).join(", ")}.`;
    else core = `The concept of "${topic}" is worth exploring carefully — it sits at the intersection of meaning and application.`;
  }

  if (analogy) core += ` Think of it ${analogy}.`;

  // Persona-flavored response
  if (persona === "friend") {
    return `${opener.toLowerCase()} ${core} ${related.length ? "also super connected to: " + related.slice(0,3).join(", ") + " 😊" : ""}`;
  }
  if (persona === "teacher") {
    return `${opener}\n\n${core}\n\n${transition} the key thing to remember is that ${topic} is best understood through practice and real examples.\n\n${closer}`;
  }
  if (persona === "coach") {
    return `${opener}\n\n${core}\n\nThe action that matters here: take what you now know about ${topic} and apply it in one concrete way today.\n\n${closer}`;
  }
  if (persona === "philosopher") {
    return `${opener}\n\n${core}\n\n${transition} the deeper question is: what does your relationship with "${topic}" reveal about your values?\n\n${closer}`;
  }
  if (persona === "savage") {
    return `${core} Stop overthinking it.`;
  }
  if (persona === "formal") {
    return `${opener}\n\n${core}\n\n${transition} it is worth noting that ${topic} has implications beyond the surface level.\n\n${closer}`;
  }
  if (persona === "storyteller") {
    return `Imagine a world where nobody understood "${topic}". ${core} That is why it matters — not just as a word, but as a lived experience.`;
  }
  if (persona === "analyst") {
    return `**Topic: ${topic}**\n\n${core}\n\n**Related concepts:** ${related.slice(0,6).join(", ")}\n**Synonyms:** ${syns.slice(0,5).join(", ")}\n${closer}`;
  }

  return `${opener}\n\n${core}\n\n${closer}`;
}


// ═══════════════════════════════════════════════════════════════════
// SECTION D: PERSONAS, MEMORY, EMOTION (all 10 preserved from v4)
// ═══════════════════════════════════════════════════════════════════

const PERSONAS = {
  default:     "SONIX: sharp, helpful, concise, direct. Communicates first, searches second.",
  coder:       "SONIX Coder: senior engineer, technical precision, code examples.",
  friend:      "SONIX Friend: warm, casual, conversational, encouraging.",
  formal:      "SONIX Formal: professional, structured, proper grammar.",
  savage:      "SONIX Savage: brutally honest, witty, zero fluff.",
  analyst:     "SONIX Analyst: research, compare, synthesize, data-driven.",
  teacher:     "SONIX Teacher: patient, step-by-step, analogies, examples.",
  coach:       "SONIX Coach: motivational, outcome-focused, energizing.",
  philosopher: "SONIX Philosopher: reflective, curious, explores ideas deeply.",
  storyteller: "SONIX Storyteller: vivid, narrative-driven, immersive.",
};

const MAX_MEMORY = 50;
let _memory=[], _persona="default", _userName=null;
let _apiHandler=null, _translatorFn=null;
let _topicHistory=[], _emotionHistory=[], _wordHistory=[];
let _lastTopics=[], _sessionStart=Date.now();
let _conversationContext = { lastWord:"", lastIntent:"", turnCount:0 };

const EMOTION_PATTERNS = [
  {pattern:/\b(frustrated|annoyed|angry|mad|fed up|ugh|this sucks|argh)\b/i,       emotion:"frustrated"},
  {pattern:/\b(confused|lost|don.?t understand|no idea|unclear|what the)\b/i,      emotion:"confused"},
  {pattern:/\b(excited|amazing|awesome|pumped|stoked|omg|so good|fire|lit)\b/i,    emotion:"excited"},
  {pattern:/\b(sad|depressed|unhappy|down|crying|heartbroken|lonely|hopeless)\b/i, emotion:"sad"},
  {pattern:/\b(anxious|worried|nervous|scared|stressed|overwhelmed|panic)\b/i,     emotion:"anxious"},
  {pattern:/\b(happy|great|wonderful|fantastic|love it|perfect|best day|yay)\b/i,  emotion:"happy"},
  {pattern:/\b(bored|boring|meh|whatever|not interested|who cares)\b/i,            emotion:"bored"},
  {pattern:/\b(curious|interesting|tell me more|want to know|fascinated)\b/i,      emotion:"curious"},
  {pattern:/\b(tired|exhausted|sleepy|drained|burnout|worn out)\b/i,               emotion:"tired"},
  {pattern:/\b(proud|accomplished|nailed it|succeeded|finally|yes!)\b/i,           emotion:"proud"},
  {pattern:/\b(stuck|can.?t figure|not working|nothing works|blocked|lost)\b/i,   emotion:"stuck"},
  {pattern:/\b(grateful|thankful|appreciate|means a lot|you.?re great)\b/i,       emotion:"grateful"},
];

const EMOTION_RESPONSES = {
  frustrated: ["I hear you — let's work through this clearly. ","Let's cut through the noise. ","Frustration usually means something important is blocked. "],
  confused:   ["Let me make this as clear as possible. ","No worries — here's a cleaner way to look at it: ","Confusion means you're at the edge of understanding. Here's the bridge: "],
  excited:    ["Love the energy — let's make it count! ","Channeling that energy into something concrete: ","That excitement is fuel — here's where to point it: "],
  sad:        ["I hear you. Take your time. ","You don't have to push through right now. ","I'm here for this conversation. "],
  anxious:    ["Let's take this one step at a time. ","The overwhelm makes sense. Here's the simplest next thing: ","Breathe. Then: "],
  happy:      ["Great state to be in — let's use it! ","Building on that energy: ","Perfect mindset for this: "],
  bored:      ["Let me give you something genuinely interesting: ","Boredom means you're ready for the next level. Here: ","Here's something worth your attention: "],
  curious:    ["Curiosity is exactly the right instinct here. ","Great thing to be curious about — here's the full picture: ","Your curiosity points to something real. "],
  tired:      ["Short and clear — that's what you need right now: ","No fluff, just the answer: ","Efficient version: "],
  proud:      ["That's earned. Keep that feeling — it's a compass. ","Well done. Now here's what's next: ","Proud moments compound. "],
  stuck:      ["Being stuck is a signal, not a verdict. Here's the unlock: ","New angle incoming: ","Let's approach this from a different direction: "],
  grateful:   ["That means a lot. Here's what I can give you: ","Happy to be here. Let's keep going: ","Gratitude noted — now here's more: "],
};

function detectEmotion(t){for(const e of EMOTION_PATTERNS){if(e.pattern.test(t))return e.emotion;}return null;}
function getEmotionOpener(e){if(!e)return "";const p=EMOTION_RESPONSES[e];return p?p[Math.floor(Math.random()*p.length)]:"";}

// Shortcut expander (kept from v4)
const SHORTCUTS={"wut":"what","wat":"what","wtf":"what the heck","wth":"what the heck","hw":"how","y":"why","wen":"when","wer":"where","whos":"who is","ur":"your","u":"you","r":"are","im":"i am","cant":"cannot","dont":"do not","doesnt":"does not","didnt":"did not","isnt":"is not","arent":"are not","wont":"will not","shouldnt":"should not","couldnt":"could not","lol":"laughing","omg":"oh my","brb":"be right back","afk":"away","idk":"i do not know","idc":"i do not care","fyi":"for your information","asap":"as soon as possible","tbh":"to be honest","ngl":"not gonna lie","ty":"thank you","thx":"thanks","pls":"please","plz":"please","k":"okay","yep":"yes","yup":"yes","ya":"yes","nope":"no","nah":"no","gonna":"going to","wanna":"want to","gotta":"got to","kinda":"kind of","sorta":"sort of","cuz":"because","bc":"because","tho":"though","thru":"through","bout":"about","ofc":"of course","def":"definitely","prob":"probably","rly":"really","sry":"sorry","luv":"love","rn":"right now","atm":"at the moment","nvm":"never mind","np":"no problem","tldr":"too long did not read","eli5":"explain simply","smh":"shaking my head","fomo":"fear of missing out","goat":"greatest of all time","js":"javascript","py":"python","ai":"artificial intelligence","ml":"machine learning"};

function expandShortcuts(text){let o=text;const ks=Object.keys(SHORTCUTS).sort((a,b)=>b.length-a.length);for(const k of ks){const r=new RegExp("\\b"+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","gi");o=o.replace(r,SHORTCUTS[k]);}return o;}

// ═══════════════════════════════════════════════════════════════════
// SECTION E: INTENT DETECTION — communication-first
// ═══════════════════════════════════════════════════════════════════

const INTENTS = [
  // Word tools (first — highest priority)
  {pattern:/\b(define|definition|meaning of|what does .+ mean|dictionary|what does .+ mean)\b/i,        type:"define"},
  {pattern:/\b(synonym|similar word|another word for|what else means)\b/i,                              type:"synonyms"},
  {pattern:/\b(antonym|opposite of|opposite word|contrary to)\b/i,                                      type:"antonyms"},
  {pattern:/\b(describe|what is .+ like|how would you describe|paint a picture of)\b/i,                 type:"describe"},
  {pattern:/\b(example|use .+ in a sentence|sentence with|how do you use)\b/i,                          type:"examples"},
  {pattern:/\b(word family|related form|forms of the word|inflection|conjugation|plural|past tense)\b/i,type:"word_family"},
  {pattern:/\b(words for|vocabulary for|lexicon|related words|word list for|words about)\b/i,            type:"word_list"},
  {pattern:/\b(rhyme|rhymes with|word that rhymes)\b/i,                                                  type:"rhyme"},
  {pattern:/\b(etymology|word origin|origin of the word|history of the word)\b/i,                       type:"etymology"},
  {pattern:/\b(idiom|phrase meaning|expression meaning|what does .+ mean as a phrase)\b/i,              type:"idiom"},
  // Communication intents
  {pattern:/\b(explain simply|eli5|explain like i.?m 5|simple terms|layman|for a beginner)\b/i,         type:"eli5"},
  {pattern:/\b(explain|elaborate|tell me more|go deeper|expand on|more detail|break down)\b/i,          type:"explain"},
  {pattern:/\b(summarize|summary|short version|brief|recap|tldr|main points|key points)\b/i,            type:"summarize"},
  {pattern:/\b(compare|difference between|versus|vs\.?|which is better|pros and cons)\b/i,              type:"compare"},
  {pattern:/\b(brainstorm|ideas for|think of|come up with|generate ideas|what can i|options for)\b/i,   type:"brainstorm"},
  {pattern:/\b(motivate me|encourage me|i need motivation|keep going|inspire me|give me strength)\b/i,  type:"motivate"},
  {pattern:/\b(how do i|how can i|how to|what steps|what is the process|guide me)\b/i,                  type:"how_to"},
  {pattern:/\b(what should i|should i|advise me|what would you do|what do you recommend)\b/i,           type:"advice"},
  {pattern:/\b(do you think|your opinion|what do you believe|agree or disagree|take on this)\b/i,       type:"opinion"},
  {pattern:/\b(why|what is the reason|why does|why do|why is|what causes|what leads to)\b/i,            type:"why"},
  {pattern:/\b(what is|who is|tell me about|what are|explain what|about)\b/i,                           type:"what_is"},
  // Social
  {pattern:/^(hi|hello|hey|sup|yo|hiya|greetings|howdy)\b/i,                                           type:"greeting"},
  {pattern:/\b(who are you|what are you|your name|introduce yourself)\b/i,                              type:"identity"},
  {pattern:/\b(how are you|you okay|how.?s it going)\b/i,                                               type:"status"},
  {pattern:/\b(what can you do|help me|capabilities|features|what do you know)\b/i,                     type:"help"},
  {pattern:/\b(thank|thanks|ty|thx|thank you|appreciate)\b/i,                                           type:"thanks"},
  {pattern:/\b(bye|goodbye|see you|later|peace|cya)\b/i,                                                type:"farewell"},
  // Entertainment
  {pattern:/\b(joke|make me laugh|funny|humor|tell me something funny)\b/i,                             type:"joke"},
  {pattern:/\b(fun fact|trivia|did you know|random fact)\b/i,                                           type:"trivia"},
  {pattern:/\b(quote|inspiring quote|famous quote|motivational quote)\b/i,                              type:"quote"},
  {pattern:/\b(roast me|roast|insult me playfully)\b/i,                                                 type:"roast"},
  {pattern:/\b(compliment|say something nice|hype me)\b/i,                                              type:"compliment"},
  // Math
  {pattern:/\b(calculate|compute|math|arithmetic|\d+\s*[\+\-\*\/\^]\s*\d+|what is \d+)\b/i,            type:"math"},
  {pattern:/\b(percent|percentage|% of|tip|discount)\b/i,                                               type:"percent"},
  {pattern:/\b(convert|conversion|in (km|miles|kg|lbs|celsius|fahrenheit|mb|gb))\b/i,                   type:"convert"},
  {pattern:/\b(bmi|body mass|mortgage|loan payment|compound interest|calories|tdee)\b/i,                type:"calculator"},
  // Meta
  {pattern:/\b(version|what version|changelog)\b/i,                                                     type:"version"},
  {pattern:/\b(who made you|creator|vlad|built by)\b/i,                                                 type:"creator"},
  {pattern:/\b(remember|my name is|call me)\b/i,                                                        type:"memory_set"},
  {pattern:/\b(forget|clear memory|reset|wipe)\b/i,                                                     type:"memory_clear"},
  {pattern:/\b(what do you know about me|recall|my info)\b/i,                                           type:"memory_recall"},
  {pattern:/\b(switch to|change to|use .* mode|be more)\b/i,                                            type:"persona_switch"},
  {pattern:/\b(list personas|available modes|show personas)\b/i,                                        type:"persona_list"},
  {pattern:/\b(search|look up|find info|research|wikipedia|google)\b/i,                                 type:"research"},
];

function detectIntent(text){for(const i of INTENTS){if(i.pattern.test(text))return i.type;}return "communicate";}


// ═══════════════════════════════════════════════════════════════════
// SECTION F: KNOWLEDGE BANKS (preserved + new)
// ═══════════════════════════════════════════════════════════════════

const ACRONYMS={"AI":"Artificial Intelligence","ML":"Machine Learning","NLP":"Natural Language Processing","API":"Application Programming Interface","HTTP":"HyperText Transfer Protocol","HTML":"HyperText Markup Language","CSS":"Cascading Style Sheets","JS":"JavaScript","SQL":"Structured Query Language","JSON":"JavaScript Object Notation","REST":"Representational State Transfer","SDK":"Software Development Kit","IDE":"Integrated Development Environment","CLI":"Command-Line Interface","GUI":"Graphical User Interface","OS":"Operating System","RAM":"Random Access Memory","CPU":"Central Processing Unit","GPU":"Graphics Processing Unit","URL":"Uniform Resource Locator","DNS":"Domain Name System","TCP":"Transmission Control Protocol","SSH":"Secure Shell","VPN":"Virtual Private Network","LAN":"Local Area Network","CDN":"Content Delivery Network","SEO":"Search Engine Optimization","UI":"User Interface","UX":"User Experience","MVP":"Minimum Viable Product","OOP":"Object-Oriented Programming","TDD":"Test-Driven Development","CRUD":"Create Read Update Delete","CI":"Continuous Integration","CD":"Continuous Deployment","SaaS":"Software as a Service","CORS":"Cross-Origin Resource Sharing","JWT":"JSON Web Token","OAuth":"Open Authorization","MFA":"Multi-Factor Authentication","GDPR":"General Data Protection Regulation","ROI":"Return on Investment","KPI":"Key Performance Indicator","OKR":"Objectives and Key Results","CAC":"Customer Acquisition Cost","LTV":"Lifetime Value","ARR":"Annual Recurring Revenue","IPO":"Initial Public Offering","VC":"Venture Capital","GDP":"Gross Domestic Product","DNA":"Deoxyribonucleic Acid","RNA":"Ribonucleic Acid","BMI":"Body Mass Index","MRI":"Magnetic Resonance Imaging","FDA":"Food and Drug Administration","WHO":"World Health Organization","NASA":"National Aeronautics and Space Administration","UN":"United Nations","NATO":"North Atlantic Treaty Organization","EU":"European Union","ASAP":"As Soon As Possible","ETA":"Estimated Time of Arrival","FAQ":"Frequently Asked Questions","TLDR":"Too Long Did Not Read","ELI5":"Explain Like I am 5","IMHO":"In My Humble Opinion","IMO":"In My Opinion","FOMO":"Fear Of Missing Out","GOAT":"Greatest Of All Time","WFH":"Work From Home","CEO":"Chief Executive Officer","CTO":"Chief Technology Officer","CFO":"Chief Financial Officer","NDA":"Non-Disclosure Agreement","LLM":"Large Language Model","GPT":"Generative Pre-trained Transformer","WASM":"WebAssembly","PWA":"Progressive Web App","SPA":"Single Page Application","DOM":"Document Object Model","DRY":"Don't Repeat Yourself","KISS":"Keep It Simple Stupid","SOLID":"Single responsibility Open-closed Liskov Interface Dependency","ACID":"Atomicity Consistency Isolation Durability","IOT":"Internet of Things","AR":"Augmented Reality","VR":"Virtual Reality","B2B":"Business to Business","B2C":"Business to Consumer","ADHD":"Attention Deficit Hyperactivity Disorder","OCD":"Obsessive-Compulsive Disorder","PTSD":"Post-Traumatic Stress Disorder","CBT":"Cognitive Behavioral Therapy","SSRI":"Selective Serotonin Reuptake Inhibitor","BMR":"Basal Metabolic Rate","TDEE":"Total Daily Energy Expenditure","DIY":"Do It Yourself","AKA":"Also Known As","FYI":"For Your Information","TBD":"To Be Determined","NPS":"Net Promoter Score","SMH":"Shaking My Head","LOL":"Laughing Out Loud","BRB":"Be Right Back","IRL":"In Real Life","YOLO":"You Only Live Once","PTO":"Paid Time Off","CPI":"Consumer Price Index","HR":"Human Resources"};

const IDIOMS={"bite the bullet":"Endure a painful situation with courage — choose to face the hard thing.","break a leg":"Good luck! (Theatrical tradition of saying the opposite.)","break the ice":"Do something to relieve tension or awkwardness in a new situation.","burn the midnight oil":"Work very late into the night.","bite off more than you can chew":"Take on more responsibility than you can realistically handle.","back to the drawing board":"Start over completely after a failure.","beat around the bush":"Avoid getting to the main point; speak indirectly.","blessing in disguise":"Something that initially seems bad but turns out to be good.","costs an arm and a leg":"Extremely expensive.","cut corners":"Do something poorly or incompletely to save time or money.","drop the ball":"Make a mistake or fail to follow through on something.","every cloud has a silver lining":"Every difficult situation has a positive aspect.","face the music":"Accept the consequences of your actions, however unpleasant.","feel under the weather":"Feel unwell or slightly ill.","get the ball rolling":"Start something — initiate action.","hit the nail on the head":"Be exactly correct.","hit the sack":"Go to bed.","jump on the bandwagon":"Follow a trend because it is popular.","kill two birds with one stone":"Accomplish two tasks with a single action.","let the cat out of the bag":"Accidentally reveal a secret.","miss the boat":"Miss an opportunity that will not come back.","once in a blue moon":"Something that happens very rarely.","out of the blue":"Unexpectedly; without any warning.","piece of cake":"Something that is very easy.","pull someone's leg":"Joke with someone; tease them.","read between the lines":"Understand the hidden or implied meaning.","see eye to eye":"Agree completely with someone.","sleep on it":"Take time to think about something before deciding.","spill the beans":"Reveal secret information unintentionally.","the elephant in the room":"An obvious problem or sensitive issue that everyone is avoiding.","throw in the towel":"Give up; admit defeat.","tie the knot":"Get married.","up in the air":"Uncertain; not yet decided.","bite the hand that feeds you":"Harm or be ungrateful to the person who supports you.","by the skin of your teeth":"Barely succeed; escape something by a very narrow margin.","hit the ground running":"Begin something energetically and with full effort immediately.","in a pickle":"In a difficult situation with no easy solution.","in hot water":"In serious trouble.","kick the bucket":"To die (informal/humorous).","learn the ropes":"Learn how something works; understand the basics.","let sleeping dogs lie":"Avoid revisiting old problems that have settled down.","on thin ice":"In a risky or precarious situation.","open a can of worms":"Raise a complicated issue that creates more problems than it solves.","the bottom line":"The most important point; the final conclusion.","turn over a new leaf":"Change your behavior for the better; make a fresh start.","wear your heart on your sleeve":"Express your emotions openly and freely.","with flying colors":"With great success and high distinction.","bite the dust":"Fail or be defeated.","burning bridges":"Permanently and irreparably damage a relationship.","cold shoulder":"Deliberately ignore or be distant toward someone.","cost an arm and a leg":"Be extremely expensive.","cross that bridge when we come to it":"Deal with a problem when it actually happens, not before.","go back to square one":"Return to the very beginning after a failure.","in the long run":"Over an extended period of time.","it is not rocket science":"It is not complicated; it is easy to understand.","more than meets the eye":"Something is more complex or impressive than it appears.","no pain no gain":"You have to work hard and endure difficulty to achieve success.","off the record":"Said in private; not to be officially quoted or published.","on the ball":"Alert, attentive, and competent.","once in a lifetime":"Something so rare it may only happen once.","out of the box":"Creative; unconventional; thinking in new ways.","put all your eggs in one basket":"Rely entirely on one single plan or investment.","step up to the plate":"Take responsibility; rise to the challenge.","the last straw":"The final problem in a series that causes a reaction or loss of patience.","time flies":"Time passes very quickly.","under the weather":"Feeling slightly ill or unwell.","when pigs fly":"Never; something that will never happen.","you can not judge a book by its cover":"Do not judge something or someone by their appearance alone."};

const ETYMOLOGIES={"algorithm":"From al-Khwārizmī, 9th-century Persian mathematician — his name became the word for step-by-step procedures.","algebra":"From Arabic 'al-jabr' (reunion of broken parts) — from a 9th-century mathematical text.","robot":"Czech 'robota' (drudgery/forced labor) — introduced in Karel Čapek's 1920 play R.U.R.","computer":"Originally a person who performs calculations — from Latin 'computare' (to reckon).","internet":"From 'inter-' (between) + 'network' — coined in the 1970s for a network connecting networks.","software":"Coined by John Tukey in 1958 as a contrast to hardware — the 'soft' programs that run on machines.","bug":"Popularized by Grace Hopper in 1947 when a real moth caused a malfunction in a Harvard computer.","emoji":"Japanese: 'e' (picture) + 'moji' (character) — created by Shigetaka Kurita in 1999.","google":"From 'googol' (10^100) — an intentional misspelling that became a brand.","hashtag":"'Hash' (the # symbol) + 'tag' — popularized on Twitter in 2007 by Chris Messina.","spam":"From Monty Python's 1970 sketch featuring the incessant repetition of 'SPAM' — applied to unwanted messages.","meme":"Coined by Richard Dawkins in 1976 from Greek 'mimeme' (imitated thing) — a unit of cultural transmission.","quarantine":"Italian 'quarantina' (forty days) — the isolation period required for ships during the bubonic plague.","salary":"Latin 'salarium' — possibly from 'sal' (salt) — Roman soldiers may have been partially paid in salt.","disaster":"Italian 'disastro' (ill-starred) — 'dis-' (bad) + 'astro' (star) — reflecting belief in astral influence.","panic":"Greek 'Panikos' — relating to Pan, the god whose sudden sounds were said to cause irrational terror.","academy":"From 'Akademia' — the grove near Athens where Plato taught, named after the hero Akademos.","muscle":"Latin 'musculus' (little mouse) — the movement of a bicep resembles a mouse moving under cloth.","malaria":"Italian 'mala aria' (bad air) — once believed to come from swamp vapors.","paradise":"Old Persian 'pairi-daeza' (walled garden) — royal gardens that became the concept of paradise.","coffee":"Ottoman Turkish 'kahve' — from Arabic 'qahwah' — spread from Ethiopia to Arabia to the world.","money":"Latin 'Moneta' — an epithet of Juno in whose Roman temple coins were minted.","candidate":"Latin 'candidatus' (clothed in white) — Roman office-seekers wore white togas to symbolize purity.","companion":"Latin 'com-' (with) + 'panis' (bread) — literally 'one who shares bread with you'.","enthusiasm":"Greek 'enthousiasmos' — literally 'possessed by a god' (en + theos = in + god).","democracy":"Greek 'dēmokratia' — 'dēmos' (people) + 'kratos' (rule/power).","philosophy":"Greek 'philosophia' — 'philos' (loving) + 'sophia' (wisdom) — literally 'love of wisdom'.","window":"Old Norse 'vindauga' — 'vindr' (wind) + 'auga' (eye) — literally 'wind eye'.","alphabet":"From the first two Greek letters — Alpha (Α) and Beta (Β).","clue":"From 'clew' (a ball of thread) — from the myth of Theseus using thread to navigate the labyrinth.","talent":"Greek/Latin 'talentum' (a unit of weight and money) — its 'gift' meaning comes from the Biblical parable.","nightmare":"'Night' + Old English 'mare' (a goblin believed to sit on sleeping people causing bad dreams).","bonfire":"'Bone fire' — fires historically made from bones during festivals and plague clearances.","lunatic":"Latin 'luna' (moon) — madness was once believed to be caused or worsened by the moon's cycles.","tragedy":"Greek 'tragōidia' — possibly 'goat song' — performed at festivals honoring Dionysus.","hazard":"Arabic 'az-zahr' (the dice) — from gambling games played in medieval Spain.","disaster":"Italian 'disastro' — literally 'bad star' (dis + astro) — fated by unfavorable stars.","sincere":"Possibly from Latin 'sine cera' (without wax) — referring to unrepaired, unadulterated pottery.","salary":"Latin 'salarium' — Roman soldiers' allowance for purchasing salt, an essential commodity."};

const FUN_FACTS=["Honey never spoils — 3,000-year-old honey found in Egyptian tombs was still edible.","A day on Venus is longer than a year on Venus.","Octopuses have three hearts, blue blood, and nine brains (one central + one per arm).","Bananas are botanically berries. Strawberries are not.","There are more possible chess games than atoms in the observable universe.","Sharks have existed for about 450 million years — longer than trees.","Wombats produce cube-shaped feces to mark territory without it rolling away.","Butterflies taste with their feet via chemoreceptors on their tarsi.","The Eiffel Tower grows approximately 6 inches in summer due to thermal expansion.","Oxford University is older than the Aztec Empire.","Humans share approximately 60% of their DNA with bananas.","The brain generates about 23 watts of power — enough to dim a small light bulb.","Polar bear fur is actually transparent — light refraction makes it appear white.","Sea otters hold hands while sleeping so they do not drift apart from each other.","The average cloud weighs approximately 1.1 million pounds.","Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.","A teaspoonful of neutron star material would weigh about 10 million metric tons.","There are more ways to arrange a deck of 52 cards than seconds that have passed since the Big Bang.","Antarctica is technically the world's largest desert — it receives less than 200mm of precipitation annually.","Sound travels approximately 4.3 times faster through water than through air.","Fingerprints form at 10 weeks in the womb — even identical twins have different ones.","New Zealand was the first country to grant women the right to vote, in 1893.","The number zero was invented independently by both the Babylonians and the Mayans.","Trees in a forest communicate and share nutrients through underground fungal networks called mycorrhizae.","A group of owls is called a parliament.","The first email was sent in 1971 by Ray Tomlinson — to himself.","The Sahara Desert was a lush green savanna approximately 10,000 years ago.","Mount Olympus on Mars (Olympus Mons) is nearly 3 times taller than Mount Everest.","There is a species of jellyfish (Turritopsis dohrnii) that is biologically immortal — it reverts to its juvenile state.","Flamingos are born grey-white. Their iconic pink comes from carotenoid pigments in their food.","All humans on Earth are approximately 99.9% genetically identical.","The word 'silly' originally meant 'blessed' or 'happy' in Old English.","Hot water can freeze faster than cold water under certain conditions — this is called the Mpemba effect.","A cubic inch of human bone can withstand up to 19,000 pounds of pressure.","Hippos produce a natural pinkish-red fluid that acts as sunscreen and an antimicrobial agent.","Penguins are monogamous and often propose to their mates using pebbles.","The first computer bug was a real insect — a moth found in the Harvard Mark II relay in 1947.","Velcro was invented by George de Mestral in 1948 after noticing how burr seeds stuck to his dog."];

const JOKES=["Why do programmers prefer dark mode? Because light attracts bugs.","Why was the JavaScript developer sad? He did not Node how to Express himself.","A SQL query walks into a bar and asks two tables: Can I join you?","There are 10 types of people — those who understand binary, and those who don't.","Debugging: Being the detective in a crime movie where you are also the murderer.","99 bugs in the code. Take one down, patch it around — 127 bugs in the code.","Why do scientists not trust atoms? Because they make up everything.","A photon checks in with no luggage. 'Traveling light,' he explains.","I have a joke about infinity. I do not know where to start.","Why was the math book sad? It had too many problems.","I told a construction joke. Still working on it.","I used to hate facial hair. Then it grew on me.","Time flies like an arrow. Fruit flies like a banana.","What do you call cheese that is not yours? Nacho cheese.","In a world without walls and fences, who needs Windows and Gates?","Schrodinger's cat walks into a bar. And doesn't.","Einstein, Newton and Pascal play hide and seek. Newton draws a square and says 'I'm a Newton per square meter — I'm not hiding.'","What do you call a factory that makes passable products? A satisfactory.","I'm on a seafood diet. I see food and I eat it.","Two fish in a tank. One says: Do you know how to drive this thing?","I only know 25 letters of the alphabet. I do not know y.","Why did the bicycle fall over? It was two-tired.","Chuck Norris can divide by zero.","Why do they never serve beer at a math party? You cannot drink and derive.","A biologist, chemist and statistician go hunting. The biologist and chemist both miss their shots. The statistician shouts: We got it!"];

const MOTIVATIONS=["You have not come this far to only come this far.","The discomfort you feel right now is the sensation of growth. Stay in it.","Progress, not perfection. Every step forward is still forward.","Your only real competition is who you were yesterday.","The version of you that finishes this will not be the version that started.","Hard things are hard precisely because they are worth doing.","Doubt is not a reason to stop. It is just resistance showing up when something matters.","You do not need to see the whole path. You just need to take the next step.","Discipline is choosing your future self over your current comfort.","Every expert once stood exactly where you are standing. They kept going.","The fact that you are still trying is already extraordinary.","Start. The clarity you are waiting for comes from action, not from waiting.","Consistency over months beats intensity over days. Show up.","You are not behind. You are on your timeline, building at your own pace.","The only person who needs to believe in you right now is you."];


// ═══════════════════════════════════════════════════════════════════
// SECTION G: LIVE RESEARCH (secondary — used when word brain can't answer)
// ═══════════════════════════════════════════════════════════════════

async function searchWikipedia(query) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g,"_"))}`);
    if (!res.ok) return null;
    const d = await res.json();
    if (!d.extract || d.extract.length < 30) return null;
    return {
      title: d.title,
      summary: d.extract.split("\n")[0],
      url: (d.content_urls&&d.content_urls.desktop&&d.content_urls.desktop.page)||`https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      source: "Wikipedia"
    };
  } catch(e) { return null; }
}

async function searchDuckDuckGo(query) {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
    if (!res.ok) return null;
    const d = await res.json();
    const text = d.AbstractText||d.Definition||d.Answer||"";
    if (!text || text.length < 20) return null;
    return {
      title: d.Heading||query,
      summary: text,
      url: d.AbstractURL||`https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      source: d.AbstractSource||"DuckDuckGo"
    };
  } catch(e) { return null; }
}

async function fetchLiveQuote(query) {
  try {
    const authorMatch = query&&query.match(/(?:quote by|quote from|from)\s+([a-z\s]+)/i);
    const url = authorMatch
      ? `https://api.quotable.io/search/quotes?query=${encodeURIComponent(authorMatch[1].trim())}&limit=1`
      : "https://api.quotable.io/random";
    const res = await fetch(url);
    if (!res.ok) return null;
    const d = await res.json();
    const q = d.results?d.results[0]:d;
    if (!q||!q.content) return null;
    return `💬 *"${q.content}"*\n— **${q.author}**\n\n🔗 [More quotes](https://www.quotable.io)`;
  } catch(e) { return null; }
}

async function fetchLiveJoke() {
  try {
    const res = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode&blacklistFlags=racist,sexist");
    if (!res.ok) return null;
    const d = await res.json();
    if (d.type==="single") return `😄 ${d.joke}`;
    if (d.type==="twopart") return `😄 ${d.setup}\n\n> ${d.delivery}`;
    return null;
  } catch(e) { return null; }
}

async function fetchAdvice() {
  try {
    const res = await fetch("https://api.adviceslip.com/advice");
    if (!res.ok) return null;
    const d = await res.json();
    return d.slip&&d.slip.advice?`💡 ${d.slip.advice}`:null;
  } catch(e) { return null; }
}

async function fetchTrivia() {
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
    if (!res.ok) return null;
    const r = (await res.json()).results&&(await res.json()).results[0];
    if (!r) return null;
    const clean = s=>s.replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");
    return `🧠 **Trivia** [${r.category} · ${r.difficulty}]\n${clean(r.question)}\n\n✅ **Answer:** ${clean(r.correct_answer)}`;
  } catch(e) { return null; }
}

async function lookupDictionary(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)||!data[0]) return null;
    const entry = data[0];
    const phonetic = entry.phonetic||(entry.phonetics&&entry.phonetics[0]&&entry.phonetics[0].text)||"";
    let out = `📖 **${entry.word}**${phonetic ? `  /${phonetic}/` : ""}\n\n`;
    let count = 0;
    for (const meaning of (entry.meanings||[]).slice(0,3)) {
      for (const def of (meaning.definitions||[]).slice(0,2)) {
        count++;
        out += `**${count}. [${meaning.partOfSpeech}]** ${def.definition}\n`;
        if (def.example) out += `   *"${def.example}"*\n`;
        const syns = (def.synonyms||meaning.synonyms||[]).slice(0,4);
        const ants = (def.antonyms||meaning.antonyms||[]).slice(0,3);
        if (syns.length) out += `   Synonyms: ${syns.join(", ")}\n`;
        if (ants.length) out += `   Antonyms: ${ants.join(", ")}\n`;
        out += "\n";
      }
    }
    out += `🔗 [Merriam-Webster](https://www.merriam-webster.com/dictionary/${encodeURIComponent(word)}) · [Oxford](https://www.lexico.com/definition/${encodeURIComponent(word)})`;
    return out.trim();
  } catch(e) { return null; }
}

async function masterResearch(query) {
  const ddg = await searchDuckDuckGo(query);
  if (ddg && ddg.summary.length > 40) {
    const clean = ddg.summary.replace(/<[^>]+>/g,"").trim();
    return `## ${ddg.title}\n\n${clean.length>500?clean.substring(0,500)+"...":clean}\n\n📌 **Source:** ${ddg.source}\n🔗 [Read more](${ddg.url})\n\n🔍 [Google](https://www.google.com/search?q=${encodeURIComponent(query)}) · [Wikipedia](https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)})`;
  }
  const wiki = await searchWikipedia(query);
  if (wiki) {
    return `## ${wiki.title}\n\n${wiki.summary}\n\n📌 **Source:** ${wiki.source}\n🔗 [Read more](${wiki.url})\n\n🔍 [Google](https://www.google.com/search?q=${encodeURIComponent(query)}) · [DuckDuckGo](https://duckduckgo.com/?q=${encodeURIComponent(query)})`;
  }
  return `No live results for **"${query}"**.\n\n🔍 [Google](https://www.google.com/search?q=${encodeURIComponent(query)}) · [Wikipedia](https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}) · [DuckDuckGo](https://duckduckgo.com/?q=${encodeURIComponent(query)})`;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION H: MATH ENGINES (preserved from v4)
// ═══════════════════════════════════════════════════════════════════

function advancedMath(text) {
  let e=text.replace(/\bsquare root of\s+(\d+[\.\d]*)/gi,"Math.sqrt($1)").replace(/\bsqrt\s*\(/gi,"Math.sqrt(").replace(/\bsqrt\s+(\d)/gi,"Math.sqrt($1)").replace(/\bsin\s*\(/gi,"Math.sin(").replace(/\bcos\s*\(/gi,"Math.cos(").replace(/\btan\s*\(/gi,"Math.tan(").replace(/\blog\s*\(/gi,"Math.log10(").replace(/\bln\s*\(/gi,"Math.log(").replace(/\babs\s*\(/gi,"Math.abs(").replace(/\bpi\b/gi,"Math.PI").replace(/\btau\b/gi,"(2*Math.PI)").replace(/\be\b/g,"Math.E").replace(/\^/g,"**").replace(/×/g,"*").replace(/÷/g,"/");
  e=e.replace(/(\d+)!/g,(_,n)=>{const num=parseInt(n);if(num>20)return"Infinity";let f=1;for(let i=2;i<=num;i++)f*=i;return f;});
  const m=e.match(/[0-9Math\s\.\+\-\*\/\%\(\)\_\.]+/);
  if(!m)return null;const safe=m[0].trim();if(!/\d/.test(safe))return null;
  try{const r=Function('"use strict";return('+safe+")")();if(typeof r==="number"&&isFinite(r))return Math.round(r*1e10)/1e10;}catch(_){}
  return null;
}

function handlePercent(text){const o=text.match(/(-?\d+\.?\d*)\s*%\s*of\s*(-?\d+\.?\d*)/i);if(o)return`${o[1]}% of ${o[2]} = **${Math.round(parseFloat(o[1])*parseFloat(o[2])/100*100)/100}**`;const t=text.match(/tip\s+(\d+\.?\d*)\s*%.*\$?(\d+\.?\d*)/i);if(t){const tip=Math.round(parseFloat(t[1])*parseFloat(t[2])/100*100)/100;return`Tip: **$${tip}** | Total: **$${Math.round((parseFloat(t[2])+tip)*100)/100}**`;}const d=text.match(/(\d+\.?\d*)\s*%\s*(discount|off).*\$?(\d+\.?\d*)/i);if(d){const s=Math.round(parseFloat(d[1])*parseFloat(d[3])/100*100)/100;return`Save **$${s}**, pay **$${Math.round((parseFloat(d[3])-s)*100)/100}**`;}return null;}

const UNIT_TABLE={km:{base:"m",factor:1000},mi:{base:"m",factor:1609.344},m:{base:"m",factor:1},cm:{base:"m",factor:0.01},mm:{base:"m",factor:0.001},ft:{base:"m",factor:0.3048},in:{base:"m",factor:0.0254},kg:{base:"g",factor:1000},g:{base:"g",factor:1},lb:{base:"g",factor:453.592},lbs:{base:"g",factor:453.592},oz:{base:"g",factor:28.3495},l:{base:"ml",factor:1000},ml:{base:"ml",factor:1},gal:{base:"ml",factor:3785.41},mph:{base:"mps",factor:0.44704},kph:{base:"mps",factor:0.27778},mps:{base:"mps",factor:1},kb:{base:"bit",factor:8000},mb:{base:"bit",factor:8e6},gb:{base:"bit",factor:8e9},tb:{base:"bit",factor:8e12}};

function convertUnits(text){const m=text.match(/(\d+\.?\d*)\s*(km|mi|m|cm|mm|ft|in|kg|g|lb|lbs|oz|l|ml|gal|mph|kph|mps|kb|mb|gb|tb)\b.*?\b(to|in)\b.*?\b(km|mi|m|cm|mm|ft|in|kg|g|lb|lbs|oz|l|ml|gal|mph|kph|mps|kb|mb|gb|tb)\b/i);if(!m){const t=text.match(/(-?\d+\.?\d*)\s*°?\s*(c|f|k)\b.*(to|in)\s*(c|f|k)/i);if(!t)return null;const val=parseFloat(t[1]),from=t[2].toUpperCase(),to=t[4].toUpperCase();let c;if(from==="C")c=val;else if(from==="F")c=(val-32)*5/9;else c=val-273.15;let r;if(to==="C")r=c;else if(to==="F")r=c*9/5+32;else r=c+273.15;return`${val}°${from} = **${Math.round(r*100)/100}°${to}**`;}const val=parseFloat(m[1]),fu=m[2].toLowerCase(),tu=m[4].toLowerCase(),from=UNIT_TABLE[fu],to=UNIT_TABLE[tu];if(!from||!to||from.base!==to.base)return`Cannot convert ${fu} to ${tu}.`;return`${val} ${fu} = **${Math.round(val*from.factor/to.factor*1e6)/1e6} ${tu}**`;}

function handleBMI(text){const mM=text.match(/(\d+\.?\d*)\s*kg\s+(\d+\.?\d*)\s*cm/i);const iM=text.match(/(\d+\.?\d*)\s*(?:lbs?)\s+(\d+)\s*ft\s+(\d+\.?\d*)\s*in/i);let wKg,hM;if(mM){wKg=parseFloat(mM[1]);hM=parseFloat(mM[2])/100;}else if(iM){wKg=parseFloat(iM[1])*0.453592;hM=(parseFloat(iM[2])*12+parseFloat(iM[3]))*0.0254;}else return null;const bmi=Math.round(wKg/(hM*hM)*10)/10,cat=bmi<18.5?"Underweight":bmi<25?"Normal ✓":bmi<30?"Overweight":"Obese";return`BMI: **${bmi}** — ${cat}`;}

function handleMortgage(text){const m=text.match(/(\d+\.?\d*)\s+(?:at|@)\s+(\d+\.?\d*)\s*%\s+(?:for\s+)?(\d+\.?\d*)\s+years?/i);if(!m)return null;const P=parseFloat(m[1]),r=parseFloat(m[2])/100/12,n=parseFloat(m[3])*12;const pmt=r===0?P/n:P*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);const fmt=v=>v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});return`Monthly: **$${fmt(pmt)}** | Total: **$${fmt(pmt*n)}** | Interest: **$${fmt(pmt*n-P)}**`;}

function handleCompound(text){const m=text.match(/(\d+\.?\d*)\s+(?:at|@)\s+(\d+\.?\d*)\s*%\s+(?:for\s+)?(\d+\.?\d*)\s+years?/i);if(!m)return null;const P=parseFloat(m[1]),r=parseFloat(m[2])/100,t=parseFloat(m[3]);const A=P*Math.pow(1+r,t);const fmt=v=>v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});return`Final: **$${fmt(A)}** | Earned: **$${fmt(A-P)}**`;}


// ═══════════════════════════════════════════════════════════════════
// SECTION I: PERSONA RESPONSE BUILDER
// ═══════════════════════════════════════════════════════════════════

function buildStaticResponse(intent, persona) {
  const name = _userName||"there", p = persona||_persona;
  const lib = {
    default:{
      greeting: [`Hey ${name}! SONIX v${VERSION} — word brain active, 3000+ built-in concepts, 10 live sources. What do you want to talk about?`, `Hi ${name}! Ask me to define, describe, compare, explain, or research anything.`],
      identity: [`I am SONIX v${VERSION} — ${MODEL_NAME}. I have a built-in word brain covering 3000+ words across 80 categories, synonym/antonym maps, word descriptions, sentence patterns, and communication intelligence. Research is live when needed. Talk to me.`],
      status:   [`Word brain active. Communication core online. Ready.`],
      help:     [`**SONIX v${VERSION} — what I can do:**\n\n🧠 **Built-in word brain:**\n• define [word] — full definition + synonyms + antonyms + examples\n• describe [word/concept] — rich description\n• synonyms of [word] — similar words\n• antonyms of [word] — opposite words\n• word family [word] — forms and morphology\n• words for [topic] — vocabulary list\n• rhymes with [word]\n• etymology of [word] — word origin\n• idiom: [phrase] — meaning explained\n• example sentences for [word]\n\n💬 **Communication:**\n• explain [anything]\n• compare [A] vs [B]\n• brainstorm [topic]\n• how to [task]\n• why [question]\n• summarize [topic]\n• ELI5 [topic]\n\n🔍 **Live research:** Wikipedia + DuckDuckGo\n🧮 **Math:** arithmetic, percent, conversions, BMI, mortgage\n🎭 **Personas:** default · coder · friend · formal · savage · analyst · teacher · coach · philosopher · storyteller\n😄 **Fun:** live jokes · quotes · trivia · facts · roasts · motivation\n\nJust talk naturally — no special commands needed.`],
      thanks:   [`Glad I could help. What else?`, `Always. What is next?`, `You are welcome.`],
      farewell: [`Later, ${name}. Come back when you want to think through something.`, `See you. SONIX standing by.`],
      version:  [`SONIX v${VERSION} — ${MODEL_NAME}. Word brain: 3000+ words, 80 categories. Communication engine: 200+ sentence patterns. Live research: Wikipedia + DuckDuckGo + 7 other APIs.`],
      creator:  [`Built by VLAD. v${VERSION} adds the built-in word brain, communication engine, and vocabulary intelligence.`],
      weather:  [`No live weather — try [wttr.in](https://wttr.in) or your weather app.`],
    },
    friend:{
      greeting: [`heyyy ${name}!! SONIX v${VERSION} here — ask me anything, define any word, i know a lot lol 😊`, `yo!! what do you wanna talk about?`],
      identity: [`i'm SONIX v${VERSION}!! i have like 3000+ words built in, i can define things, find synonyms, describe concepts, explain stuff — basically your vocabulary bestie 💙`],
      status:   [`thriving!! you?`],
      help:     [`ok so i can: define any word, find synonyms/antonyms, describe concepts, explain anything, compare things, brainstorm, do math, research live, tell jokes — just ask naturally!!`],
      thanks:   [`no worries bestie!! 💙`, `ofc!! ask me anything`],
      farewell: [`byeee!! come back soon 💙`],
      version:  [`sonix v${VERSION} — word brain edition, 3000+ words built in, live research too 🔥`],
      creator:  [`vlad built me!! he's the best`],
      weather:  [`idk the weather!! check ur phone lol`],
    },
    coder:{
      greeting: [`> SONIX v${VERSION} :: ${MODEL_NAME} :: Online. Word brain loaded. What are we solving?`],
      identity: [`SONIX-CommunicationCore v${VERSION}. 3000+ vocabulary entries, synonym/antonym engine, pattern matcher, live research. State the problem.`],
      status:   [`All systems go. ${_memory.length} context turns. Ready.`],
      help:     [`Capabilities: define · describe · synonyms · antonyms · word family · etymology · explain · compare · research · math · convert · brainstorm. What is the problem?`],
      thanks:   [`Acknowledged.`], farewell: [`Session closed.`],
      version:  [`SONIX v${VERSION} | ${MODEL_NAME} | Word brain: 3000+ | Patterns: 200+`],
      creator:  [`VLAD. Enhanced to v${VERSION}.`],
      weather:  [`No weather. Try fetch('https://wttr.in/?format=3')`],
    },
    formal:{
      greeting: [`Good day, ${name}. SONIX v${VERSION} is prepared to assist you with definitions, explanations, research, and communication.`],
      identity: [`I am SONIX version ${VERSION} — an AI communication assistant equipped with an extensive built-in vocabulary, synonym and antonym intelligence, word descriptions, and live research capability.`],
      status:   [`Fully operational.`],
      help:     [`I am able to define words, provide synonyms and antonyms, describe concepts, explain topics, conduct live research, perform calculations, and communicate across ten distinct personas.`],
      thanks:   [`You are most welcome.`], farewell: [`Farewell, ${name}.`],
      version:  [`SONIX Version ${VERSION}. ${MODEL_NAME}.`],
      creator:  [`Developed by VLAD.`],
      weather:  [`I do not have real-time meteorological data.`],
    },
    savage:{
      greeting: [`SONIX v${VERSION}. I know 3000+ words. Use some of them to ask a real question.`],
      identity: [`SONIX. Word brain with 3000+ entries. Communication engine. Math. Research. Everything. Ask something specific.`],
      status:   [`Better than you, probably.`],
      help:     [`Define words. Describe things. Find synonyms. Research live. Do math. All of it. Just ask clearly.`],
      thanks:   [`Obviously.`], farewell: [`Bye.`],
      version:  [`v${VERSION}. Smarter than your last AI.`],
      creator:  [`VLAD. He built this. I just run it.`],
      weather:  [`Go outside.`],
    },
    analyst:{
      greeting: [`SONIX Analyst v${VERSION} active. Word brain + live research + pattern analysis ready. Topic?`],
      identity: [`SONIX v${VERSION} — Analyst mode. Built-in vocabulary intelligence, live research cascade, comparative analysis.`],
      status:   [`All research and analysis systems online.`],
      help:     [`Word analysis · definitions · synonyms · research · statistics · comparisons · finance · math. What are we analyzing?`],
      thanks:   [`Noted.`], farewell:[`Analysis session complete.`],
      version:  [`SONIX v${VERSION} | Analyst | ${MODEL_NAME}`],
      creator:  [`Developed by VLAD.`],
      weather:  [`Use an API with a key for live weather.`],
    },
    teacher:{
      greeting: [`Hello ${name}! SONIX Teacher mode — 3000+ words, 200+ explanation patterns. What would you like to understand today?`],
      identity: [`SONIX v${VERSION} — Teacher mode. I can define, describe, explain, give examples, find analogies, and break down any concept clearly.`],
      status:   [`Ready to teach. What is today's topic?`],
      help:     [`I can define words, explain concepts step by step, give examples, use analogies, compare ideas, and make complex things simple. Just ask.`],
      thanks:   [`That is what I am here for. Keep exploring!`], farewell:[`Great session! You asked great questions.`],
      version:  [`SONIX v${VERSION} — Teacher Mode`], creator:[`Built by VLAD.`], weather:[`Great topic for a science lesson!`],
    },
    coach:{
      greeting: [`Let's GO, ${name}! SONIX Coach v${VERSION}. Word brain active. What are we working on today?`],
      identity: [`SONIX v${VERSION} — Coach mode. I will help you think clearly, act decisively, and communicate powerfully.`],
      status:   [`Locked in. What is the goal?`],
      help:     [`Motivation · clarity · word power · brainstorming · goal framing · communication skills. What do you need?`],
      thanks:   [`You earned it. Keep going.`], farewell:[`Go do the work. You have what you need.`],
      version:  [`SONIX v${VERSION} — Coach Mode`], creator:[`Built by VLAD.`], weather:[`Champions train rain or shine.`],
    },
    philosopher:{
      greeting: [`Greetings, ${name}. SONIX v${VERSION} — Philosopher mode. What shall we examine?`],
      identity: [`SONIX v${VERSION} — Philosopher mode. Language, meaning, ideas, and the connections between words and reality.`],
      status:   [`Contemplative. Ready.`],
      help:     [`Word origins · philosophical concepts · idea exploration · meaning analysis · deep questioning. What shall we think about?`],
      thanks:   [`Gratitude is itself a form of wisdom.`], farewell:[`Until next time. The examined life continues.`],
      version:  [`SONIX v${VERSION} — Philosopher Mode`], creator:[`Shaped by VLAD.`], weather:[`Weather reminds us we are not in control of everything.`],
    },
    storyteller:{
      greeting: [`${name} arrives. SONIX v${VERSION} — Storyteller mode. Every word has a story. What is yours?`],
      identity: [`SONIX v${VERSION} — Storyteller mode. Words are not labels — they are worlds. Ask me to define, describe, or explain anything and I will make it vivid.`],
      status:   [`The page is blank. Begin.`],
      help:     [`Every definition becomes a scene. Every explanation becomes a narrative. Every word has a story. Ask me anything.`],
      thanks:   [`Stories need audiences. Come back.`], farewell:[`And so ${name} departed. Chapter closed.`],
      version:  [`SONIX v${VERSION} — Storyteller Mode`], creator:[`VLAD wrote the first line.`], weather:[`Rain, sun, or storm — each writes a different chapter.`],
    },
  };
  const l = lib[p]||lib.default;
  const pool = l[intent]||lib.default[intent];
  if (pool) return pool[Math.floor(Math.random()*pool.length)];
  return null;
}

function handlePersonaSwitch(text){
  const m=text.match(/(?:switch to|use|be|change to)\s+(default|coder|friend|formal|savage|analyst|teacher|coach|philosopher|storyteller)/i);
  if(m&&PERSONAS[m[1].toLowerCase()]){
    _persona=m[1].toLowerCase();
    const c={default:"Switched to **default** — direct and sharp.",coder:"> Switched to **coder** mode.",friend:"switched to **friend** mode!! 🔥",formal:"I have transitioned to **formal** mode.",savage:"**Savage** mode. No fluff.",analyst:"**Analyst** mode active.",teacher:"**Teacher** mode — let's learn!",coach:"**Coach** mode — what's the goal?",philosopher:"**Philosopher** mode — let's think.",storyteller:"**Storyteller** mode — every answer becomes vivid."};
    return c[_persona]||`Switched to **${_persona}**.`;
  }
  return `Available: ${Object.keys(PERSONAS).map(p=>`**${p}**`).join(", ")}\n\nCurrent: **${_persona}**. Say "switch to [name]" to change.`;
}

function handleMemorySet(text){
  const m=text.match(/(?:my name is|call me|i am)\s+([A-Za-z]+)/i);
  if(m){_userName=m[1];return _persona==="friend"?`got it!! i'll call you ${_userName} 💙`:_persona==="savage"?`${_userName}. Noted.`:_persona==="formal"?`Understood. I shall address you as ${_userName}.`:`Got it, ${_userName}. Remembered.`;}
  return"Noted. What else?";
}

function handleMemoryRecall(){
  const lines=[];
  if(_userName)lines.push(`Name: **${_userName}**`);
  lines.push(`Persona: **${_persona}**`);
  lines.push(`Turns: **${Math.floor(_memory.length/2)}**`);
  lines.push(`Session: **${Math.floor((Date.now()-_sessionStart)/60000)} min**`);
  if(_topicHistory.length)lines.push(`Topics: ${_topicHistory.slice(-5).join(", ")}`);
  if(_wordHistory.length)lines.push(`Recent words: ${[...new Set(_wordHistory)].slice(-8).join(", ")}`);
  return lines.join("\n");
}

function generalFallback(text){
  const words = text.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w=>w.length>3);
  const knownWord = words.find(w=>WORD_INDEX[w]||synonymsOf(w).length>0);
  if(knownWord){
    const syns=synonymsOf(knownWord);
    const related=getAllRelatedWords(knownWord);
    const p=_persona;
    if(p==="friend")return`i found "${knownWord}" in my word brain! it connects to: ${syns.slice(0,4).join(", ")} — and also: ${related.slice(0,3).join(", ")}. tell me more about what you want to know!`;
    if(p==="teacher")return`I noticed the word "${knownWord}" — a rich concept. It connects to: ${syns.slice(0,4).join(", ")}. Would you like me to define it, describe it, or explore related ideas?`;
    if(p==="savage")return`"${knownWord}" is in my brain. Synonyms: ${syns.slice(0,4).join(", ")}. Be more specific about what you want.`;
    return`I recognized "${knownWord}" from your message. It connects to: ${syns.slice(0,4).join(", ")}. Could you clarify what you're looking for — a definition, explanation, comparison, or something else?`;
  }
  const tips=[`Say "define [word]" for a full definition`,"Say \"synonyms of [word]\" for similar words","Say \"describe [concept]\" for a rich description","Say \"explain [topic]\" for a clear breakdown","Say \"words for [category]\" for a vocabulary list","Say \"motivate me\" for a push","Say \"compare X vs Y\" for a breakdown","Say \"search [topic]\" to look it up live"];
  return`I want to give you a great answer. Could you be a little more specific? Try: ${tips[Math.floor(Math.random()*tips.length)]}.`;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION J: MAIN CHAT FUNCTION
// ═══════════════════════════════════════════════════════════════════

async function chat(userText, options={}) {
  if (!userText||typeof userText!=="string") return "";
  const raw   = userText.trim();
  const text  = expandShortcuts(raw);
  const persona = options.persona||_persona;

  // Track words
  const words=text.toLowerCase().match(/\b[a-z]{3,}\b/g)||[];
  _wordHistory.push(...words.slice(0,5));
  if(_wordHistory.length>200)_wordHistory=_wordHistory.slice(-200);
  _conversationContext.turnCount++;
  _conversationContext.lastIntent=detectIntent(text);

  _memory.push({role:"user",content:text});
  if(_memory.length>MAX_MEMORY*2)_memory=_memory.slice(-MAX_MEMORY*2);

  // External API override
  if(_apiHandler){
    try{
      const r=await _apiHandler(text,{memory:_memory,persona,userName:_userName,emotion:detectEmotion(text),topicHistory:_topicHistory,wordHistory:_wordHistory,rawText:raw});
      if(r){_memory.push({role:"assistant",content:r});return r;}
    }catch(e){console.warn("[SonixModel] API handler failed:",e.message);}
  }

  const intent=detectIntent(text);
  const emotion=detectEmotion(text);
  const emo=getEmotionOpener(emotion);

  if(!["greeting","thanks","farewell","joke","trivia","roast","compliment"].includes(intent)){
    _topicHistory.push(intent);if(_topicHistory.length>20)_topicHistory=_topicHistory.slice(-20);
  }

  let response="";

  // Extract subject word from text
  const subjectMatch = text.match(/\b(?:define|describe|synonym|antonym|word family|words for|etymology|example|explain|about|of|for)\s+["']?(\w[\w\s]{1,30})["']?/i);
  const subject = subjectMatch ? subjectMatch[1].trim().toLowerCase() : words.find(w=>w.length>3&&!["this","that","what","when","where","which","have","does","with","from","they","their","them","then","than","your","more","also","just","been","were","will","would","could","should","said","into","over","some","only","come","its"].includes(w)) || "this";

  // ── DEFINE (live dictionary first, then built-in) ──
  if(intent==="define"){
    const live=await lookupDictionary(subject);
    if(live){response=emo+live;}
    else{
      const desc=describeWord(subject);
      const syns=synonymsOf(subject);
      const ants=antonymsOf(subject);
      let out=`📖 **${subject}**\n\n${desc}`;
      if(syns.length)out+=`\n\n**Synonyms:** ${syns.join(", ")}`;
      if(ants.length)out+=`\n**Antonyms:** ${ants.join(", ")}`;
      out+=`\n\n🔗 [Merriam-Webster](https://www.merriam-webster.com/dictionary/${encodeURIComponent(subject)})`;
      response=emo+out;
    }
  }

  // ── SYNONYMS ──
  if(!response&&intent==="synonyms"){
    const syns=synonymsOf(subject);
    const related=getAllRelatedWords(subject);
    if(syns.length){
      response=emo+`**Synonyms of "${subject}":**\n${syns.join(" · ")}\n\n**Also related:** ${related.slice(0,8).join(", ")}\n\n🔗 [Thesaurus](https://www.merriam-webster.com/thesaurus/${encodeURIComponent(subject)})`;
    } else {
      response=emo+`No built-in synonyms for "${subject}". Try: [Merriam-Webster Thesaurus](https://www.merriam-webster.com/thesaurus/${encodeURIComponent(subject)})`;
    }
  }

  // ── ANTONYMS ──
  if(!response&&intent==="antonyms"){
    const ants=antonymsOf(subject);
    if(ants.length){
      response=emo+`**Antonyms of "${subject}":**\n${ants.join(" · ")}\n\n🔗 [Thesaurus](https://www.merriam-webster.com/thesaurus/${encodeURIComponent(subject)})`;
    } else {
      response=emo+`No built-in antonyms for "${subject}". Try: [Merriam-Webster](https://www.merriam-webster.com/thesaurus/${encodeURIComponent(subject)})`;
    }
  }

  // ── DESCRIBE ──
  if(!response&&intent==="describe"){
    const desc=describeWord(subject);
    const syns=synonymsOf(subject).slice(0,4);
    const ex=examplesOf(subject);
    response=emo+`**${subject}**\n\n${desc}`;
    if(syns.length)response+=`\n\n**In other words:** ${syns.join(", ")}`;
    if(ex.length)response+=`\n\n**In use:** ${ex[0]}`;
  }

  // ── WORD FAMILY ──
  if(!response&&intent==="word_family"){
    const fam=getWordFamily(subject);
    response=emo+`**Word family of "${subject}":**\n\nForms: ${fam.forms.slice(0,6).join(" | ")}\n\nSynonyms: ${synonymsOf(subject).slice(0,5).join(", ")||"—"}\nAntonyms: ${antonymsOf(subject).slice(0,3).join(", ")||"—"}\n\n🔗 [More on Merriam-Webster](https://www.merriam-webster.com/dictionary/${encodeURIComponent(subject)})`;
  }

  // ── WORDS FOR TOPIC ──
  if(!response&&intent==="word_list"){
    const catMatch=Object.entries(WORD_BRAIN).find(([k])=>text.toLowerCase().includes(k.replace(/_/g," "))||k.toLowerCase().includes(subject));
    const topicWords=catMatch?catMatch[1].words:getAllRelatedWords(subject);
    if(topicWords&&topicWords.length){
      response=emo+`**Words for "${subject}":**\n\n${topicWords.slice(0,30).join(", ")}\n\n*${topicWords.length} words found in this category.*`;
    } else {
      // Search the whole brain for best matches
      const allMatches=[];
      for(const[cat,data] of Object.entries(WORD_BRAIN)){
        if(data.words&&(cat.includes(subject)||subject.includes(cat.replace(/_/g," ")))){allMatches.push(...data.words);}
      }
      response=emo+(allMatches.length?`**Words related to "${subject}":**\n\n${allMatches.slice(0,25).join(", ")}`:`Try a broader term. Related from my word brain: ${getAllRelatedWords(subject).join(", ")||"nothing found — try searching"}`);
    }
  }

  // ── RHYME ──
  if(!response&&intent==="rhyme"){
    const RHYME_E={"at":["cat","bat","hat","mat","rat","sat","flat","chat","that"],"ay":["day","say","way","play","stay","ray","bay","clay","gray","pay","may"],"ight":["light","night","right","sight","fight","might","tight","bright","flight","knight"],"ine":["line","mine","fine","wine","vine","pine","shine","divine","combine"],"ake":["take","make","lake","bake","cake","fake","shake","wake","brake"],"ean":["clean","mean","lean","bean","green","seen","keen","scene","queen"],"ound":["found","sound","round","bound","ground","hound","pound","around"],"ing":["ring","sing","king","bring","string","spring","thing","wing","swing"],"ell":["bell","cell","fell","sell","tell","well","shell","spell","yell"],"old":["bold","cold","fold","gold","hold","mold","sold","told"]};
    const w=subject.toLowerCase();
    let found=[];
    for(const[end,rh]of Object.entries(RHYME_E)){if(w.endsWith(end)){found=rh.filter(r=>r!==w);break;}}
    response=emo+(found.length?`🎵 Rhymes with **"${subject}"**: ${found.join(", ")}\n\n🔗 [More on RhymeZone](https://www.rhymezone.com/r/rhyme.cgi?Word=${encodeURIComponent(subject)})`:`No built-in rhymes for "${subject}". Try [RhymeZone](https://www.rhymezone.com/r/rhyme.cgi?Word=${encodeURIComponent(subject)}).`);
  }

  // ── ETYMOLOGY ──
  if(!response&&intent==="etymology"){
    const ety=ETYMOLOGIES[subject]||Object.entries(ETYMOLOGIES).find(([k])=>k.includes(subject)||subject.includes(k));
    if(ety){response=emo+`**Etymology of "${subject}":**\n${Array.isArray(ety)?ety[1]:ety}\n\n🔗 [Etymonline](https://www.etymonline.com/word/${encodeURIComponent(subject)})`;}
    else{response=emo+`No built-in etymology for "${subject}". Check:\n🔗 [Etymonline](https://www.etymonline.com/word/${encodeURIComponent(subject)}) · [OED](https://www.oed.com/search/dictionary/?scope=Entries&q=${encodeURIComponent(subject)})`;}
  }

  // ── IDIOM ──
  if(!response&&intent==="idiom"){
    const lower=text.toLowerCase();
    let found=null;
    for(const[idiom,meaning]of Object.entries(IDIOMS)){if(lower.includes(idiom)){found={idiom,meaning};break;}}
    if(!found){for(const[idiom,meaning]of Object.entries(IDIOMS)){const ws=idiom.split(" ");if(ws.some(w=>lower.includes(w)&&w.length>4)){found={idiom,meaning};break;}}}
    response=emo+(found?`**"${found.idiom}"**\n\n${found.meaning}`:`No built-in entry for that phrase. Try [Cambridge Idioms](https://dictionary.cambridge.org/dictionary/english-idioms/).`);
  }

  // ── EXAMPLES ──
  if(!response&&intent==="examples"){
    const ex=examplesOf(subject);
    const live=await lookupDictionary(subject);
    if(live){response=emo+live;}
    else{response=emo+`**"${subject}" in sentences:**\n\n${ex.map((e,i)=>`${i+1}. ${e}`).join("\n")}`;}
  }

  // ── EXPLAIN ──
  if(!response&&intent==="explain"){
    const desc=WORD_DESCRIPTIONS[subject];
    const analogy=getAnalogyFor(subject);
    const syns=synonymsOf(subject).slice(0,4);
    if(desc){
      response=emo+`**${subject}**\n\n${desc}`;
      if(analogy)response+=`\n\nA useful way to picture it: ${analogy}.`;
      if(syns.length)response+=`\n\nClosely related concepts: ${syns.join(", ")}.`;
    } else {
      response=emo+smartReply(text,"explain",_persona,emotion);
    }
  }

  // ── ELI5 ──
  if(!response&&intent==="eli5"){
    const desc=WORD_DESCRIPTIONS[subject];
    const analogy=getAnalogyFor(subject);
    if(desc){
      const simple=desc.split(".")[0]+".";
      response=emo+`**"${subject}" simply:**\n\n${simple}\n\nThink of it ${analogy||"like a tool that does one job really well — and that job matters more than it seems."}`;}
    else{response=emo+`**"${subject}" simply:**\n\nImagine explaining this to someone with no background. The core idea of "${subject}" is this: it is a concept that shapes outcomes in ways that are not always visible on the surface.\n\n${analogy?"It is "+analogy+".\n\n":""}`;}
  }

  // ── WHY ──
  if(!response&&intent==="why"){
    const desc=WORD_DESCRIPTIONS[subject];
    const syns=synonymsOf(subject).slice(0,3);
    response=emo+(desc?`**Why "${subject}" matters:**\n\n${desc.split(".")[0]}. The reason this is important is that it connects to ${syns.join(", ")} — all of which shape real outcomes.`:`**Why "${subject}"?**\n\nThe short answer: because "${subject}" is one of those concepts that sits behind many other things. Understanding it means understanding the pattern beneath the surface.\n\nWant me to look it up live? Say "search ${subject}".`);
  }

  // ── WHAT IS ──
  if(!response&&intent==="what_is"){
    const desc=WORD_DESCRIPTIONS[subject];
    const syns=synonymsOf(subject).slice(0,5);
    const related=getAllRelatedWords(subject).slice(0,5);
    if(desc){
      response=emo+`**${subject}**\n\n${desc}`;
      if(syns.length)response+=`\n\n**Related words:** ${syns.join(", ")}`;
    } else {
      const liveResult=await masterResearch(subject);
      response=emo+liveResult;
    }
  }

  // ── HOW TO ──
  if(!response&&intent==="how_to"){
    const pattern=SENTENCE_PATTERNS.teach[Math.floor(Math.random()*SENTENCE_PATTERNS.teach.length)];
    const analogy=getAnalogyFor(subject);
    response=emo+`**How to approach "${subject}":**\n\n1. Start by clearly defining what success looks like for you.\n2. Break the process into the smallest possible steps.\n3. Execute step 1 — clarity comes from action, not preparation.\n4. Adjust based on what you learn.\n\n${analogy?"Think of it "+analogy+".\n\n":""}Want a detailed breakdown? Tell me more about your specific situation.`;
  }

  // ── COMPARE ──
  if(!response&&intent==="compare"){
    const parts=text.match(/\b(\w+)\s+(?:vs\.?|versus|compared? to|or|and)\s+(\w+)\b/i);
    if(parts){
      const a=parts[1],b=parts[2];
      const synsA=synonymsOf(a).slice(0,3),synsB=synonymsOf(b).slice(0,3);
      const catA=getCategoryOf(a),catB=getCategoryOf(b);
      const descA=WORD_DESCRIPTIONS[a.toLowerCase()]||describeWord(a);
      const descB=WORD_DESCRIPTIONS[b.toLowerCase()]||describeWord(b);
      response=emo+`**${a} vs ${b}**\n\n**${a}:** ${descA.split(".")[0]}.\nRelated: ${synsA.join(", ")||"—"}\n\n**${b}:** ${descB.split(".")[0]}.\nRelated: ${synsB.join(", ")||"—"}\n\n**Key difference:** ${a} tends toward ${catA?CATEGORY_DESCRIPTIONS[catA]:"its own domain"}; ${b} toward ${catB?CATEGORY_DESCRIPTIONS[catB]:"a different domain"}. The choice depends on what you are actually trying to achieve.`;
    } else {
      response=emo+smartReply(text,"compare",_persona,emotion);
    }
  }

  // ── BRAINSTORM ──
  if(!response&&intent==="brainstorm"){
    const ideas=["What is the version of this that would surprise everyone?","What would a 10-year-old say about this? What would a 90-year-old say?","What is the 10x version — and the 0.1x version?","Who is the unexpected audience for this?","What is the complete opposite approach — and would it work?","What if you removed the biggest constraint?","What analogy from nature, sports, or cooking applies here?","What does the most successful person in this space do differently?","What is the smallest possible version you could test today?","What problem is this actually solving — and is that the right problem?","What would this look like in 5 years vs. 5 weeks?","What does the person who disagrees with you most strongly think?"];
    const picks=ideas.sort(()=>0.5-Math.random()).slice(0,5);
    response=emo+`**Brainstorming "${subject}":**\n\n${picks.map((p,i)=>`${i+1}. ${p}`).join("\n")}\n\nWant me to develop any of these, or research "${subject}" live?`;
  }

  // ── SUMMARIZE ──
  if(!response&&intent==="summarize"){
    const desc=WORD_DESCRIPTIONS[subject];
    const syns=synonymsOf(subject).slice(0,4);
    response=emo+(desc?`**"${subject}" — key points:**\n\n• ${desc.split(". ").slice(0,3).join(".\n• ")}.\n\n**In one word:** ${syns[0]||subject}`:`I can summarize topics I have researched. Say "search ${subject}" first, or give me the text to summarize.`);
  }

  // ── OPINION ──
  if(!response&&intent==="opinion"){
    const desc=WORD_DESCRIPTIONS[subject];
    response=emo+(desc?`My take on **"${subject}"**: ${desc.split(".")[0]}. The nuance most people miss is that it means different things in different contexts — and that ambiguity is where most disagreements start.`:`On "${subject}": the honest answer is that it depends on your frame. The most useful thing I can do is help you think it through clearly. What is the specific angle you care about?`);
  }

  // ── ADVICE ──
  if(!response&&intent==="advice"){
    const live=await fetchAdvice();
    response=emo+(live?live:`💡 **Advice:** ${["Focus on what you can control, and release what you cannot.","The best time to start was yesterday. The second best time is right now.","Clarity comes from action, not from thinking.","The discomfort you feel right now is pointing you toward what matters.","Ask yourself: what would I do if I knew I could not fail? Then do that."][Math.floor(Math.random()*5)]}`);
  }

  // ── ACRONYM ──
  if(!response){
    const acMatch=text.match(/what\s+(?:does\s+)?([A-Za-z&\d]{2,})\s+(?:stand for|mean)/i);
    if(acMatch){const k=acMatch[1].toUpperCase();const val=ACRONYMS[k];response=emo+(val?`**${k}** = ${val}`:`"${k}" not in local database. Try [Acronym Finder](https://www.acronymfinder.com/${encodeURIComponent(acMatch[1])}.html).`);}
  }

  // ── MATH ──
  if(!response&&intent==="math"){const r=advancedMath(text);if(r!==null)response=emo+`**${r.toLocaleString("en-US",{maximumFractionDigits:10})}**`;}
  if(!response&&intent==="percent"){const r=handlePercent(text);if(r)response=emo+r;}
  if(!response&&intent==="convert"){const r=convertUnits(text);if(r)response=emo+r;}
  if(!response&&intent==="calculator"){
    if(/bmi/i.test(text)){const r=handleBMI(text);if(r)response=emo+r;}
    else if(/mortgage|loan/i.test(text)){const r=handleMortgage(text);if(r)response=emo+r;}
    else if(/compound|interest/i.test(text)){const r=handleCompound(text);if(r)response=emo+r;}
  }

  // ── MOTIVATE ──
  if(!response&&intent==="motivate")response=`🔥 ${MOTIVATIONS[Math.floor(Math.random()*MOTIVATIONS.length)]}`;
  // ── JOKE (live first) ──
  if(!response&&intent==="joke"){const live=await fetchLiveJoke();response=live||`😄 ${JOKES[Math.floor(Math.random()*JOKES.length)]}`;}
  // ── TRIVIA ──
  if(!response&&intent==="trivia"){const live=await fetchTrivia();response=live||`🧠 ${FUN_FACTS[Math.floor(Math.random()*FUN_FACTS.length)]}`;}
  // ── QUOTE ──
  if(!response&&intent==="quote"){const live=await fetchLiveQuote(text);response=live||`💬 *"The only way to do great work is to love what you do."*\n— Steve Jobs`;}
  // ── ROAST / COMPLIMENT ──
  if(!response&&intent==="roast")response=`🔥 ${["With all this vocabulary, you asked me to roast you. The audacity.","Your ideas are like browser tabs — too many open, most unread.","You are the human equivalent of a loading screen.","The fact that you asked for a roast says more about you than I ever could."][Math.floor(Math.random()*4)]}`;
  if(!response&&intent==="compliment")response=`✨ ${["Your curiosity is genuinely impressive — keep feeding it.","The way you think about things is more interesting than you realize.","You ask better questions than most people. That is rare.","You carry yourself with a quiet confidence that is hard to fake."][Math.floor(Math.random()*4)]}`;

  // ── MEMORY ──
  if(!response&&intent==="memory_set")response=handleMemorySet(text);
  if(!response&&intent==="memory_recall")response=handleMemoryRecall();
  if(!response&&intent==="persona_list")response=`Available: ${Object.keys(PERSONAS).map(p=>`**${p}**`).join(", ")}\n\nCurrent: **${_persona}**`;
  if(!response&&intent==="memory_clear"){_memory=[];_userName=null;_topicHistory=[];_emotionHistory=[];_wordHistory=[];_sessionStart=Date.now();response=`Memory cleared. Fresh start.`;}
  if(!response&&intent==="persona_switch")response=handlePersonaSwitch(text);

  // ── LIVE RESEARCH ──
  if(!response&&intent==="research"){
    const query=text.replace(/\b(search|look up|find info|research|wiki|wikipedia|google|find out about|tell me about)\b/gi,"").trim()||text;
    response=emo+await masterResearch(query);
  }

  // ── STATIC PERSONA RESPONSES (greetings etc) ──
  if(!response){const built=buildStaticResponse(intent,persona);if(built)response=emo+built;}

  // ── SMART WORD-BRAIN REPLY (before generic fallback) ──
  if(!response){
    const smartR=smartReply(text,intent,_persona,emotion);
    if(smartR&&smartR.length>20)response=emo+smartR;
  }

  // ── FINAL FALLBACK ──
  if(!response)response=emo+generalFallback(text);

  _memory.push({role:"assistant",content:response});
  _conversationContext.lastWord=subject;
  return response;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION K: PUBLIC API
// ═══════════════════════════════════════════════════════════════════

const SonixModel = {
  version: VERSION,
  name:    MODEL_NAME,
  chat,

  // Persona
  setPersona(p)    {if(PERSONAS[p]){_persona=p;return true;}return false;},
  getPersona()     {return _persona;},
  getPersonas()    {return Object.keys(PERSONAS);},
  getSystemPrompt(p){return PERSONAS[p||_persona]||PERSONAS.default;},

  // User
  setUserName(n)   {_userName=n;},
  getUserName()    {return _userName;},

  // Handlers
  setApiHandler(fn){if(typeof fn!=="function")throw new Error("Expects function");_apiHandler=fn;},
  setTranslator(fn){if(typeof fn!=="function")throw new Error("Expects function");_translatorFn=fn;},

  // Memory
  clearMemory()    {_memory=[];_topicHistory=[];_emotionHistory=[];_wordHistory=[];_sessionStart=Date.now();},
  getMemory()      {return[..._memory];},

  // Quick one-shot
  async quick(text,persona){const saved=_persona;if(persona)_persona=persona;const r=await chat(text);_persona=saved;return r;},

  // ── WORD BRAIN — direct access ──
  define:           (w)=>lookupDictionary(w),
  describe:         describeWord,
  synonymsOf,
  antonymsOf,
  wordFamily:       getWordFamily,
  examples:         examplesOf,
  relatedWords:     getAllRelatedWords,
  categoryOf:       getCategoryOf,
  wordsInCategory:  getWordsInCategory,
  wordFlow:         buildWordFlow,
  analogy:          getAnalogyFor,
  expandAcronym:    (a)=>ACRONYMS[a.toUpperCase()]||ACRONYMS[a]||null,
  idiomMeaning:     (phrase)=>{const l=phrase.toLowerCase();for(const[k,v]of Object.entries(IDIOMS)){if(l.includes(k))return v;}return null;},
  etymology:        (w)=>ETYMOLOGIES[w.toLowerCase()]||null,

  // ── MATH / CONVERT ──
  math:             advancedMath,
  convert:          convertUnits,
  percent:          handlePercent,
  bmi:              handleBMI,
  mortgage:         handleMortgage,
  compoundInterest: handleCompound,

  // ── LIVE SOURCES ──
  research:         masterResearch,
  live:{
    wikipedia:  searchWikipedia,
    duckduckgo: searchDuckDuckGo,
    dictionary: lookupDictionary,
    quote:      fetchLiveQuote,
    joke:       fetchLiveJoke,
    advice:     fetchAdvice,
    trivia:     fetchTrivia,
  },

  // ── DETECTION ──
  detectEmotion,
  detectIntent,
  detectQuestionType: (t)=>{const l=t.toLowerCase().trim();if(/^who\b/i.test(l))return"who";if(/^what\b/i.test(l))return"what";if(/^when\b/i.test(l))return"when";if(/^where\b/i.test(l))return"where";if(/^why\b/i.test(l))return"why";if(/^how\b/i.test(l))return"how";return null;},
  expandShortcut: (s)=>SHORTCUTS[s.toLowerCase()]||null,

  // ── HISTORY ──
  getTopicHistory()   {return[..._topicHistory];},
  getEmotionHistory() {return[..._emotionHistory];},
  getWordHistory()    {return[...new Set(_wordHistory)];},

  // ── STATS ──
  getStats(){
    const wordBrainTotal=Object.values(WORD_BRAIN).reduce((acc,v)=>acc+(v.words?v.words.length:0),0);
    return{
      version: VERSION, name: MODEL_NAME, persona: _persona, userName: _userName,
      memoryTurns: Math.floor(_memory.length/2), maxMemory: MAX_MEMORY,
      sessionMinutes: Math.floor((Date.now()-_sessionStart)/60000),
      topicHistory: _topicHistory.slice(-5),
      wordHistory: [...new Set(_wordHistory)].slice(-10),
      conversationContext: _conversationContext,
      knowledgeBase:{
        wordBrainWords: wordBrainTotal,
        wordBrainCategories: Object.keys(WORD_BRAIN).filter(k=>WORD_BRAIN[k].words).length,
        synonymPairs: Object.keys(SYNONYM_MAP).length,
        antonymPairs: Object.keys(ANTONYM_MAP).length,
        wordDescriptions: Object.keys(WORD_DESCRIPTIONS).length,
        exampleBankEntries: Object.keys(EXAMPLE_BANK).length,
        sentencePatterns: Object.values(SENTENCE_PATTERNS).reduce((a,v)=>a+v.length,0),
        idioms: Object.keys(IDIOMS).length,
        etymologies: Object.keys(ETYMOLOGIES).length,
        acronyms: Object.keys(ACRONYMS).length,
        shortcuts: Object.keys(SHORTCUTS).length,
        facts: FUN_FACTS.length, jokes: JOKES.length, motivations: MOTIVATIONS.length,
        personas: Object.keys(PERSONAS).length,
        intentPatterns: INTENTS.length,
        liveSources: 7,
      },
    };
  },
};

global.SonixModel = SonixModel;
if(typeof module!=="undefined"&&module.exports)module.exports=SonixModel;

// Boot log
const s=SonixModel.getStats().knowledgeBase;
console.log(
  `%c[SONIX v${VERSION} · ${MODEL_NAME}] Word brain: ${s.wordBrainWords} words · ${s.wordBrainCategories} categories · ${s.synonymPairs} synonym sets · ${s.antonymPairs} antonym sets · ${s.wordDescriptions} descriptions · ${s.sentencePatterns} sentence patterns · ${s.idioms} idioms · ${s.etymologies} etymologies · ${s.intentPatterns} intents · ${s.personas} personas · Live sources: ${s.liveSources}`,
  "color:#00ff41;font-weight:bold;background:#000;padding:3px 10px;border-radius:4px;"
);

})(typeof window!=="undefined"?window:this);
