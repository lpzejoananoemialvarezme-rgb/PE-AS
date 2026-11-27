import {
  ACHIEVEMENTS,
  getAchievementProgressHint
} from '../data/achievements';
import {
  DEFAULT_GAME_TEXTS,
  DEFAULT_STAGES,
  PENAS_STORY_SCENES,
  StoryScenePhoto
} from '../data/defaultStages';
import {
  AchievementDefinition,
  MedalTier,
  GameTexts,
  PlayerProgress,
  StageData,
  TravelerProfileInfo,
  TravelerTrait
} from '../types/game';
import { AppLanguage } from './types';

const TRAVELER_PROFILES_EN: Record<TravelerTrait, TravelerProfileInfo> = {
  cultural: {
    trait: 'cultural',
    title: 'Cultural Traveler',
    subtitle: 'Guardian of Aymara Memory',
    description:
      'You travel to listen to the stories held in stones, plazas, painted caves, and textiles. You find deep meaning in Túpac Katari’s legacy, Yaya-Mama ceremonial art (father-mother tradition), and the symbolism of the aguayo (traditional Andean woven textile).',
    recommendation:
      'Explore Túpac Katari Plaza, the colonial church’s gold-leaf altarpiece, the rock-art caves, and the community weaving workshop.'
  },
  aventurero: {
    trait: 'aventurero',
    title: 'Highland Adventurer',
    subtitle: 'Conqueror of the Granite Crags',
    description:
      'You are driven by the crisp thrill of 4,000 meters above sea level, sheer granite walls, hidden caves, and viewpoints embracing the Cordillera Real.',
    recommendation:
      'Try the sport-climbing routes on the crags, hike up Cerro Calvario, and catch sunset from the Condor’s Nest Viewpoint.'
  },
  naturaleza: {
    trait: 'naturaleza',
    title: 'Nature Explorer',
    subtitle: 'Observer of Pachamama (Mother Earth)',
    description:
      'You connect with the stillness of the Altiplano, the soaring condor, sacred plants like k’oa (aromatic ceremonial herb) and yareta (ancient high-altitude cushion plant), and the harmony of apachetas (sacred stacked-stone cairns) on the mountain.',
    recommendation:
      'Walk the Pre-Hispanic Trail at dawn to spot vizcachas (Andean rock rodents) and condors while gazing at the snow-capped Condoriri peaks.'
  },
  comunitario: {
    trait: 'comunitario',
    title: 'Community & Culinary Traveler',
    subtitle: 'Friend of the Village & Its Flavors',
    description:
      'You discover every place through its people, traditional barter, and historic dishes born right in the village such as Plato Paceño and artisan bread.',
    recommendation:
      'Share a traditional meal and a warm Andean herbal tea with host families in Peñas after finishing your trail.'
  }
};

const TRAVELER_PROFILES_PT: Record<TravelerTrait, TravelerProfileInfo> = {
  cultural: {
    trait: 'cultural',
    title: 'Turista Cultural',
    subtitle: 'Guardião da Memória Aymara',
    description:
      'Você viaja para ouvir as histórias guardadas nas pedras, praças, cavernas pintadas e tecidos. Encontra sentido na memória de Túpac Katari, na arte Yaya-Mama (tradição cerimonial pai-mãe) e no simbolismo do aguayo (tecido andino tradicional).',
    recommendation:
      'Visite a Praça Túpac Katari, o retábulo dourado da igreja colonial, as cavernas com arte rupestre e a oficina têxtil da comunidade.'
  },
  aventurero: {
    trait: 'aventurero',
    title: 'Aventureiro de Altitude',
    subtitle: 'Conquistador dos Paredões de Granito',
    description:
      'Você busca a adrenalina limpa dos 4.000 metros, os paredões de granito, as cavernas escondidas e os mirantes que abraçam a Cordilheira Real.',
    recommendation:
      'Explore as rotas de escalada esportiva nos paredões, suba ao Calvário e contemple o entardecer do Mirante Ninho de Condores.'
  },
  naturaleza: {
    trait: 'naturaleza',
    title: 'Explorador da Natureza',
    subtitle: 'Observador da Pachamama (Mãe Terra)',
    description:
      'Você se conecta com o silêncio do Altiplano, o voo do condor, plantas sagradas como a k’oa (erva aromática cerimonial) e a yareta (planta milenar de altitude), e a harmonia das apachetas (montículos sagrados de pedras) na montanha.',
    recommendation:
      'Caminhe pelo Caminho Pré-Hispânico ao amanhecer para avistar vizcachas (roedores andinos) e condores diante dos picos nevados do Condoriri.'
  },
  comunitario: {
    trait: 'comunitario',
    title: 'Viajante Comunitário e Gastronômico',
    subtitle: 'Amigo do Povo e de Seus Sabores',
    description:
      'Você descobre cada destino por meio de sua gente, do escambo tradicional e dos sabores históricos nascidos no povoado, como o Plato Paceño e o pão artesanal.',
    recommendation:
      'Compartilhe um prato tradicional e um chá andino com as famílias anfitriãs de Peñas após completar sua jornada.'
  }
};

const GAME_TEXTS_EN: GameTexts = {
  titleScreen: {
    locationTag: 'Peñas · La Paz, Bolivia · ~4,000 m a.s.l.',
    gameTitle: 'Peñas: Path of the Guardian',
    heroSubtitle:
      'Embark on a journey from La Paz (~60 km) to the ancestral village of Peñas. Unlock all 7 stops from the Main Plaza to the Climbing Park and become a Guardian of Peñas.',
    tataWelcome:
      'Kamisaraki (How are you?), traveler! I am Tata. Welcome to Peñas, our ancestral village located about 60 kilometers (around 1.5 to 2 hours by road) from La Paz, at nearly 4,000 meters above sea level.',
    startButtonLabel: 'Start Adventure!',
    resumeButtonLabel: 'Continue Journey',
    newGameButtonLabel: 'New Game',
    footerHint:
      'Explore the route map, customize your full-body avatar, and listen to Tata at every stage'
  },
  mapScreen: {
    brandTitle: 'Peñas · La Paz',
    trailTitle: '7-Stage Trail in Peñas',
    narratorDefaultHint:
      'Advance through the 7 stages as you unlock relics to safeguard the historical memory of Peñas.',
    narratorAllCompleted:
      'You have lit all 7 relics of Peñas! You are now a Guardian of Peñas; open your final reward to see what awaits you.'
  },
  stageModal: {
    tataSpeakerTitle: 'Tata',
    introListenSubtitle: 'Tata’s Story · Read before starting',
    capsuleHeading: 'Did you know...?',
    startChallengeButton: 'Start Challenge',
    dualChoiceHeader: 'Choose 1 of the 2 available challenges to complete this stage:',
    traitSectionBadge: 'Personal question to discover your traveler spirit',
    relicUnlockedBadge: 'Relic Unlocked',
    finishStageButton: 'Continue'
  },
  victoryScreen: {
    headerKicker: '7 of 7 Relics Completed · Village of Peñas, La Paz',
    narratorClosing:
      'You completed all 7 stages with an open heart and earned the title of Guardian. Tap the ceremonial button to reveal your traveler profile and open your Peñas Travel Guide.',
    revealButtonText: 'Discover your traveler profile & your guide to explore Peñas',
    guideSectionLabel: 'Option 2 · Your Personalized Guide',
    guideTitle: 'Travel Guide for Visiting Peñas',
    guideDescription: 'Based on your traveler spirit, we crafted your ideal travel guide for Peñas.',
    guideButtonText: 'Download & begin the real-life adventure',
    surpriseBadge: 'Surprise Gift from the Peñas Community',
    surpriseButtonText: 'Click the trophy to download your surprise prize',
    surpriseHint:
      'Only when you download it will you discover the special gift the community prepared for your visit.'
  },
  travelerProfiles: TRAVELER_PROFILES_EN
};

const GAME_TEXTS_PT: GameTexts = {
  titleScreen: {
    locationTag: 'Peñas · La Paz, Bolívia · ~4.000 m de altitude',
    gameTitle: 'Peñas: Caminho do Guardião',
    heroSubtitle:
      'Empreenda uma travessia desde a cidade de La Paz (~60 km) até a comunidade ancestral de Peñas. Desbloqueie as 7 paradas da Praça Principal até o Parque de Escalada para se tornar Guardião de Peñas.',
    tataWelcome:
      'Kamisaraki (Como vai?), viajante! Eu sou Tata. Bem-vindo a Peñas, nosso povoado ancestral localizado a cerca de 60 quilômetros (entre 1 hora e meia e 2 horas de estrada) de La Paz, a quase 4.000 metros acima do nível do mar.',
    startButtonLabel: 'Começar o Jogo!',
    resumeButtonLabel: 'Continuar Travessia',
    newGameButtonLabel: 'Novo Jogo',
    footerHint:
      'Explore o mapa da rota, personalize seu avatar de corpo inteiro e ouça Tata em cada etapa'
  },
  mapScreen: {
    brandTitle: 'Peñas · La Paz',
    trailTitle: 'Rota das 7 Etapas em Peñas',
    narratorDefaultHint:
      'Avance pelas 7 etapas enquanto desbloqueia relíquias para guardar a memória histórica de Peñas.',
    narratorAllCompleted:
      'Você acendeu as 7 relíquias de Peñas! Agora você é Guardião de Peñas; abra sua recompensa final para descobrir o que lhe espera.'
  },
  stageModal: {
    tataSpeakerTitle: 'Tata',
    introListenSubtitle: 'Relato de Tata · Leia antes de começar',
    capsuleHeading: 'Você sabia que...?',
    startChallengeButton: 'Iniciar Desafio',
    dualChoiceHeader: 'Escolha 1 dos 2 desafios disponíveis para concluir esta etapa:',
    traitSectionBadge: 'Pergunta pessoal para descobrir seu perfil de viajante',
    relicUnlockedBadge: 'Relíquia Desbloqueada',
    finishStageButton: 'Continuar'
  },
  victoryScreen: {
    headerKicker: '7 de 7 Relíquias Concluídas · Povoado de Peñas, La Paz',
    narratorClosing:
      'Você concluiu as 7 etapas de coração aberto e se consagra como Guardião. Toque no botão cerimonial para descobrir que tipo de viajante você é e abrir seu Guia de Viagem para explorar Peñas.',
    revealButtonText: 'Descubra que tipo de viajante você é e seu guia para explorar Peñas',
    guideSectionLabel: 'Opção 2 · Seu Guia Personalizado',
    guideTitle: 'Guia de Viagem para Visitar Peñas',
    guideDescription: 'De acordo com o seu perfil de turista, montamos seu guia de viagem ideal em Peñas.',
    guideButtonText: 'Baixar e começar a aventura',
    surpriseBadge: 'Presente Surpresa da Comunidade de Peñas',
    surpriseButtonText: 'Clique no troféu para baixar seu prêmio surpresa',
    surpriseHint:
      'Somente ao baixá-lo você descobrirá o benefício especial que a comunidade preparou para a sua visita.'
  },
  travelerProfiles: TRAVELER_PROFILES_PT
};

