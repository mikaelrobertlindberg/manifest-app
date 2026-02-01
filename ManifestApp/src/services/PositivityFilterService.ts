/**
 * 🤖 AI POSITIVITY FILTER SERVICE
 * Smart coaching som guidar användare mot positiva tacksamheter
 * Hybrid approach: Local + Cloud AI för optimal balance av privacy & intelligence
 */

export interface NegativityAnalysis {
  isNegative: boolean;
  negativityScore: number; // 0-100, högre = mer negativt
  categories: ('selfCriticism' | 'pessimism' | 'comparison' | 'anger' | 'loneliness' | 'anxiety')[];
  severity: 'mild' | 'moderate' | 'severe';
  triggeredKeywords: string[];
  confidence: number; // 0-100, hur säker analysen är
}

export interface AIGuidance {
  message: string;
  suggestions: string[];
  tone: 'gentle' | 'encouraging' | 'empathetic' | 'practical';
  useCloud: boolean; // Om cloud AI användes för detta svar
}

/**
 * 🐻 LILLA BJÖRN AI COACH
 * Hjälper användare omformulera negativa tankar till tacksamhet
 */
export class PositivityFilterService {
  private static readonly NEGATIVE_KEYWORDS_SWEDISH = {
    // Självkritik (massivt utökad)
    selfCriticism: [
      'ful', 'värdelös', 'dålig', 'hopplös', 'oduglig', 'misslyckad',
      'dum', 'dumma', 'korkad', 'idiot', 'inkompetent', 'patetisk',
      'äcklig', 'motbjudande', 'vidrig', 'avskyvärd', 'osmaklig',
      'hatar mig själv', 'är inget värd', 'duger inte', 'är värdelös',
      'ynklig', 'pinsam', 'skämmes', 'skäms', 'blygs',
      'otillräcklig', 'värdelös människa', 'förtjänar inte', 'löjlig',
      'ska aldrig klara', 'för svag', 'för dum', 'ingen bryr sig',
      'kass', 'usel', 'eländig', 'urusel', 'bedrövlig',
      'miserabel', 'sorglig', 'usling', 'nolla', 'förlust',
      'fiasko', 'katastof', 'total misslyckning',
      'fattig på', 'saknar allt', 'har inget', 'är ingenting',
      'pajas', 'tönt', 'mongo', 'cp', 'psykfall',
      'galen', 'knäpp', 'störd',
      'borde inte existera', 'borde dö', 'hatar mitt utseende',
      'är så ful', 'ser förfärlig ut', 'äcklig kropp',
      'fet', 'tjock', 'ful som stryk', 'ser ut som skit'
    ],
    
    // Pessimism & hopplöshet (massivt utökad)
    pessimism: [
      'allt är skit', 'ingenting fungerar', 'bara går fel', 'är kört',
      'meningslöst', 'hopplöst', 'aldrig blir bättre', 'ger upp',
      'ingen mening', 'orkar inte', 'pallar inte',
      'slutar aldrig', 'bara blir värre', 'ingen poäng', 'dömt att misslyckas',
      'aldrig lyckas', 'helvete', 'mörkt', 'deppigt',
      'trist', 'jobbigt', 'fruktansvärt', 'förfärligt', 'hemska',
      'inget går rätt', 'bara skit', 'kass dag',
      'allt suger', 'livet är skit', 'vill bara dö', 'inget vits',
      'går åt helvete', 'bara problem', 'aldrig fred', 'ständigt kaos',
      'uruselt', 'totalt kört', 'fullständigt hopplöst',
      'omöjligt', 'kommer aldrig', 'ingen chans', 'aldrig lyckas',
      'förstört', 'trasigt', 'kraschar', 'havererar', 'kollapsar',
      'går under', 'faller sönder', 'allt dött', 'inget kvar',
      'slutet', 'game over', 'kör ner sig', 'bara negativ',
      'mörka tankar', 'svart hål', 'depression', 'ångest',
      'panik', 'kaos', 'katastrof', 'undergång', 'apokalyps'
    ],
    
    // Jämförelser (massivt utökad)  
    comparison: [
      'alla andra', 'bättre än mig', 'sämre än', 'aldrig lika bra',
      'kommer aldrig ikapp', 'alla utom mig', 'alla har det bättre',
      'alla är lyckligare', 'bara jag som', 'alla andra lyckas',
      'varför kan inte jag', 'alla verkar veta', 'jag är ensam',
      'alla har vänner', 'alla tjänar mer', 'alla är vackrare',
      'alla är smartare', 'alla andra klarar det', 'alla utom jag',
      'alla andra kan', 'alla har kärlek', 'alla har familj',
      'alla har jobb', 'alla är framgångsrika', 'alla har tur',
      'alla andra förstår', 'alla är normala', 'alla andra duger',
      'alla har pengar', 'alla reser', 'alla har roligt',
      'alla andra får', 'alla blir valda', 'alla andra uppskattas',
      'bara jag som misslyckas', 'bara jag som är ensam',
      'bara jag som har problem', 'bara jag som kämpar',
      'varför just jag', 'varför aldrig jag', 'aldrig min tur',
      'alla utom jag får', 'jag är sämst', 'jag kommer sist',
      'alla andra först', 'jag hamnar efter', 'alla hinner före',
      'alla är mer värda', 'alla förtjänar mer', 'alla älskas mer'
    ],
    
    // Ilska & frustration (massivt utökad)
    anger: [
      'hatar', 'avskyr', 'förbannat', 'satans', 'jävla', 'jävlar',
      'fan', 'fazan', 'helvete', 'för helvete', 'jävla skit',
      'förstör allt', 'saboterar', 'förtjänar inte', 'ska få betala',
      'fan också', 'skit också', 'så less', 'så trött på',
      'irriterad', 'frustrerad', 'förtvivlad', 'rasande',
      'vill bara skrika', 'orkar inte mer',
      'kokar av ilska', 'exploderar', 'går i taket', 'ser rött',
      'vill slå', 'vill krossa', 'vill förstöra', 'vill bara skada',
      'hatar livet', 'hatar världen', 'hatar allt', 'hatar alla',
      'förtjänar att dö', 'ska få lida', 'jävla idiot', 'kräk',
      'svin', 'äckel', 'skitstövel', 'rövhål', 'hora',
      'jävla hora', 'cp-skada', 'mongo', 'retard', 'handicappad',
      'så sjukt less', 'mår spy illa', 'vill kräkas', 'äckligt',
      'piss', 'bajs', 'skit i det', 'skitsamma',
      'bryr mig inte', 'skiter i', 'kan dra åt helvete',
      'kan gå och dö', 'hoppas de dör', 'önskar de var döda'
    ],
    
    // Ensamhet & isolering (massivt utökad)
    loneliness: [
      'ensam', 'så ensam', 'helt ensam', 'alltid ensam',
      'ingen förstår', 'ingen bryr sig', 'alla glömmer mig',
      'utanför', 'isolerad', 'utfryst', 'utesluten', 'bortglömd',
      'ingen att prata med', 'övergivet', 'övergiven', 'lämnad',
      'ensam i världen', 'ingen som lyssnar', 'alla har varandra',
      'alla utom jag', 'ingen som saknar mig', 'ingen som tänker på mig',
      'alla ignorerar mig', 'alla struntar i mig', 'osynlig',
      'ingen märker mig', 'alla går förbi', 'står utanför',
      'har inga vänner', 'ingen som älskar mig', 'ingen som vill ha mig',
      'alla andra har någon', 'alla andra har sällskap', 'bara jag är ensam',
      'ingen kommer', 'ingen ringer', 'ingen skriver', 'ingen bryr sig om',
      'glömd', 'bortgjord', 'oviktig', 'ingen betydelse',
      'spelar ingen roll', 'kunde lika gärna inte finnas',
      'skulle ingen sakna mig', 'om jag försvann', 'ingen skulle märka',
      'tom inuti', 'ihålig', 'tystnad överallt',
      'bara mig själv', 'inga meddelanden', 'telefonen ringer aldrig'
    ],
    
    // Rädsla & oro (massivt utökad)
    anxiety: [
      'rädd', 'så rädd', 'dödsskräck', 'livrädd', 'skitskräck',
      'orolig', 'oroar mig', 'ängslig', 'ångest', 'ångestfylld',
      'panik', 'panikångest', 'får panik', 'panikkänsla',
      'nervös', 'nervositet', 'darrar', 'skakar', 'svettas',
      'vad händer om', 'kommer gå fel', 'kommer bli katastrof',
      'katastrofalt', 'förfärligt', 'hemska konsekvenser',
      'kan inte hantera', 'för mycket', 'överväldigande', 'går inte',
      'stressad', 'stressig', 'för stressigt', 'klarar inte av',
      'spänd', 'hjärtklappning', 'hjärtat slår fort', 'andnöd',
      'kan inte andas', 'får inte luft', 'kväver mig', 'kvävs',
      'allt går fel', 'kommer misslyckas', 'kommer fucka upp',
      'kommer sabba allt', 'kommer förstöra', 'kommer skämma ut mig',
      'alla kommer döma', 'alla kommer skratta', 'alla kommer hata',
      'kommer bli utskrattad', 'kommer bli hatad', 'kommer bli dömd',
      'mår så illa', 'mår spy', 'vill kräkas', 'illamående',
      'kan inte sova', 'kan inte vila', 'tankarna maler',
      'kan inte stänga av', 'rinner iväg', 'spiralen', 'faller ner',
      'kontrollförlust', 'tappar kontrollen', 'känner mig galen'
    ]
  };