const STAGES_EN: StageData[] = DEFAULT_STAGES.map((base, idx) => {
  switch (idx) {
    case 0:
      return {
        ...base,
        title: 'Túpac Katari Plaza',
        subtitle: 'Historic epicenter of 1781, Plato Paceño & Radio San Gabriel',
        eraOrElevation: '3,970 m a.s.l. · Main Plaza',
        relicName: 'Bronze Chakana (Andean Cross)',
        relicDescription: 'Andean symbol of the four cardinal directions and the undying memory of 1781.',
        primaryLabel: 'Katari’s Phrase',
        secondaryLabel: 'Assemble Plato Paceño',
        narratorIntro:
          'Let us begin the journey—I am Tata, and I will guide you to victory. We are now in the Main Plaza, where in 1781 Túpac Katari’s revolutionary uprising rose. Read the cards, answer the trivia, and beat the challenge to earn your first relic.',
        narratorSuccess:
          'Waliki (Well done / Excellent)! You honored the memory of Túpac Katari Plaza and the origin of Plato Paceño. The Bronze Chakana lights your path.',
        educationalCapsule:
          'Welcome to the Main Plaza of Peñas (3,970 m a.s.l.)! In 1781, Aymara leader Julián Apaza (Túpac Katari) and his wife Bartolina Sisa led the great indigenous uprising and laid siege to La Paz. Food scarcity brought together corn, potato, fava beans, and fried cheese, giving birth to Plato Paceño. Tried in the plaza’s old manor and executed on November 14, 1781, Katari proclaimed: "Volveré y seré millones" ("I will return and be millions"). Radio San Gabriel, pioneer in the Aymara language, was also born in this very plaza.',
        didYouKnowBullets: [
          {
            title: 'Plato Paceño was born of a siege in Peñas',
            detail:
              'During the 1781 siege of La Paz led by Túpac Katari, food shortages forced locals to combine Andean corn (choclo), potato, fava beans, and fried cheese, creating this iconic Bolivian dish.'
          },
          {
            title: 'An immortal cry',
            detail:
              'After being betrayed in Peñas, Katari was tried in the plaza manor and executed by four horses on November 14, 1781, proclaiming moments before: "Volveré y seré millones" ("I will return and I will be millions!").'
          },
          {
            title: 'Pioneers of radio',
            detail:
              'In this very plaza, Radio San Gabriel was founded in the 1950s—Bolivia’s first radio station broadcasting literacy and culture in the Aymara language.'
          }
        ],
        questionPrompt:
          'Arrange the carved stone blocks in order to form Túpac Katari’s final proclamation ("Volveré y seré millones" — I will return and be millions):',
        secondaryPrompt:
          'Prepare the 1781 Plato Paceño! Catch the traditional ingredients and dodge the rocks:',
        triviaPrompt: 'In what year did the siege of La Paz take place?',
        triviaOptions: ['1782', '1870', '1781'],
        options: [
          'Plato Paceño (corn, potato, fava beans, and fried cheese) and Radio San Gabriel in Aymara',
          'The Salteña and a mining railway station',
          'Silpancho and the first astronomical observatory',
          'Majadito and a colonial lakeside port'
        ],
        sceneCaption: 'Monument to Túpac Katari, Bartolina Sisa, and Gregoria Apaza in Peñas Main Plaza.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: '1781 Historical Monument',
            caption: 'Stepped base in wiphala (Andean multicolored banner), martyrdom mural, and stone sculpture of Bartolina Sisa.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Living Plaza & Flavors',
            caption: 'Virgen de la Natividad Café, vibrant murals, and handicraft stalls right off the plaza.'
          }
        ],
        travelerPrompt: 'Starting in the Main Plaza of Peñas, which story captivated you most?',
        travelerChoices: [
          { label: 'The courage and final proclamation of Túpac Katari and Bartolina Sisa', trait: 'cultural' },
          { label: 'The community origin of Plato Paceño during times of resistance', trait: 'comunitario' },
          { label: 'The power of the Andes surrounding the plaza at nearly 4,000 meters', trait: 'naturaleza' },
          { label: 'Following the historic trails leading up toward the rocky hills', trait: 'aventurero' }
        ]
      };
    case 1:
      return {
        ...base,
        title: 'Colonial Church & Virgin’s Footprints',
        subtitle: 'Gold-leaf altarpiece and devotion carved in the crag',
        eraOrElevation: '16th–18th Century · Colonial Temple',
        relicName: 'Golden Bell',
        relicDescription: 'Safeguards the gleam of the colonial altarpiece and the sacred footprints upon the rock.',
        primaryLabel: 'Magic Brush',
        narratorIntro:
          'Now we arrive at the Colonial Church of Peñas and the rock bearing the Virgin’s Footprints. Inside gleams a Baroque wooden altarpiece gilded in gold leaf. Read the cards below and complete the magic brush challenge to restore its splendor.',
        narratorSuccess:
          'Jallalla (Long live / May it flourish)! The gold leaf of the altarpiece shines again alongside the living faith of Peñas.',
        educationalCapsule:
          'The Colonial Church of Peñas houses a hand-painted vault with Andean floral motifs and a Baroque altarpiece clad in gold leaf. Beside it, in the sacred rock wall and the Miracle Grotto, the community venerates the Footprints of the Virgin of the Nativity—a powerful emblem of Andean syncretism.',
        didYouKnowBullets: [
          {
            title: 'A miracle against the mita',
            detail:
              'Around 1600, an indigenous man named Pedro Ticona tried to hang himself from the cliff rather than be forced into the mita (deadly forced labor in the Potosí mines); as he jumped, the rope snapped and the Virgin of the Nativity appeared to save him.'
          },
          {
            title: 'Footprints in the stone',
            detail:
              'On the rock wall beside the church you can see the "Virgin’s Footprints"—indentations in stone where local tradition says the Virgin stepped while descending the hill.'
          },
          {
            title: 'Gold in the highlands',
            detail:
              'Built around 1611, the church preserves inside a dazzling 18th-century wooden altarpiece finished entirely in gold leaf.'
          }
        ],
        questionPrompt:
          'Magic Brush: swipe across the altarpiece to dust away the centuries and reveal the gleaming gold leaf.',
        triviaPrompt:
          'What did the Virgin of the Nativity save Pedro Ticona from around 1600, and what decorates the church’s altarpiece?',
        triviaOptions: [
          'From a river flood; and the altarpiece is carved from white marble',
          'From a copper-mine collapse; and the altarpiece is wrought iron',
          'From forced mita labor in the Potosí mines; and the altarpiece is gilded in gold leaf',
          'From a plaza fire; and the altarpiece is painted with blue lime'
        ],
        sceneCaption: 'Carved pink-stone portal and colonial bell tower of the Church of Peñas.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Portal & Bell Tower',
            caption: 'Hand-carved pink stone arch and adobe belfry framed by old cypress trees.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Vault & Golden Altarpiece',
            caption: 'Ceiling painted with medallions and Andean flowers crowning the gold-leaf altarpiece.'
          }
        ],
        travelerPrompt: 'Contemplating the church art and the sacred cliff, what draws you most?',
        travelerChoices: [
          { label: 'Unraveling the blend between gilded Baroque art and Andean spirituality', trait: 'cultural' },
          { label: 'Chatting with local villagers who care for the church and organize festivals', trait: 'comunitario' },
          { label: 'Hiking toward the cliff walls where the natural grotto rests', trait: 'aventurero' },
          { label: 'Appreciating how natural rock blends seamlessly with the sanctuary', trait: 'naturaleza' }
        ]
      };
    case 2:
      return {
        ...base,
        title: 'Pre-Hispanic Trail & Saca Cuellos',
        subtitle: 'Totora basketry, Andean barter & sacred loom',
        eraOrElevation: 'Ancient Route · Terraces & Saca Cuellos',
        relicName: 'Thread of Barter',
        relicDescription: 'Weaves together pre-Hispanic trails, totora (Andean reed) basketry, and the community aguayo.',
        primaryLabel: 'Basket & Barter',
        secondaryLabel: 'Aguayo Loom Puzzle',
        narratorIntro:
          'We follow the ancient cobbled Pre-Hispanic Trail and the rocky pass of Saca Cuellos. For centuries, caravans walked these paths to barter goods between the Altiplano and the valleys. Read the cards and choose a challenge to complete this stage.',
        narratorSuccess:
          'Wise hands! With your barter basket packed and the aguayo (traditional Andean textile) restored, you honor the ancient Andean trails.',
        educationalCapsule:
          'The Pre-Hispanic Trail crossing Peñas and the Saca Cuellos sector linked the Altiplano to inter-Andean valleys through barter caravans. In woven totora reed baskets and colorful aguayos, families traded chuño (freeze-dried potato), quinoa, k’oa (ceremonial aromatic herb), and native potatoes under the reciprocity principle of ayni (mutual help).',
        didYouKnowBullets: [
          {
            title: 'The internet of the past',
            detail:
              'The stone-paved path and agricultural terraces called tacanas form part of the pre-Hispanic road network linking the highlands and valleys to trade potatoes, tarwi (Andean lupin), and llama meat.'
          },
          {
            title: 'The pass where your neck disappears',
            detail:
              'The rock formation "Saca Cuellos" is a natural crevice with a unique optical illusion: as you pass through, the rocks hide your torso so onlookers outside see only your head and feet.'
          },
          {
            title: 'Ancient engineering',
            detail:
              'The trail’s stone paving has withstood travelers, llama trains, and traders for more than 500 years.'
          }
        ],
        questionPrompt:
          'Weave your totora (Andean reed) basket step by step and fill it with chuño (freeze-dried potato), quinoa, k’oa, and native potatoes for barter:',
        secondaryPrompt:
          'Restore the Aguayo (sacred Andean textile) by swapping the loom tiles (3×3):',
        triviaPrompt: 'What optical illusion happens inside Saca Cuellos?',
        triviaOptions: [
          'The rocks hide your body and only your head is visible',
          'The crevices cast a giant shadow',
          'Neither your head nor your feet can be seen',
          'Only your hands are visible'
        ],
        puzzleCaption: 'Ceremonial Aguayo (Andean textile) featuring Chakana, Andean condors, and Cordillera Real peaks',
        sceneCaption: 'Stone-paved Pre-Hispanic Trail and ancestral farming terraces across the hills of Peñas.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Basketry & Museum',
            caption: 'Totora reed baskets and native highland goods used in traditional Andean barter.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Local Crafts',
            caption: 'Handmade hats, aguayo pouches, and cultural murals in the village center.'
          }
        ],
        travelerPrompt: 'If you joined an ancient barter caravan along the Pre-Hispanic Trail, what would you bring?',
        travelerChoices: [
          { label: 'Chuño (freeze-dried potato), quinoa, and native potatoes to share with other families', trait: 'comunitario' },
          { label: 'Woven aguayos carrying the ancestral iconography of Peñas', trait: 'cultural' },
          { label: 'Aromatic k’oa gathered along the slopes of the Altiplano', trait: 'naturaleza' },
          { label: 'Sturdy hiking boots to scramble through the Saca Cuellos pass', trait: 'aventurero' }
        ]
      };
    case 3:
      return {
        ...base,
        title: 'Kunkuntiji Cave (Mountain-Neck Grotto)',
        subtitle: 'Memory stones & sacred offerings',
        eraOrElevation: '4,080 m a.s.l. · Natural Cave',
        relicName: 'Stone of K’oa (Ceremonial Herb)',
        relicDescription: 'Preserves the ceremonial fragrance and ancient echo of Kunkuntiji Cave.',
        primaryLabel: 'Cave Stones',
        secondaryLabel: 'Echo Riddle',
        narratorIntro:
          'We climb up to Kunkuntiji Cave (grotto in the neck of the mountain), a natural cavern tucked among the crags of Peñas. In November 1781 it served as Túpac Katari’s final secret refuge and a place for offerings with k’oa (ceremonial aromatic herb). Read the cards below and choose a challenge to match its sacred pairs or solve the riddle of the echo.',
        narratorSuccess:
          'Sharp memory! The stones of Kunkuntiji Cave recognize the respect of those who listen to Pachamama (Mother Earth).',
        educationalCapsule:
          'Kunkuntiji Cave is a natural granite shelter high on the slopes of Peñas, traditionally used for quiet reflection and ceremonial offerings with k’oa. Nearby rock crevices shelter vizcachas (Andean chinchilla-like rodents), while condors glide overhead above ancient cushions of yareta.',
        didYouKnowBullets: [
          {
            title: 'The final hideout',
            detail:
              'In November 1781, after rebel forces withdrew, Túpac Katari used Kunkuntiji Cave as his secret command post.'
          },
          {
            title: 'Meaning in Aymara',
            detail:
              'In the Aymara language, the name Kunkuntiji evokes a sheltered cavity or grotto nestled in the neck of the mountain rocks.'
          },
          {
            title: 'The secret among the rocks',
            detail:
              'Spanish royalist forces tracked Katari down in this cave following a betrayal nearby before taking him to the plaza.'
          }
        ],
        questionPrompt:
          'Memory match in Kunkuntiji Cave: flip the stones and find all 6 sacred pairs (including k’oa, the aromatic Andean herb):',
        secondaryPrompt:
          'Listen to the echo inside Kunkuntiji Cave and solve Tata’s riddle:',
        triviaPrompt:
          'According to the "Did you know...?" cards, what did Túpac Katari use Kunkuntiji Cave for in November 1781?',
        triviaOptions: [
          'As a colonial vault to hide the church bells',
          'As his secret command hideout among the rocks',
          'As an astronomical lookout to view Lake Titicaca',
          'As a weaving workshop where the first aguayos were made'
        ],
        riddlePrompt:
          'I am a resinous, aromatic herb growing on the Altiplano; burned respectfully on ritual tables and inside sacred caves to thank Pachamama (Mother Earth), and I take the place of quinoa on the stones of this cave. What am I called?',
        riddleAcceptedVariants: ['koa', "k'oa", 'k oa', 'qoa', "q'oa", 'la koa', 'the koa'],
        riddleHints: [
          'Hint 1: My name is very short—just three letters (sometimes spelled with an apostrophe).',
          'Hint 2: It starts with "K" and ends with "A".',
          'Hint 3: You also placed me inside your totora barter basket in the previous stage.'
        ],
        sceneCaption: 'Kunkuntiji Cave (grotto in the neck of the mountain) · Granite cavern bathed in Andean stillness.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Kunkuntiji Granite Cavern',
            caption: 'Highland rock shelter honoring Aymara historical memory and spirituality.'
          }
        ],
        travelerPrompt: 'Inside an ancestral cave like Kunkuntiji, what connects you most deeply to the place?',
        travelerChoices: [
          { label: 'The ceremonial spirit of k’oa and offerings to Pachamama (Mother Earth)', trait: 'cultural' },
          { label: 'Exploring every granite nook and cranny with a headlamp in hand', trait: 'aventurero' },
          { label: 'Observing the shelter it gives highland wildlife like the vizcacha', trait: 'naturaleza' },
          { label: 'Listening to the oral legends passed down by village elders', trait: 'comunitario' }
        ]
      };
    case 4:
      return {
        ...base,
        title: 'Qillqantiji Cave (Painted Rock Shelter)',
        subtitle: 'Three-headed serpent & Yaya-Mama style (father-mother tradition)',
        eraOrElevation: 'Pre-Hispanic Heritage · Rock Shelter',
        relicName: 'Yaya-Mama Ochre Brush',
        relicDescription: 'Restores the red and yellow mineral pigments painted upon the rock thousands of years ago.',
        primaryLabel: '3-Headed Serpent',
        narratorIntro:
          'We reach Qillqantiji Cave (rock shelter with painted art), whose cliff face guards millennia-old rock paintings. Here stand mythical three-headed serpents painted in mineral pigments of the Yaya-Mama style (ceremonial father-mother tradition). Read the cards below, ace the trivia, and restore the ancient painting.',
        narratorSuccess:
          'Ancient artwork restored! The Three-Headed Serpent of the Yaya-Mama tradition breathes anew upon the rock of Qillqantiji.',
        educationalCapsule:
          'Qillqantiji Cave preserves priceless rock paintings made with red and yellow mineral pigments linked to the Formative religious tradition of Lake Titicaca known as Yaya-Mama ("father-mother"). Its centerpiece is the mythical three-headed serpent, symbolizing water, fertility, and Andean duality.',
        didYouKnowBullets: [
          {
            title: 'Two- and three-headed serpents',
            detail:
              'Qillqantiji’s rock art includes rare regional depictions of two- and three-headed serpents (amphisbaenas) and ancestral masks from the Formative Period’s Yaya-Mama tradition.'
          },
          {
            title: 'Three mineral colors',
            detail:
              'Ancient artists ground natural mineral pigments to paint figures in three colors: red ochre, white, and yellow.'
          },
          {
            title: 'A protected treasure',
            detail:
              'To prevent damage and graffiti, SIARB and the Peñas community installed a protective perimeter fence that can only be entered with local guides.'
          }
        ],
        questionPrompt:
          'Pick a mineral pigment (Red or Yellow) and connect the dots on the rock wall to restore the Three-Headed Serpent:',
        triviaPrompt:
          'Which pre-Hispanic archaeological style do Qillqantiji’s rock paintings belong to, and which mineral colors were used?',
        triviaOptions: [
          'Mestizo Baroque style, using green and gold dyes',
          'European Neoclassical style, using blue and silver paint',
          'Yaya-Mama style (father-mother tradition), using red ochre, white, and yellow pigments',
          'Contemporary Minimalist style, using black charcoal only'
        ],
        sceneCaption: 'Qillqantiji Cave (rock shelter with painted art) · Ancient rock art in mineral pigments.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Original Rock Painting',
            caption: 'Photographic record on stone showing the mythical stepped three-headed serpent.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Qillqantiji Rock Shelter',
            caption: 'Granite overhang safeguarding pre-Hispanic strokes of the Yaya-Mama tradition.'
          }
        ],
        travelerPrompt: 'Standing before rock paintings thousands of years old, what moves you most?',
        travelerChoices: [
          { label: 'Decoding the Yaya-Mama symbolism of the three-headed serpent', trait: 'cultural' },
          { label: 'Understanding how mineral pigments were gathered straight from the earth', trait: 'naturaleza' },
          { label: 'Reaching hidden rock shelters along rugged mountain footpaths', trait: 'aventurero' },
          { label: 'Protecting the site alongside the community so it remains unharmed', trait: 'comunitario' }
        ]
      };
    case 5:
      return {
        ...base,
        title: 'Calvario & Carmen Pata Ruins',
        subtitle: 'Apachetas (sacred stone cairns) & processional crosses',
        eraOrElevation: '4,180 m a.s.l. · Cerro Calvario',
        relicName: 'Calvario Stone Cross',
        relicDescription: 'Symbol of faith, spiritual balance, and good fortune on the heights of Peñas.',
        primaryLabel: 'Stack Stones',
        secondaryLabel: 'Find Crosses',
        narratorIntro:
          'We ascend past the 14 crosses of Cerro Calvario to the ancient ruins of Carmen Pata—here religious syncretism lives every day. Read the cards, answer the trivia, and choose your challenge to continue your path.',
        narratorSuccess:
          'Steady balance and sharp eyes! Your apacheta (sacred stone cairn) and the crosses of Calvario bless the final stretch of your expedition.',
        educationalCapsule:
          'On Cerro Calvario and beside the historic Ruins of El Carmen, pilgrims practice two living traditions: balancing apachetas (sacred stone cairns) to ask Pachamama for health and prosperity, and walking the stations marked by white processional crosses along the rocky ridge.',
        didYouKnowBullets: [
          {
            title: 'Tiny houses for your dreams',
            detail:
              'Visitors build miniature stone houses called ch’akras at the summit as heartfelt offerings to Pachamama for a home, livelihood, or prosperity.'
          },
          {
            title: '14 processional crosses',
            detail:
              'The climb up the hillside is lined with 14 white crosses clearly visible all the way from the village’s main plaza.'
          },
          {
            title: 'Ruins at the summit',
            detail:
              'At the top stand the remains of the Colonial Chapel of El Carmen, built atop an ancient Pacajes and Inca ceremonial site.'
          }
        ],
        questionPrompt:
          'Good-fortune Apacheta (sacred cairn): carefully balance 5 stones without toppling the stack to thank Pachamama:',
        secondaryPrompt:
          'Processional Path: spot and mark all 4 hidden crosses across the rocky hillside and Carmen Ruins:',
        triviaPrompt:
          'How many white crosses mark the climb up Calvario, and what are the miniature symbolic stone houses built by visitors called?',
        triviaOptions: [
          '7 golden crosses, and the miniature houses are called tacanas',
          '14 white crosses, and the miniature stone houses are called ch’akras',
          '12 wooden crosses, and the miniature houses are called tambos',
          '20 granite crosses, and the miniature houses are called qullqas'
        ],
        sceneCaption: 'Cerro Calvario and El Carmen Ruins · Balanced stones and hilltop crosses.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Cerro Calvario',
            caption: 'Good-fortune apachetas (stone cairns) and devotional crosses across the crags.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Trails & Wayfinding',
            caption: 'Waymarked footpaths leading to the Miracle Grotto, Calvario, and snowy peaks.'
          }
        ],
        travelerPrompt: 'Upon reaching Calvario and the Ruins of El Carmen, what would you do first?',
        travelerChoices: [
          { label: 'Quietly stack stones in gratitude to Pachamama (Mother Earth)', trait: 'naturaleza' },
          { label: 'Walk each station while studying the masonry of the ruins', trait: 'cultural' },
          { label: 'Keep climbing up toward the highest rocky ridge', trait: 'aventurero' },
          { label: 'Share wishes of well-being for my family and community', trait: 'comunitario' }
        ]
      };
    case 6:
    default:
      return {
        ...base,
        title: 'Condor’s Nest Viewpoint & Climbing',
        subtitle: '360° Cordillera Real panorama & granite wall',
        eraOrElevation: '4,300 m a.s.l. · Summit & Crags',
        relicName: 'Carabiner of the Condor',
        relicDescription: 'Supreme seal of the climber who topped the crags and beheld the Cordillera Real.',
        primaryLabel: 'Climb the Wall',
        narratorIntro:
          'You have reached the seventh and final stage—the Condor’s Nest Viewpoint! From these rocky crags, sunset opens toward the Cordillera Real while sport-climbing routes await. Read the cards below, ace the trivia, and climb the wall to graduate as a Guardian of Peñas.',
        narratorSuccess:
          'Jallalla (Long live!), Guardian of Peñas! All 7 relics shine together on the summit. Now discover your traveler profile and your secret guide to exploring Peñas.',
        educationalCapsule:
          'At 4,300 m a.s.l., the Condor’s Nest Viewpoint (Wiraconi) rewards climbers with a 360-degree panorama across the Altiplano and the glaciers of the Cordillera Real (Condoriri, Huayna Potosí, and Illampu). Right beside its solid granite walls sits the Peñas Climbing Park—Bolivia’s flagship site for leave-no-trace climbing.',
        didYouKnowBullets: [
          {
            title: 'Bolivia’s climbing capital',
            detail:
              'Peñas is Bolivia’s rock-climbing mecca with over 150 routes on red conglomerate and sandstone crags, plus ziplines and a via ferrata championed by Father Antonio Zavatarelli ("the climbing priest").'
          },
          {
            title: '360° panoramic summit',
            detail:
              'From Condor’s Nest you can take in Lake Titicaca and the snowy giants of the Cordillera Real—Chachacomani, Huayna Potosí, and Illampu—all at once.'
          },
          {
            title: 'Artisan cheese & k’oa liqueur',
            detail:
              'Peñas is also renowned for its highland cow’s-milk farmstead cheese and an exclusive small-batch herbal liqueur distilled with ceremonial k’oa.'
          }
        ],
        questionPrompt:
          'Climb the granite cliff of Peñas by picking solid holds, packing out litter, and reaching Condor’s Summit:',
        triviaPrompt:
          'From the Condor’s Nest Viewpoint, Lake Titicaca can be seen alongside which majestic snow-capped mountain range (home to Huayna Potosí and Illampu)?',
        triviaOptions: [
          'Western Cordillera (Cordillera Occidental)',
          'Aguaragüe Range',
          'Sama Range',
          'Cordillera Real'
        ],
        sceneCaption: 'Panoramic view from Condor’s Nest Viewpoint across the Altiplano and Cordillera Real.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Condor’s Nest Viewpoint',
            caption: '360° vista looking down on Peñas village, the Altiplano, and the Cordillera Real glaciers.'
          }
        ],
        travelerPrompt: 'At the summit of Peñas with all 7 relics gathered, how do you crown your journey?',
        travelerChoices: [
          { label: 'Watching the condor soar before the Cordillera Real', trait: 'naturaleza' },
          { label: 'Celebrating the ascent up the park’s granite walls', trait: 'aventurero' },
          { label: 'Keeping every ancestral story and symbol alive in memory', trait: 'cultural' },
          { label: 'Heading back down to the village to celebrate with guides and neighbors', trait: 'comunitario' }
        ]
      };
  }
});

const STAGES_PT: StageData[] = DEFAULT_STAGES.map((base, idx) => {
  switch (idx) {
    case 0:
      return {
        ...base,
        title: 'Praça de Túpac Katari',
        subtitle: 'Epicentro histórico de 1781, Plato Paceño e Rádio San Gabriel',
        eraOrElevation: '3.970 m s. n. m. · Praça Principal',
        relicName: 'Chakana (cruz andina) de Bronze',
        relicDescription: 'Símbolo andino dos quatro pontos cardeais e da memória imortal de 1781.',
        primaryLabel: 'Frase de Katari',
        secondaryLabel: 'Montar Plato Paceño',
        narratorIntro:
          'Comecemos a travessia, eu sou Tata e vou guiar você à vitória. Agora estamos na Praça principal, onde em 1781 se ergueu o levante revolucionário de Túpac Katari. Leia as fichas, responda à trivia e vença o desafio para conquistar sua primeira relíquia.',
        narratorSuccess:
          'Waliki (Muito bem / Excelente)! Você honrou a memória da Praça de Túpac Katari e a origem do Plato Paceño. A Chakana de Bronze ilumina o seu caminho.',
        educationalCapsule:
          'Bem-vindo à Praça Principal de Peñas (3.970 m de altitude)! Em 1781, o líder aymara Julián Apaza (Túpac Katari) e sua esposa Bartolina Sisa comandaram a grande rebelião indígena sitiando La Paz. A escassez de alimentos uniu milho andino, batata, favas e queijo frito, dando origem ao Plato Paceño. Julgado no casarão da praça e executado em 14 de novembro de 1781, Katari proclamou: "Volveré y seré millones" ("Voltarei e serei milhões"). Nessa mesma praça nasceu a Rádio San Gabriel em língua aymara.',
        didYouKnowBullets: [
          {
            title: 'O Plato Paceño nasceu de uma guerra em Peñas',
            detail:
              'Durante o cerco a La Paz liderado por Túpac Katari em 1781, a falta de alimentos obrigou a combinar milho andino (choclo), batata, favas e queijo frito, originando esse prato emblemático.'
          },
          {
            title: 'Um grito imortal',
            detail:
              'Após ser traído em Peñas, Katari foi julgado no casarão da praça e executado por quatro cavalos em 14 de novembro de 1781, mas antes proclamou: "¡Volveré y seré millones!" ("Voltarei e serei milhões!").'
          },
          {
            title: 'Pioneiros do rádio',
            detail:
              'Nessa mesma praça nasceu a Rádio San Gabriel nos anos 50, a primeira emissora do país a transmitir alfabetização e cultura em língua aymara.'
          }
        ],
        questionPrompt:
          'Ordene os blocos de pedra esculpida com a última proclamação de Túpac Katari ("Volveré y seré millones" — Voltarei e serei milhões):',
        secondaryPrompt:
          'Prepare o Plato Paceño de 1781! Pegue os ingredientes necessários e desvie das pedras:',
        triviaPrompt: 'Em que ano ocorreu o cerco a La Paz?',
        triviaOptions: ['1782', '1870', '1781'],
        options: [
          'O Plato Paceño (milho, batata, favas e queijo frito) e a Rádio San Gabriel em língua aymara',
          'A Salteña e uma estação ferroviária mineradora',
          'O Silpancho e o primeiro observatório astronômico',
          'O Majadito e um porto lacustre colonial'
        ],
        sceneCaption: 'Monumento a Túpac Katari, Bartolina Sisa e Gregoria Apaza na Praça Principal de Peñas.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Monumento Histórico 1781',
            caption: 'Base escalonada em wiphala (bandeira multicolorida andina), mural do martírio e escultura de Bartolina Sisa em pedra.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Praça Viva e Sabores',
            caption: 'Cafeteria Virgen de la Natividad, murais coloridos e barracas de artesanato junto à praça.'
          }
        ],
        travelerPrompt: 'Ao começar na Praça Principal de Peñas, qual história mais encantou você?',
        travelerChoices: [
          { label: 'A coragem e a última proclamação de Túpac Katari e Bartolina Sisa', trait: 'cultural' },
          { label: 'A origem comunitária do Plato Paceño em tempos de resistência', trait: 'comunitario' },
          { label: 'A força dos Andes que cercam a praça a quase 4.000 metros', trait: 'naturaleza' },
          { label: 'Seguir as trilhas históricas que sobem em direção aos morros', trait: 'aventurero' }
        ]
      };
    case 1:
      return {
        ...base,
        title: 'Igreja Colonial e Pegadas da Virgem',
        subtitle: 'Retábulo em folha de ouro e devoção na rocha',
        eraOrElevation: 'Séculos XVI–XVIII · Templo Colonial',
        relicName: 'Sino Dourado',
        relicDescription: 'Guarda o brilho do retábulo colonial e as sagradas pegadas sobre a rocha.',
        primaryLabel: 'Pincel Mágico',
        narratorIntro:
          'Agora chegamos à Igreja Colonial de Peñas e à rocha onde se preservam as Pegadas da Virgem. Em seu interior brilha um retábulo barroco entalhado em madeira e revestido com folha de ouro. Leia as fichas abaixo e vença o desafio do pincel mágico para devolver seu esplendor.',
        narratorSuccess:
          'Jallalla (Viva! / Que floresça!)! A folha de ouro do retábulo volta a resplandecer junto à fé viva de Peñas.',
        educationalCapsule:
          'A Igreja Colonial de Peñas guarda uma abóbada pintada à mão com motivos florais andinos e um retábulo barroco folheado a ouro. Ao lado, na parede rochosa e na Gruta do Milagre, a comunidade venera as chamadas Pegadas da Virgem da Natividade, símbolo do sincretismo andino.',
        didYouKnowBullets: [
          {
            title: 'Um milagre contra a mita',
            detail:
              'Por volta de 1600, o indígena Pedro Ticona tentou se enforcar na rocha para não ser levado à mita (trabalho mortal nas minas de Potosí); ao saltar, a corda se rompeu e a Virgem da Natividade apareceu para salvá-lo.'
          },
          {
            title: 'Marcas na pedra',
            detail:
              'Na parede rochosa ao lado do templo veem-se as "Pegadas da Virgem", cavidades na pedra onde a tradição conta que a Virgem caminhou ao descer o morro.'
          },
          {
            title: 'Ouro no altiplano',
            detail:
              'O templo (erguido por volta de 1611) guarda em seu interior um deslumbrante retábulo do século XVIII talhado em madeira e decorado inteiramente em folha de ouro.'
          }
        ],
        questionPrompt:
          'Pincel Mágico: deslize o dedo ou o cursor sobre o retábulo para limpar a poeira dos séculos e revelar a folha de ouro.',
        triviaPrompt:
          'Do que a Virgem da Natividade salvou Pedro Ticona por volta de 1600 e com o que está decorado o retábulo do templo?',
        triviaOptions: [
          'De uma enchente do rio; e o retábulo é talhado em mármore branco',
          'De um desabamento na mina de cobre; e o retábulo é de ferro forjado',
          'De ser levado à mita nas minas de Potosí; e o retábulo é decorado em folha de ouro',
          'De um incêndio na praça; e o retábulo é pintado com cal azul'
        ],
        sceneCaption: 'Fachada esculpida em pedra rosada e campanário colonial do Templo de Peñas.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Portada e Campanário',
            caption: 'Arco esculpido em pedra rosada e torre de adobe cercada por antigos ciprestes.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Abóbada e Retábulo Dourado',
            caption: 'Teto pintado com medalhões e flores andinas sobre o retábulo em folha de ouro.'
          }
        ],
        travelerPrompt: 'Ao contemplar a arte do templo e a rocha sagrada, o que mais atrai você?',
        travelerChoices: [
          { label: 'Decifrar o sincretismo entre o barroco dourado e a espiritualidade andina', trait: 'cultural' },
          { label: 'Conversar com os moradores que cuidam do templo e organizam as festas', trait: 'comunitario' },
          { label: 'Caminhar rumo aos paredões onde repousa a gruta natural', trait: 'aventurero' },
          { label: 'Apreciar como a pedra natural se integra ao santuário', trait: 'naturaleza' }
        ]
      };
    case 2:
      return {
        ...base,
        title: 'Caminho Pré-Hispânico e Saca Cuellos',
        subtitle: 'Cesto de totora, escambo andino e tear sagrado',
        eraOrElevation: 'Rota Milenar · Terraços e Saca Cuellos',
        relicName: 'Fio do Escambo',
        relicDescription: 'Entrelaça os caminhos pré-hispânicos, a cestaria em totora (junco andino) e o aguayo comunitário.',
        primaryLabel: 'Cesto e Escambo',
        secondaryLabel: 'Tear do Aguayo',
        narratorIntro:
          'Seguimos o antigo Caminho Pré-Hispânico calçado em pedra e a passagem rochosa de Saca Cuellos. Por essas trilhas caminharam caravanas durante séculos para praticar o escambo entre o Altiplano e os vales. Leia as fichas e escolha um desafio para concluir esta etapa.',
        narratorSuccess:
          'Mãos sábias! Com seu cesto pronto para o escambo e o aguayo (tecido tradicional andino) em ordem, você honra os antigos caminhos andinos.',
        educationalCapsule:
          'O Caminho Pré-Hispânico que atravessa Peñas e o setor de Saca Cuellos conectava o Altiplano aos vales interandinos por meio de caravanas de escambo. Em cestos tecidos em totora (junco andino) e aguayos coloridos trocavam-se chuño (batata desidratada), quinoa, k’oa (erva cerimonial) e batata nativa segundo a reciprocidade do ayni (ajuda mútua).',
        didYouKnowBullets: [
          {
            title: 'A internet do passado',
            detail:
              'O caminho empedrado e os terraços agrícolas chamados tacanas fazem parte da rede viária pré-hispânica que ligava o altiplano aos vales para trocar batata, tarwi (tremoço andino) e carne de lhama.'
          },
          {
            title: 'A passagem onde você perde o pescoço',
            detail:
              'A formação rochosa "Saca Cuellos" é uma fenda natural com uma ilusão de ótica única: ao atravessá-la, as rochas ocultam o seu corpo e de fora veem-se apenas a cabeça e os pés.'
          },
          {
            title: 'Engenharia milenar',
            detail:
              'As pedras da trilha resistiram ao trânsito de caminhantes, tropas de lhamas e comerciantes há mais de 500 anos.'
          }
        ],
        questionPrompt:
          'Teça seu cesto de totora (junco andino) passo a passo e encha-o com chuño (batata desidratada), quinoa, k’oa e batata para o escambo:',
        secondaryPrompt:
          'Reconstrua o Aguayo (tecido sagrado andino) trocando as peças do tear (3×3):',
        triviaPrompt: 'Que ilusão de ótica ocorre em Saca Cuellos?',
        triviaOptions: [
          'As rochas ocultam seu corpo e só se vê a cabeça',
          'As fendas criam uma sombra enorme',
          'Não se veem nem a cabeça nem os pés',
          'Só se veem as mãos'
        ],
        puzzleCaption: 'Aguayo cerimonial (tecido andino) com Chakana, condores andinos e picos da Cordilheira Real',
        sceneCaption: 'Caminho Pré-Hispânico calçado em pedra e terraços agrícolas ancestrais entre os morros de Peñas.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Cestaria e Museu',
            caption: 'Cestos de totora (junco andino) e produtos nativos usados no escambo andino.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Artesanato Local',
            caption: 'Chapéus artesanais, estojos de aguayo e murais culturais no povoado.'
          }
        ],
        travelerPrompt: 'Se você participasse de um escambo ancestral pelo Caminho Pré-Hispânico, o que levaria?',
        travelerChoices: [
          { label: 'Chuño (batata desidratada), quinoa e batatas nativas para partilhar com outras famílias', trait: 'comunitario' },
          { label: 'Aguayos (tecidos andinos) com iconografia simbólica de Peñas', trait: 'cultural' },
          { label: 'K’oa (planta aromática cerimonial) colhida nas encostas do Altiplano', trait: 'naturaleza' },
          { label: 'Um bom par de botas para atravessar a fenda de Saca Cuellos', trait: 'aventurero' }
        ]
      };
    case 3:
      return {
        ...base,
        title: 'Caverna Kunkuntiji (gruta no colo da montanha)',
        subtitle: 'Pedras da memória e oferendas sagradas',
        eraOrElevation: '4.080 m de altitude · Gruta Natural',
        relicName: 'Pedra de K’oa (Erva Cerimonial)',
        relicDescription: 'Guarda a fragrância cerimonial e o eco milenar da Caverna Kunkuntiji.',
        primaryLabel: 'Pedras da Caverna',
        secondaryLabel: 'Enigma do Eco',
        narratorIntro:
          'Subimos até a Caverna Kunkuntiji (gruta no colo da montanha), uma cavidade natural escondida entre os rochedos de Peñas. Em novembro de 1781 serviu como último refúgio secreto de Túpac Katari e espaço de oferendas com k’oa (erva aromática cerimonial). Leia as fichas abaixo e escolha um desafio para revelar os pares sagrados ou decifrar o enigma do eco.',
        narratorSuccess:
          'Excelente memória! As pedras da Caverna Kunkuntiji reconhecem o respeito de quem escuta a Pachamama (Mãe Terra).',
        educationalCapsule:
          'A Caverna Kunkuntiji é uma cavidade granítica natural nas encostas altas de Peñas usada tradicionalmente como espaço de recolhimento e oferendas com k’oa. Em suas fendas próximas vivem vizcachas (roedores andinos), e nos arredores observa-se o voo do condor sobre touceiras de yareta.',
        didYouKnowBullets: [
          {
            title: 'O último refúgio',
            detail:
              'Em novembro de 1781, após a retirada das tropas rebeldes, Túpac Katari usou a caverna Kunkuntiji como seu centro secreto de operações.'
          },
          {
            title: 'Significado em aymara',
            detail:
              'Na língua aymara, o nome Kunkuntiji evoca a gruta ou cavidade natural abrigada no colo das rochas da montanha.'
          },
          {
            title: 'O segredo entre as rochas',
            detail:
              'As autoridades realistas espanholas descobriram Katari nessa caverna após uma delação nas redondezas, antes de levá-lo à praça.'
          }
        ],
        questionPrompt:
          'Jogo da memória na Caverna Kunkuntiji: vire as pedras e encontre os 6 pares sagrados (incluindo k’oa, erva aromática andina):',
        secondaryPrompt:
          'Escute o eco dentro da Caverna Kunkuntiji e decifre o enigma de Tata:',
        triviaPrompt:
          'Segundo as fichas de «Você sabia que...?», para que Túpac Katari usou a Caverna Kunkuntiji em novembro de 1781?',
        triviaOptions: [
          'Como depósito colonial para guardar os sinos do templo',
          'Como seu centro secreto de operações entre as rochas',
          'Como mirante astronômico para observar o Lago Titicaca',
          'Como oficina têxtil onde se teciam os primeiros aguayos'
        ],
        riddlePrompt:
          'Sou uma planta aromática de raminhos resinosos que cresce no Altiplano; sou acesa com respeito em mesas rituais e cavernas sagradas para agradecer à Pachamama (Mãe Terra), e substituo a quinoa nas pedras desta caverna. Como me chamo?',
        riddleAcceptedVariants: ['koa', "k'oa", 'k oa', 'qoa', "q'oa", 'la koa', 'a koa'],
        riddleHints: [
          'Dica 1: Meu nome é bem curto, de apenas três letras (às vezes escrito com apóstrofo).',
          'Dica 2: Começa com "K" e termina com "A".',
          'Dica 3: Você também a colocou dentro do seu cesto de totora para o escambo na etapa anterior.'
        ],
        sceneCaption: 'Caverna Kunkuntiji (gruta no colo da montanha) · Abóbada natural de granito iluminada pelo silêncio andino.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Caverna Granítica Kunkuntiji',
            caption: 'Abrigo de rocha nas encostas altas onde se preserva a memória e a espiritualidade aymara.'
          }
        ],
        travelerPrompt: 'Dentro de uma caverna ancestral como Kunkuntiji, o que mais conecta você ao lugar?',
        travelerChoices: [
          { label: 'A energia cerimonial da k’oa e as oferendas à Pachamama (Mãe Terra)', trait: 'cultural' },
          { label: 'Explorar cada recanto de rocha granítica com lanterna na mão', trait: 'aventurero' },
          { label: 'Observar o abrigo que oferece à fauna de altitude como a vizcacha', trait: 'naturaleza' },
          { label: 'Compartilhar as lendas orais contadas pelos avós do povoado', trait: 'comunitario' }
        ]
      };
    case 4:
      return {
        ...base,
        title: 'Caverna Qillqantiji (abrigo rochoso pintado)',
        subtitle: 'Serpente de 3 cabeças e estilo Yaya-Mama (tradição pai-mãe)',
        eraOrElevation: 'Patrimônio Pré-Hispânico · Abrigo Rochoso',
        relicName: 'Pincel de Ocre Yaya-Mama',
        relicDescription: 'Restaura os pigmentos vermelhos e amarelos traçados há milênios sobre a rocha.',
        primaryLabel: 'Serpente 3 Cabeças',
        narratorIntro:
          'Chegamos à Caverna Qillqantiji (abrigo rochoso com arte pintada), cujo paredão guarda pinturas rupestres milenares. Aqui se destacam serpentes míticas de três cabeças traçadas com pigmentos minerais do estilo Yaya-Mama (tradição cerimonial pai-mãe). Leia as fichas abaixo, acerte a trivia e restaure a pintura ancestral.',
        narratorSuccess:
          'Obra milenar restaurada! A Serpente de 3 Cabeças da tradição Yaya-Mama volta a pulsar sobre a rocha de Qillqantiji.',
        educationalCapsule:
          'A Caverna Qillqantiji conserva valiosas pinturas rupestres executadas com pigmentos minerais vermelhos e amarelos ligados à tradição religiosa formativa do Lago Titicaca: o estilo Yaya-Mama ("pai-mãe"). Destaca-se a figura mítica da serpente de três cabeças, símbolo da água, fertilidade e dualidade andina.',
        didYouKnowBullets: [
          {
            title: 'Serpentes de duas e três cabeças',
            detail:
              'Nas pinturas de Qillqantiji há representações únicas na região de serpentes de duas e três cabeças (anfisbenas) e máscaras ancestrais do período Formativo, chamadas de estilo Yaya-Mama.'
          },
          {
            title: 'Três cores minerais',
            detail:
              'Os antigos artistas utilizaram pigmentos minerais para traçar motivos em três cores: vermelho ocre, branco e amarelo.'
          },
          {
            title: 'Tesouro protegido',
            detail:
              'Para evitar deterioração e vandalismo por grafite, a SIARB e a comunidade instalaram um cercado protetor que só se abre com guias locais.'
          }
        ],
        questionPrompt:
          'Escolha um pigmento mineral (Vermelho ou Amarelo) e ligue os pontos na rocha para restaurar a Serpente de 3 Cabeças:',
        triviaPrompt:
          'A que estilo arqueológico pré-hispânico pertencem as pinturas rupestres da Caverna Qillqantiji e quais cores minerais utilizaram?',
        triviaOptions: [
          'Estilo Barroco Mestiço, com tintas verdes e douradas',
          'Estilo Neoclássico Europeu, com tinta azul e prateada',
          'Estilo Yaya-Mama (tradição pai-mãe), com pigmentos vermelho ocre, branco e amarelo',
          'Estilo Minimalista Contemporâneo, apenas com carvão preto'
        ],
        sceneCaption: 'Caverna Qillqantiji (abrigo rochoso com arte pintada) · Arte rupestre em pigmentos minerais.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Pintura Rupestre Original',
            caption: 'Registro fotográfico sobre rocha com a mítica serpente escalonada de três cabeças.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Abrigo Rochoso Qillqantiji',
            caption: 'Paredão granítico que resguarda traços pré-hispânicos da tradição Yaya-Mama.'
          }
        ],
        travelerPrompt: 'Diante de pinturas rupestres de milhares de anos, o que mais emociona você pensar?',
        travelerChoices: [
          { label: 'Decifrar a simbologia Yaya-Mama da serpente de três cabeças', trait: 'cultural' },
          { label: 'Compreender como extraíam pigmentos minerais da própria terra', trait: 'naturaleza' },
          { label: 'Chegar por trilhas escondidas até os abrigos rochosos', trait: 'aventurero' },
          { label: 'Cuidar do sítio junto com a comunidade para que não seja danificado', trait: 'comunitario' }
        ]
      };
    case 5:
      return {
        ...base,
        title: 'Calvário e Ruínas do Carmo',
        subtitle: 'Apachetas (montículos de pedra) e cruzes processionais',
        eraOrElevation: '4.180 m de altitude · Morro do Calvário',
        relicName: 'Cruz de Pedra do Calvário',
        relicDescription: 'Símbolo de fé, equilíbrio espiritual e bom augúrio nos cumes de Peñas.',
        primaryLabel: 'Empilhar Pedras',
        secondaryLabel: 'Buscar Cruzes',
        narratorIntro:
          'Subimos pelas 14 cruzes do morro do Calvário até as antigas ruínas de Carmen Pata; aqui o sincretismo religioso se vive todos os dias. Leia as fichas, responda à trivia e escolha seu desafio para continuar seu caminho.',
        narratorSuccess:
          'Equilíbrio e olhar atento! Sua apacheta (montículo sagrado de pedras) e as cruzes do Calvário abençoam o último trecho de sua expedição.',
        educationalCapsule:
          'No morro do Calvário e junto às históricas Ruínas de El Carmen, os caminhantes praticam duas tradições vivas: erguer apachetas (montículos sagrados de pedras) em equilíbrio para pedir saúde e prosperidade à Pachamama, e percorrer as estações marcadas por cruzes processionais pelas encostas rochosas.',
        didYouKnowBullets: [
          {
            title: 'Casinhas para seus sonhos',
            detail:
              'Os visitantes montam pequenas construções de pedra chamadas ch’akras no cume como oferendas à Pachamama (Mãe Terra) para pedir casa, veículo ou prosperidade.'
          },
          {
            title: '14 cruzes processionais',
            detail:
              'A subida pelo morro é marcada por 14 cruzes brancas visíveis desde a praça principal do povoado.'
          },
          {
            title: 'Ruínas no cume',
            detail:
              'No ponto mais alto ficam os vestígios da Capela de El Carmen, construída na Colônia sobre um antigo centro ritual das culturas Pacajes e Inca.'
          }
        ],
        questionPrompt:
          'Apacheta (montículo sagrado) de bom augúrio: empilhe 5 pedras em equilíbrio sem deixar cair para agradecer à Pachamama:',
        secondaryPrompt:
          'Caminho Processional: encontre e marque as 4 cruzes ocultas entre o morro rochoso e as Ruínas de El Carmen:',
        triviaPrompt:
          'Quantas cruzes brancas marcam a subida do Calvário e como se chamam as casinhas simbólicas de pedra montadas pelos visitantes?',
        triviaOptions: [
          '7 cruzes douradas, e as casinhas simbólicas chamam-se tacanas',
          '14 cruzes brancas, e as casinhas simbólicas de pedra chamam-se ch’akras',
          '12 cruzes de madeira, e as casinhas simbólicas chamam-se tambos',
          '20 cruzes de granito, e as casinhas simbólicas chamam-se qullqas'
        ],
        sceneCaption: 'Morro do Calvário e Ruínas de El Carmen · Pedras em equilíbrio e cruzes no cume.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Morro do Calvário',
            caption: 'Apachetas (montículos sagrados) de bom augúrio e cruzes devocionais sobre os rochedos.'
          },
          {
            imageUrl: base.infoGallery![1].imageUrl,
            label: 'Rotas e Sinalização',
            caption: 'Trilhas sinalizadas rumo à Gruta do Milagre, Calvário e picos nevados.'
          }
        ],
        travelerPrompt: 'Ao alcançar o Calvário e as Ruínas de El Carmen, qual gesto você faria primeiro?',
        travelerChoices: [
          { label: 'Empilhar pedras em silêncio agradecendo à Pachamama (Mãe Terra)', trait: 'naturaleza' },
          { label: 'Percorrer cada estação observando a arquitetura das ruínas', trait: 'cultural' },
          { label: 'Continuar subindo até o ponto mais alto do rochedo', trait: 'aventurero' },
          { label: 'Partilhar desejos de bem-estar para minha família e comunidade', trait: 'comunitario' }
        ]
      };
    case 6:
    default:
      return {
        ...base,
        title: 'Mirante Ninho de Condores e Escalada',
        subtitle: 'Panorâmica 360° da Cordilheira Real e paredão granítico',
        eraOrElevation: '4.300 m de altitude · Cume e Paredões',
        relicName: 'Mosquetão do Condor',
        relicDescription: 'Selo supremo de quem coroou os paredões e contemplou a Cordilheira Real.',
        primaryLabel: 'Escalar o Paredão',
        narratorIntro:
          'Você chegou à sétima e última etapa, o Mirante Ninho de Condores! Desses paredões rochosos abre-se o entardecer diante da Cordilheira Real e aguardam as rotas de escalada em rocha. Leia as fichas abaixo, acerte a trivia e supere a escalada para se formar como Guardião de Peñas.',
        narratorSuccess:
          'Jallalla (Viva!), Guardião de Peñas! As 7 relíquias brilham juntas no cume. É hora de descobrir seu perfil de viajante e seu guia secreto para explorar Peñas.',
        educationalCapsule:
          'A 4.300 m de altitude, o Mirante Ninho de Condores ou Wiraconi presenteia uma vista panorâmica de 360 graus do Altiplano e dos glaciares da Cordilheira Real (Condoriri, Huayna Potosí e Illampu). Ao lado de seus paredões de granito firme fica o Parque de Escalada de Peñas, referência nacional em escalada responsável sem deixar rastros.',
        didYouKnowBullets: [
          {
            title: 'Capital da escalada',
            detail:
              'Peñas é a meca da escalada em rocha da Bolívia, com mais de 150 vias em paredões de conglomerado vermelho e arenito, tirolesa e via ferrata impulsionadas pelo Padre Antonio Zavatarelli ("o padre escalador").'
          },
          {
            title: 'Mirante panorâmico em 360°',
            detail:
              'Do Ninho de Condores avistam-se simultaneamente o Lago Titicaca e os colossos nevados da Cordilheira Real, como Chachacomani, Huayna Potosí e Illampu.'
          },
          {
            title: 'Queijo e licor artesanal de k’oa',
            detail:
              'Peñas se destaca pela gastronomia local, oferecendo queijo crioulo artesanal de vaca de alta montanha e um exclusivo licor produzido com k’oa (erva cerimonial).'
          }
        ],
        questionPrompt:
          'Escale o paredão granítico de Peñas escolhendo agarras firmes, recolhendo resíduos e alcançando o Cume do Condor:',
        triviaPrompt:
          'Do Mirante Ninho de Condores avista-se o Lago Titicaca junto a qual imponente cadeia de nevados (como Huayna Potosí e Illampu)?',
        triviaOptions: [
          'Cordilheira Ocidental',
          'Serrania do Aguaragüe',
          'Cordilheira de Sama',
          'Cordilheira Real'
        ],
        sceneCaption: 'Vista panorâmica do Mirante Ninho de Condores para o Altiplano e a Cordilheira Real.',
        infoGallery: [
          {
            imageUrl: base.infoGallery![0].imageUrl,
            label: 'Mirante Ninho de Condores',
            caption: 'Panorâmica de 360° voltada ao povoado de Peñas, ao Altiplano e aos glaciares da Cordilheira Real.'
          }
        ],
        travelerPrompt: 'No topo de Peñas, com as 7 relíquias reunidas, como você coroa sua travessia?',
        travelerChoices: [
          { label: 'Contemplando o voo do condor diante da Cordilheira Real', trait: 'naturaleza' },
          { label: 'Comemorando a escalada pelos paredões de granito do parque', trait: 'aventurero' },
          { label: 'Guardando cada relato e símbolo ancestral na memória', trait: 'cultural' },
          { label: 'Descendo ao povoado para celebrar com os guias e moradores', trait: 'comunitario' }
        ]
      };
  }
});