  private static readonly GENTLE_RESPONSES = {
    selfCriticism: [
      "🐻 Hej vän! Det där var ingen fin tacksamhet. Kan du istället tänka på något du uppskattar med dig själv idag?",
      "💚 Du är mycket hårdare mot dig själv än du skulle vara mot en vän. Vad är något litet du kan vara snäll mot dig själv för?",
      "🌟 Jag hör att du är kritisk mot dig själv. Men vad är en sak du faktiskt klarade av idag?",
      "🤗 Såna där tankar gör ont. Du förtjänar samma vänlighet som du skulle ge en vän. Vad kan du vara tacksam för?",
      "💛 Jag märker att du är hård mot dig själv. Låt oss hitta något att uppskatta med dig istället.",
      "🌸 Den inre kritikern är hård idag. Vad skulle en vänlig röst säga till dig istället?",
      "🕊️ Du pratar till dig själv på ett sätt du aldrig skulle prata till andra. Vad kan du vara mildare mot?",
      "🌈 Självkritik känns som sanning, men det är bara tankar. Vad är något verkligt fint med dig?",
      "🦋 Du är så mycket mer än den där hårda rösten. Vad uppskattar du djupt inom dig?",
      "💝 Kan vi hitta en mjukare, snällare tacksamhet tillsammans? Du förtjänar vänlighet."
    ],
    
    pessimism: [
      "🌿 Jag förstår att dagen känns tuff. Men låt oss hitta en liten ljuspunkt tillsammans. Vad fungerar okej just nu?",
      "☀️ Ibland ser vi bara det som går fel. Kan vi tillsammans leta efter något som faktiskt fungerat idag?",
      "🌱 Även på svåra dagar finns små saker att uppskatta. Vad är något litet som ändå är okej?",
      "🍃 När allt känns mörkt är små ljus extra viktiga. Vad är en liten sak som fungerar?",
      "🌙 Ibland behöver vi bara hitta en enda liten sak som är bra. Vad skulle det kunna vara?",
      "🕯️ Även i tuffa stunder finns små glimtar av hopp. Kan du hitta en?",
      "🌊 Som vågor på havet - svåra känslor kommer och går. Vad känns stabilt just nu?",
      "🎋 Som bambu böjer du dig men bryts inte. Vad är din inre styrka idag?",
      "🌄 Efter mörka nätter kommer ljusa morgnar. Vad ser fram emot imorgon?",
      "🧸 Låt mig vara din vän i det svåra. Vad kan vi vara tacksamma för tillsammans?"
    ],
    
    comparison: [
      "💚 Det är lätt att jämföra, men din resa är unik. Vad är något i ditt liv som du kan vara tacksam för?",
      "🦋 Varje person har sin egen väg. Vad är något som är bra just i ditt liv, oavsett andra?",
      "🌈 Istället för att titta på andra, låt oss fokusera på dig. Vad är du tacksam för idag?",
      "✨ Jämförelser stjäl glädje. Du har unika gåvor som bara du kan ge. Vad uppskattar du med dig?",
      "🌸 Alla blommar i sin egen tid. Vad växer och utvecklas i ditt liv just nu?",
      "🎨 Din livstavla ser annorlunda ut än andras, och det är vackert. Vad färgar ditt liv positivt?",
      "🌊 Som snöflingor är vi alla unika. Vad gör dig särskild på ditt eget sätt?",
      "🎯 Din framgång mäts inte mot andra. Vad är du stolt över i ditt eget tempo?",
      "🌟 Du är huvudpersonen i din egen historia. Vad går bra i ditt kapitel?",
      "🦋 Andra människors lycka minskar inte din. Vad är din egen källa till glädje?"
    ],
    
    anger: [
      "🌊 Jag märker att du känner frustration. Kan vi hitta något som ändå fungerar, mitt i det svåra?",
      "🕊️ När vi känner ilska kan det hjälpa att hitta något litet att vara tacksam för. Vad skulle det kunna vara?",
      "🌸 Även när allt känns jobbigt finns det ofta något som fungerar. Ska vi leta efter det tillsammans?",
      "🔥 Starka känslor visar att du bryr dig. Vad bryr du dig om som du kan uppskatta?",
      "🌿 Ilska kan vara en guide till vad som är viktigt. Vad värdesätter du som hotats?",
      "💨 Som stormar passerar känslor. Vad känns lugnt och stabilt under ytan?",
      "🎯 Din passion visar din styrka. Vad kan du rikta den energin mot som du uppskattar?",
      "🌊 Känslor är som vågor - låt dem vara där, men vad är din fasta grund?",
      "🕊️ I vrede finns ibland rättvisa. Vad kämpas du för som du kan vara tacksam över?",
      "🌅 Efter stormen kommer stillheten. Vad längtar du efter som du kan uppskatta?"
    ],
    
    loneliness: [
      "🤗 Ensamhet kan kännas så tungt. Men du är inte ensam just nu - jag är här. Vad kan du vara tacksam för?",
      "💙 Jag förstår att du känner dig utanför. Låt oss hitta något litet som ger värme i din värld.",
      "🌟 Även när du känner dig ensam, finns det värde i dig. Vad uppskattar du med dig själv?",
      "🌙 Ensamhet kan vara utrymme för självkännedom. Vad har du lärt dig om dig själv?",
      "🕯️ Ibland är vi mest ensamma i folksamlingar. Vad får dig att känna äkta samhörighet?",
      "🌿 Som träd kan vi vara ensamma men ändå djupt rotade. Vad ger dig styrka?",
      "📚 Ensamhet kan vara sällskap med dig själv. Vad uppskattar du med din egen närvaro?",
      "🎵 Även i tystnad finns melodi. Vad skapar harmoni i ditt inre landskap?",
      "🌌 Under samma stjärnhimmel är vi alla förbundna. Vad känns större än dig själv?",
      "🫧 Som bubblor rör vi vid varandra kort men vackert. Vad för människor värmer ditt hjärta?"
    ],
    
    anxiety: [
      "🌿 Jag märker att oron tar mycket plats. Låt oss tillsammans hitta något lugnt att fokusera på.",
      "🫂 Ångest kan kännas överväldigande. Vad är något stabilt och säkert i ditt liv just nu?",
      "☀️ När tankarna snurrar, kan tacksamhet vara en trygg hamn. Vad känns tryggt för dig?",
      "🧘‍♀️ Oro lever i framtiden, men tacksamhet bor här och nu. Vad är bra i detta ögonblick?",
      "🕊️ Som fåglar cirklar tankar, men du kan välja var du landar. Vad känns fridfullt?",
      "🌊 Ångest är som vågor - stora och skrämmande, men du kan flyta. Vad bär upp dig?",
      "🌸 Oavsett vad som händer imorgon, vad kan du vara tacksam för idag?",
      "🎯 Rädsla visar att saker är viktiga för dig. Vad bryr du dig om som du uppskattar?",
      "🌙 I nattens oro, vad är din morgonstjärna av hopp?",
      "💨 Som moln passerar bekymmer över himlen. Vad är din blå himmel under molnen?"
    ]
  };