const STORY_SCENES_EN: StoryScenePhoto[] = PENAS_STORY_SCENES.map((scene) => {
  switch (scene.id) {
    case 'plaza_katari':
      return { ...scene, location: 'Túpac Katari Plaza · Peñas', promoPhrase: 'Visit Peñas, La Paz! Where the living history of Túpac Katari beats.' };
    case 'templo_colonial':
      return { ...scene, location: 'Colonial Church & Virgin’s Footprints', promoPhrase: 'Visit Peñas, La Paz! Discover gold-leaf colonial treasures at 4,000 meters.' };
    case 'mirador_cordillera':
      return { ...scene, location: 'Castillo del Búho & Cordillera Real', promoPhrase: 'Visit Peñas! Wake up facing Illampu, Chearoco & Illimani.' };
    case 'murales_cafeteria':
      return { ...scene, location: 'Café, Murals & Handicrafts of Peñas', promoPhrase: 'Visit Peñas, La Paz! Andean murals, aguayos & Altiplano flavors.' };
    case 'pachamama_mural':
      return { ...scene, location: 'Pachamama Murals & Trails', promoPhrase: 'Visit Peñas! Living nature, folk art & crisp air at 4,000 meters.' };
    case 'templo_portada':
    default:
      return { ...scene, location: 'Stone Portal & Belfry · Peñas', promoPhrase: 'Visit Peñas, La Paz! History, barter & living heritage of our land.' };
  }
});

const STORY_SCENES_PT: StoryScenePhoto[] = PENAS_STORY_SCENES.map((scene) => {
  switch (scene.id) {
    case 'plaza_katari':
      return { ...scene, location: 'Praça de Túpac Katari · Peñas', promoPhrase: 'Visite Peñas, La Paz! Onde pulsa a história viva de Túpac Katari.' };
    case 'templo_colonial':
      return { ...scene, location: 'Templo Colonial e Pegadas da Virgem', promoPhrase: 'Visite Peñas, La Paz! Descubra joias coloniais em folha de ouro a 4.000 metros.' };
    case 'mirador_cordillera':
      return { ...scene, location: 'Castillo del Búho e Cordilheira Real', promoPhrase: 'Visite Peñas! Desperte diante dos nevados Illampu, Chearoco e Illimani.' };
    case 'murales_cafeteria':
      return { ...scene, location: 'Cafeteria, Murais e Artesanato de Peñas', promoPhrase: 'Visite Peñas, La Paz! Arte muralista, aguayos e sabores do Altiplano.' };
    case 'pachamama_mural':
      return { ...scene, location: 'Murais da Pachamama e Trilhas', promoPhrase: 'Visite Peñas! Natureza viva, arte popular e ar puro a 4.000 metros.' };
    case 'templo_portada':
    default:
      return { ...scene, location: 'Portada de Pedra e Campanário · Peñas', promoPhrase: 'Visite Peñas, La Paz! História, escambo e memória viva de nossa terra.' };
  }
});