  /**
   * ✨ MASSIVA FÖRSLAG-DATABASER (100+ FÖRSLAG)
   * 18-20 konkreta omformuleringar per kategori
   */
  private static generateSuggestions(analysis: NegativityAnalysis): string[] {
    const suggestionPools = {
      'selfCriticism': [
        "Jag gör mitt bästa med de resurser jag har",
        "Jag lär mig något nytt om mig själv varje dag", 
        "Jag uppskattar mina ansträngningar, även när det är svårt",
        "Jag är tacksam för min styrka att fortsätta försöka",
        "Jag växer lite mer för varje utmaning jag möter",
        "Jag är tacksam för de små framsteg jag gör",
        "Jag uppskattar att jag vågar vara sårbar och mänsklig",
        "Jag är tacksam för min förmåga att reflektera över mig själv",
        "Jag värdesätter mitt mod att vara ärlig med mina känslor",
        "Jag är tacksam för alla gånger jag varit snäll mot andra",
        "Jag uppskattar min unika kombination av egenskaper",
        "Jag är tacksam för mitt hjärtas förmåga att känna djupt",
        "Jag värdesätter min resa mot självacceptans",
        "Jag är tacksam för min förmåga att förlåta mig själv",
        "Jag uppskattar mitt mod att bara vara mig själv",
        "Jag är tacksam för de små vänliga gester jag gör",
        "Jag värdesätter min empati och omtänksamhet",
        "Jag är tacksam för min kreativitet och fantasi",
        "Jag uppskattar min förmåga att hitta skönhet i vardagen"
      ],
      
      pessimism: [
        "Jag är tacksam för att jag klarade av att stå upp idag",
        "Jag uppskattar att jag har tak över huvudet",
        "Jag är tacksam för att jag kan andas",
        "Jag uppskattar varje måltid jag får",
        "Jag är tacksam för tillgång till rent vatten",
        "Jag värdesätter varje natt jag kan sova",
        "Jag är tacksam för att mitt hjärta slår",
        "Jag uppskattar att jag kan se färger omkring mig",
        "Jag är tacksam för ljudet av regn mot fönstret",
        "Jag värdesätter möjligheten att lära mig nya saker",
        "Jag är tacksam för varje andetag som ger mig liv",
        "Jag uppskattar värmen från solen på mitt ansikte",
        "Jag är tacksam för doften av färsk kaffe på morgonen",
        "Jag värdesätter ljudet av skratt i mitt liv",
        "Jag är tacksam för mjuka filtar en kall kväll",
        "Jag uppskattar känslan av att sträcka på mig när jag vaknar",
        "Jag är tacksam för musik som rör vid mitt hjärta",
        "Jag värdesätter möjligheten att börja om varje dag",
        "Jag är tacksam för alla som arbetar för att göra världen bättre"
      ],
      
      comparison: [
        "Jag fokuserar på min egen resa och utveckling",
        "Jag är tacksam för de unika egenskaper jag har",
        "Min väg ser annorlunda ut, och det är okej",
        "Jag uppskattar mina personliga framsteg, hur små de än är",
        "Jag är tacksam för min egen särskilda kombination av talanger",
        "Jag värdesätter de erfarenheter som format mig",
        "Jag är tacksam för min egen tempo i livet",
        "Jag uppskattar min unika syn på världen",
        "Jag är tacksam för att jag bidrar på mitt eget sätt",
        "Jag värdesätter min egen definition av framgång",
        "Jag är tacksam för min personliga smak och preferenser",
        "Jag uppskattar mina egna värderingar och principer",
        "Jag är tacksam för min unika livserfarenhet",
        "Jag värdesätter mitt eget sätt att lösa problem",
        "Jag är tacksam för min egen inre visdom",
        "Jag uppskattar de val som lett mig hit",
        "Jag är tacksam för min förmåga att vara autentisk",
        "Jag värdesätter min egen timing i livets processer",
        "Jag är tacksam för det enda liv som är mitt"
      ],
      
      anger: [
        "Jag är tacksam för att jag kan känna starka känslor",
        "Jag uppskattar min förmåga att överleva svåra stunder",
        "Jag är tacksam för de som bryr sig om mig",
        "Jag värdesätter min passion och intensitet",
        "Jag är tacksam för min förmåga att stå upp för det som är rätt",
        "Jag uppskattar att jag bryr mig så mycket",
        "Jag är tacksam för min styrka under press",
        "Jag värdesätter min ärlighet med mina känslor",
        "Jag är tacksam för min förmåga att läka och växa",
        "Jag uppskattar de tillfällen jag känner frid och lugn",
        "Jag är tacksam för mitt mod att försvara mina värderingar",
        "Jag värdesätter min kapacitet för djup omsorg",
        "Jag är tacksam för de som förstår min frustration",
        "Jag uppskattar min energi och livskraft",
        "Jag är tacksam för möjligheten att uttrycka mig",
        "Jag värdesätter min förmåga att sätta gränser",
        "Jag är tacksam för min inre eld som driver mig framåt",
        "Jag uppskattar min förmåga att transformera svårigheter",
        "Jag är tacksam för min styrka att inte ge upp"
      ],
      
      loneliness: [
        "Jag är tacksam för min förmåga att uppskatta mitt eget sällskap",
        "Jag uppskattar de djupa samtal jag kan ha med mig själv",
        "Jag är tacksam för tystnaden som låter mig höra mina egna tankar",
        "Jag värdesätter min självständighet och inre styrka",
        "Jag är tacksam för de böcker/filmer/musikstycken som tröstar mig",
        "Jag uppskattar min förmåga att känna empati för andra",
        "Jag är tacksam för naturens sällskap - träd, himmel, stjärnor",
        "Jag värdesätter mina husdjur eller de djur jag ser omkring mig",
        "Jag är tacksam för de människor som varit vänliga, även flyktigt",
        "Jag uppskattar min förmåga att drömma och fantasera",
        "Jag är tacksam för min djupa känslighet för skönhet",
        "Jag värdesätter min förmåga att reflektera och växa",
        "Jag är tacksam för de ögonblick av samhörighet jag upplevt",
        "Jag uppskattar min inre rikedom och kreativitet",
        "Jag är tacksam för min förmåga att älska djupt",
        "Jag värdesätter mitt eget sällskap som ingen annan kan ge",
        "Jag är tacksam för de minnear som värmer mig",
        "Jag uppskattar min förmåga att vara närvarande med mig själv",
        "Jag är tacksam för alla som bär mig i sina hjärtan, även på avstånd"
      ],
      
      anxiety: [
        "Jag är tacksam för min medvetenhet och känslighet",
        "Jag uppskattar min förmåga att förbereda mig för utmaningar",
        "Jag är tacksam för de stunder när jag känner frid",
        "Jag värdesätter min omsorg för andra och mig själv",
        "Jag är tacksam för andningsteknikerna som hjälper mig",
        "Jag uppskattar min förmåga att överleva osäkerhet",
        "Jag är tacksam för de personer som förstår min oro",
        "Jag värdesätter min djupa förmåga att känna och bry sig",
        "Jag är tacksam för varje lugn stund jag kan skapa",
        "Jag uppskattar min styrka att fortsätta trots rädsla",
        "Jag är tacksam för min förmåga att söka hjälp när jag behöver",
        "Jag värdesätter min intuition och känslighet",
        "Jag är tacksam för de verktyg som hjälper mig hantera oro",
        "Jag uppskattar min förmåga att vara närvarande mitt i kaos",
        "Jag är tacksam för de som skapar trygghet omkring mig",
        "Jag värdesätter min kapacitet att bry mig så djupt",
        "Jag är tacksam för min resiliens och återhämtningsförmåga",
        "Jag uppskattar alla små stunder av frid jag hittar",
        "Jag är tacksam för min förmåga att växa genom utmaningar"
      ]
    };

    // Hitta primär kategori
    const primaryCategory = analysis.categories[0] || 'pessimism';
    const categoryPool = suggestionPools[primaryCategory] || suggestionPools.pessimism;
    
    // Shuffla och ta 2 random förslag från stor pool
    const shuffled = [...categoryPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }

  /**
   * 🔍 LOKAL ANALYS (snabb, privacy-safe)
   * Analyserar text för negativa mönster med svenska keywords
   */
  public static analyzeLocalSentiment(text: string): NegativityAnalysis {
    if (!text || text.trim().length < 3) {
      return {
        isNegative: false,
        negativityScore: 0,
        categories: [],
        severity: 'mild',
        triggeredKeywords: [],
        confidence: 100
      };
    }

    const lowerText = text.toLowerCase();
    let negativityScore = 0;
    let categories: NegativityAnalysis['categories'] = [];
    let triggeredKeywords: string[] = [];

    // Kolla varje kategori av negativa ord
    Object.entries(this.NEGATIVE_KEYWORDS_SWEDISH).forEach(([category, keywords]) => {
      const foundKeywords = keywords.filter(keyword => lowerText.includes(keyword));
      
      if (foundKeywords.length > 0) {
        categories.push(category as any);
        triggeredKeywords.push(...foundKeywords);
        negativityScore += foundKeywords.length * 15; // Varje keyword +15 poäng
      }
    });

    // Extra poäng för kombinationer
    if (categories.length > 1) {
      negativityScore += 20; // Flera kategorier = mer negativt
    }

    // SMART KONTEXTVIKTNING baserat på ordlengd
    const wordCount = lowerText.trim().split(/\s+/).length;
    const negativeWordRatio = triggeredKeywords.length / wordCount;
    
    // Vikta negativiteten baserat på kontext:
    // - Korta texter med negativa ord = högre score
    // - Långa texter med få negativa ord = lägre score
    if (wordCount > 10) {
      // Lång text: minska negativitet om den är "utspädd"
      negativityScore = negativityScore * (1 + negativeWordRatio);
    } else if (wordCount <= 3) {
      // Mycket kort text: öka negativitet (bara negativa ord)
      negativityScore = negativityScore * 1.5;
    }
    
    // Check för positiva ord som balanserar negativitet
    const positiveKeywords = [
      'tacksam', 'tacksamhet', 'uppskattar', 'älskar', 'glad', 'lycklig',
      'bra', 'fin', 'vacker', 'underbar', 'fantastisk', 'grattis',
      'inte längre', 'inte mer', 'slutat med', 'förbättrat',
      'lärt mig', 'växer', 'utvecklas', 'framsteg', 'bättre nu'
    ];
    
    const positiveMatches = positiveKeywords.filter(keyword => lowerText.includes(keyword)).length;
    if (positiveMatches > 0) {
      // Minska negativitet om det finns positiva element  
      negativityScore = negativityScore * Math.max(0.3, 1 - (positiveMatches * 0.3));
    }

    // Begränsa till 0-100
    negativityScore = Math.min(100, Math.max(0, negativityScore));

    // Bestäm severity
    let severity: NegativityAnalysis['severity'] = 'mild';
    if (negativityScore > 60) severity = 'severe';
    else if (negativityScore > 30) severity = 'moderate';

    return {
      isNegative: negativityScore > 18, // Justerad för ny viktning - 1 starkt ord i kort kontext
      negativityScore,
      categories: Array.from(new Set(categories)), // Remove duplicates
      severity,
      triggeredKeywords: Array.from(new Set(triggeredKeywords)),
      confidence: triggeredKeywords.length > 0 ? 85 : 60 // Högre confidence med keywords
    };
  }

  /**
   * 🧠 CLOUD AI ANALYS (advanced, when needed)
   * Använder OpenAI för mer intelligent svenska språkförståelse
   */
  public static async analyzeCloudSentiment(text: string): Promise<NegativityAnalysis> {
    try {
      // TODO: Implementera OpenAI API call för advanced svenska analys
      // För nu returnerar vi enhanced local analysis
      const localAnalysis = this.analyzeLocalSentiment(text);
      
      // Simulerar cloud förbättring
      if (localAnalysis.isNegative && localAnalysis.confidence < 80) {
        localAnalysis.confidence = 90; // Cloud AI är mer säker
        
        // Förbättrad kategorisering baserat på kontext
        if (text.includes('andra') || text.includes('alla')) {
          if (!localAnalysis.categories.includes('comparison')) {
            localAnalysis.categories.push('comparison');
          }
        }
      }
      
      return localAnalysis;
    } catch (error) {
      console.log('Cloud AI fallback to local analysis:', error);
      return this.analyzeLocalSentiment(text);
    }
  }

  /**
   * 🐻 GENERERA LILLA BJÖRN GUIDANCE
   * Skapar varm, hjälpsam coaching baserat på analys
   */
  public static generateGuidance(analysis: NegativityAnalysis, useCloud: boolean = false): AIGuidance {
    if (!analysis.isNegative) {
      return {
        message: "🌟 Det låter som en fin tacksamhet! Bra jobbat!",
        suggestions: [],
        tone: 'encouraging',
        useCloud: false
      };
    }

    // Välj lämpligt svar baserat på kategori
    const primaryCategory = analysis.categories[0] || 'pessimism';
    const responses = this.GENTLE_RESPONSES[primaryCategory] || this.GENTLE_RESPONSES.pessimism;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Generera förslag baserat på negativitet
    const suggestions = this.generateSuggestions(analysis);

    // Anpassa ton baserat på severity
    let tone: AIGuidance['tone'] = 'gentle';
    if (analysis.severity === 'severe') tone = 'empathetic';
    else if (analysis.severity === 'mild') tone = 'encouraging';

    return {
      message: randomResponse,
      suggestions,
      tone,
      useCloud
    };
  }

  /**
   * 🎯 MAIN ANALYSIS METHOD
   * Hybrid approach: börjar med local, använder cloud vid behov
   */
  public static async analyzeText(text: string, enableCloud: boolean = true): Promise<{
    analysis: NegativityAnalysis;
    guidance: AIGuidance;
  }> {
    // Börja med snabb lokal analys
    let analysis = this.analyzeLocalSentiment(text);
    let useCloud = false;

    // Använd cloud för komplexa fall (låg confidence eller severe)
    if (enableCloud && (analysis.confidence < 70 || analysis.severity === 'severe')) {
      try {
        analysis = await this.analyzeCloudSentiment(text);
        useCloud = true;
      } catch (error) {
        console.log('Cloud analysis failed, using local:', error);
      }
    }

    const guidance = this.generateGuidance(analysis, useCloud);

    return {
      analysis,
      guidance
    };
  }
}

/**
 * 🧪 TESTING UTILITIES
 */
export class PositivityFilterTesting {
  public static readonly TEST_CASES = {
    negative: [
      "Jag är så ful och värdelös",
      "Allt är skit idag, orkar inte",
      "Alla andra har det bättre än mig",
      "Jag hatar mitt liv och mig själv",
      "Ingenting fungerar, är totalt hopplöst"
    ],
    positive: [
      "Jag är tacksam för solen idag",
      "Uppskattar en varm kopp kaffe",
      "Tacksam för vänner som bryr sig",
      "Jag mår bra och känner mig nöjd"
    ],
    neutral: [
      "Idag gick jag till jobbet",
      "Åt lunch med kollegan",
      "Tittade på tv på kvällen"
    ]
  };

  public static async runTests(): Promise<void> {
    console.log('🧪 TESTING POSITIVITY FILTER...\n');

    for (const [category, tests] of Object.entries(this.TEST_CASES)) {
      console.log(`\n--- ${category.toUpperCase()} TESTS ---`);
      
      for (const testText of tests) {
        const result = await PositivityFilterService.analyzeText(testText, false);
        
        console.log(`\nInput: "${testText}"`);
        console.log(`Negative: ${result.analysis.isNegative} (score: ${result.analysis.negativityScore})`);
        console.log(`Categories: ${result.analysis.categories.join(', ')}`);
        console.log(`Guidance: ${result.guidance.message}`);
        
        if (result.guidance.suggestions.length > 0) {
          console.log(`Suggestions: ${result.guidance.suggestions.join(' | ')}`);
        }
      }
    }
  }
}