const ACHIEVEMENTS_EN: AchievementDefinition[] = [
  {
    id: 'primer_paso',
    title: 'Chaski (Andean Messenger) of the Plaza',
    description: 'You completed Stage 1 at Túpac Katari Plaza.',
    criterion: 'Complete Stage 1 of the journey',
    tier: 'bronce',
    icon: 'compass'
  },
  {
    id: 'sin_errores_etapa',
    title: 'Wisdom of the Amauta (Andean Sage)',
    description: 'You cleared a challenge on your very first try with zero mistakes.',
    criterion: 'Complete any stage without errors',
    tier: 'plata',
    icon: 'star'
  },
  {
    id: 'maestro_telar',
    title: 'Traveler of the Barter',
    description: 'You conquered the Pre-Hispanic Trail and Saca Cuellos with totora reed or aguayo weaving.',
    criterion: 'Complete Stage 3 (Pre-Hispanic Trail)',
    tier: 'esmeralda',
    icon: 'loom'
  },
  {
    id: 'racha_tres',
    title: 'Steady Highland Step',
    description: 'You mastered three stops along the trail without making a single error.',
    criterion: 'Complete 3 different stages on the first try',
    tier: 'plata',
    icon: 'flame'
  },
  {
    id: 'protector_pachamama',
    title: 'Guardian of the Caves',
    description: 'You unlocked Kunkuntiji Cave and restored the rock art of Qillqantiji.',
    criterion: 'Complete Stages 4 and 5 (Sacred Caves)',
    tier: 'esmeralda',
    icon: 'leaf'
  },
  {
    id: 'ojo_del_condor',
    title: 'Eye of the Condor',
    description: 'You topped out at the Condor’s Nest Viewpoint and the Climbing Park.',
    criterion: 'Complete Stage 7 (Viewpoint & Climbing)',
    tier: 'plata',
    icon: 'mountain'
  },
  {
    id: 'guardian_perfecto',
    title: 'Heart of the Guardian',
    description: 'You conquered all 7 stages completing your challenges without mistakes.',
    criterion: 'Achieve 7/7 flawless stages',
    tier: 'oro',
    icon: 'crown'
  },
  {
    id: 'veloz_como_el_viento',
    title: 'Swift as the Wayra (Andean Wind)',
    description: 'You crossed all 7 stages from the Plaza to the Viewpoint in record time.',
    criterion: 'Finish the game in under 20 minutes',
    tier: 'oro',
    icon: 'clock'
  }
];

const ACHIEVEMENTS_PT: AchievementDefinition[] = [
  {
    id: 'primer_paso',
    title: 'Chaski (mensageiro andino) da Praça',
    description: 'Você concluiu a primeira etapa na Praça de Túpac Katari.',
    criterion: 'Conclua a Etapa 1 da travessia',
    tier: 'bronce',
    icon: 'compass'
  },
  {
    id: 'sin_errores_etapa',
    title: 'Sabedoria de Amauta (sábio andino)',
    description: 'Você venceu um desafio na primeira tentativa, sem nenhum tropeço.',
    criterion: 'Conclua qualquer etapa sem erros',
    tier: 'plata',
    icon: 'star'
  },
  {
    id: 'maestro_telar',
    title: 'Viajante do Escambo',
    description: 'Você superou o Caminho Pré-Hispânico e Saca Cuellos com cestaria de totora ou aguayo.',
    criterion: 'Conclua a Etapa 3 (Caminho Pré-Hispânico)',
    tier: 'esmeralda',
    icon: 'loom'
  },
  {
    id: 'racha_tres',
    title: 'Passo Firme de Altitude',
    description: 'Você dominou três paradas da trilha sem cometer erros.',
    criterion: 'Conclua 3 etapas distintas na primeira tentativa',
    tier: 'plata',
    icon: 'flame'
  },
  {
    id: 'protector_pachamama',
    title: 'Guardião das Cavernas',
    description: 'Você decifrou a Caverna Kunkuntiji e restaurou a arte de Qillqantiji.',
    criterion: 'Conclua as etapas 4 e 5 (Cavernas Sagradas)',
    tier: 'esmeralda',
    icon: 'leaf'
  },
  {
    id: 'ojo_del_condor',
    title: 'Olho do Condor',
    description: 'Você coroou o Mirante Ninho de Condores e o Parque de Escalada.',
    criterion: 'Conclua a Etapa 7 (Mirante e Escalada)',
    tier: 'plata',
    icon: 'mountain'
  },
  {
    id: 'guardian_perfecto',
    title: 'Coração de Guardião',
    description: 'Você conquistou as 7 etapas superando os desafios sem erros.',
    criterion: 'Alcance 7/7 etapas sem tropeços',
    tier: 'oro',
    icon: 'crown'
  },
  {
    id: 'veloz_como_el_viento',
    title: 'Veloz como o Wayra (vento andino)',
    description: 'Você percorreu as 7 etapas da Praça até o Mirante em tempo recorde.',
    criterion: 'Conclua o jogo em menos de 20 minutos',
    tier: 'oro',
    icon: 'clock'
  }
];

export function getLocalizedGameTexts(lang: AppLanguage): GameTexts {
  if (lang === 'en') return GAME_TEXTS_EN;
  if (lang === 'pt') return GAME_TEXTS_PT;
  return DEFAULT_GAME_TEXTS;
}

export function getLocalizedStages(lang: AppLanguage): StageData[] {
  if (lang === 'en') return STAGES_EN;
  if (lang === 'pt') return STAGES_PT;
  return DEFAULT_STAGES;
}

export function getLocalizedStoryScenes(lang: AppLanguage): StoryScenePhoto[] {
  if (lang === 'en') return STORY_SCENES_EN;
  if (lang === 'pt') return STORY_SCENES_PT;
  return PENAS_STORY_SCENES;
}

export function getLocalizedAchievements(lang: AppLanguage): AchievementDefinition[] {
  if (lang === 'en') return ACHIEVEMENTS_EN;
  if (lang === 'pt') return ACHIEVEMENTS_PT;
  return ACHIEVEMENTS;
}

export function getLocalizedAchievementProgressHint(
  id: string,
  progress: PlayerProgress,
  lang: AppLanguage
): string {
  if (lang === 'es') return getAchievementProgressHint(id, progress);

  const completed = progress.completedStages || [];
  const firstTry = progress.firstTryWins || [];

  if (lang === 'en') {
    switch (id) {
      case 'primer_paso':
        return `${Math.min(1, completed.length)}/1 stage`;
      case 'sin_errores_etapa':
        return `${Math.min(1, firstTry.length)}/1 flawless stage`;
      case 'maestro_telar':
        return completed.includes(3) ? 'Completed' : 'Stage 3 pending';
      case 'racha_tres':
        return `${Math.min(3, firstTry.length)}/3 on 1st try`;
      case 'protector_pachamama': {
        const count = (completed.includes(4) ? 1 : 0) + (completed.includes(5) ? 1 : 0);
        return `${count}/2 stages (4 & 5)`;
      }
      case 'ojo_del_condor':
        return completed.includes(7) ? 'Completed' : 'Stage 7 pending';
      case 'guardian_perfecto':
        return `${firstTry.length}/7 on 1st try`;
      case 'veloz_como_el_viento':
        return completed.length >= 7 ? 'Goal: < 20:00 min' : `${completed.length}/7 · < 20 min`;
      default:
        return '';
    }
  }

  switch (id) {
    case 'primer_paso':
      return `${Math.min(1, completed.length)}/1 etapa`;
    case 'sin_errores_etapa':
      return `${Math.min(1, firstTry.length)}/1 etapa perfeita`;
    case 'maestro_telar':
      return completed.includes(3) ? 'Concluído' : 'Etapa 3 pendente';
    case 'racha_tres':
      return `${Math.min(3, firstTry.length)}/3 na 1ª tentativa`;
    case 'protector_pachamama': {
      const count = (completed.includes(4) ? 1 : 0) + (completed.includes(5) ? 1 : 0);
      return `${count}/2 etapas (4 e 5)`;
    }
    case 'ojo_del_condor':
      return completed.includes(7) ? 'Concluído' : 'Etapa 7 pendente';
    case 'guardian_perfecto':
      return `${firstTry.length}/7 na 1ª tentativa`;
    case 'veloz_como_el_viento':
      return completed.length >= 7 ? 'Meta: < 20:00 min' : `${completed.length}/7 · < 20 min`;
    default:
      return '';
  }
}

export function getLocalizedTierLabel(tier: MedalTier, lang: AppLanguage): string {
  if (lang === 'en') {
    if (tier === 'bronce') return 'BRONZE';
    if (tier === 'plata') return 'SILVER';
    if (tier === 'esmeralda') return 'EMERALD';
    return 'GOLD';
  }
  if (lang === 'pt') {
    if (tier === 'bronce') return 'BRONZE';
    if (tier === 'plata') return 'PRATA';
    if (tier === 'esmeralda') return 'ESMERALDA';
    return 'OURO';
  }
  if (tier === 'bronce') return 'BRONCE';
  if (tier === 'plata') return 'PLATA';
  if (tier === 'esmeralda') return 'ESMERALDA';
  return 'ORO';
}
