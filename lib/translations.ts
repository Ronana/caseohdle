export type LangCode = 'en' | 'es' | 'fr' | 'de' | 'pt';

export interface Lang {
  code: LangCode;
  name: string;
  flag: string;
}

export const LANGUAGES: Lang[] = [
  { code: 'en', name: 'English',    flag: '🇬🇧' },
  { code: 'es', name: 'Español',    flag: '🇪🇸' },
  { code: 'fr', name: 'Français',   flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
  { code: 'pt', name: 'Português',  flag: '🇧🇷' },
];

export interface T {
  // Header
  subtitle: string;
  blurb: string;
  dayLabel: (n: number) => string;
  // Mode toggle
  modeDaily: string;
  modeUnlimited: string;
  // Streak
  streak: string;
  best: string;
  // Input
  searchPlaceholder: string;
  // Give up
  giveUp: string;
  // Grid empty state
  startGuessing: string;
  // Column headers
  colGame: string;
  colGenre: string;
  colPlatform: string;
  colYear: string;
  colDeveloper: string;
  colViewers: string;
  colHours: string;
  colLastSeen: string;
  // Win / lose
  winMessages: string[];
  banned: string;
  theGameWas: string;
  solvedIn: (n: number) => string;
  share: string;
  copied: string;
  newGame: string;
  // Color legend
  correct: string;
  partial: string;
  incorrect: string;
  higher: string;
  lower: string;
  // About
  aboutToggle: string;
  aboutWhatTitle: string;
  aboutWhatBody: string;
  aboutHowTitle: string;
  aboutCreditsTitle: string;
  aboutCreditsBody: string;
  aboutFeedbackTitle: string;
  aboutFeedbackBody: string;
  aboutSupport: string;
  aboutMadeBy: string;
}

const translations: Record<LangCode, T> = {
  en: {
    subtitle: 'Guess the game CaseOh streamed',
    blurb: 'Guess one of 810 games CaseOh has streamed. Each guess reveals clues about genre, platform, release year, developer, viewership and more.',
    dayLabel: (n) => `Day #${n}`,
    modeDaily: '📅 Daily',
    modeUnlimited: '∞ Unlimited',
    streak: '🔥 Streak',
    best: '🏆 Best',
    searchPlaceholder: 'Search for a game…',
    giveUp: 'Give up',
    startGuessing: 'Start guessing above ↑',
    colGame: 'Game',
    colGenre: 'Genre',
    colPlatform: 'Platform',
    colYear: 'Year',
    colDeveloper: 'Developer',
    colViewers: 'Viewers',
    colHours: 'Hours',
    colLastSeen: 'Last Seen',
    winMessages: [
      "You're NOT banned! 🎉",
      "CaseOh approves! ✅",
      "Chat is going crazy! 📺",
      "Bro actually knows CaseOh 🫡",
      "That's a W! 💪",
    ],
    banned: "YOU'RE BANNED. 🔨",
    theGameWas: 'The game was',
    solvedIn: (n) => `Solved in ${n} guess${n !== 1 ? 'es' : ''}`,
    share: '📋 Share',
    copied: 'Copied to clipboard!',
    newGame: 'New Game',
    correct: 'Correct',
    partial: 'Partial',
    incorrect: 'Incorrect',
    higher: 'Higher',
    lower: 'Lower',
    aboutToggle: 'About',
    aboutWhatTitle: 'What is CaseOhdle?',
    aboutWhatBody: 'Every day, guess a different game that CaseOh has streamed on Twitch. Each guess reveals clues about the game\'s genre, platform, release year, developer, viewership stats, and when CaseOh last played it.',
    aboutHowTitle: 'How to play',
    aboutCreditsTitle: 'Credits',
    aboutCreditsBody: 'Built as a fan project — not affiliated with or endorsed by CaseOh. Game data sourced from TwitchTracker and RAWG. Inspired by Wordle and Loldle.',
    aboutFeedbackTitle: 'Feedback / Questions',
    aboutFeedbackBody: 'Found a bug or wrong game data? Want to say hi?',
    aboutSupport: 'Support on Ko-fi',
    aboutMadeBy: 'Made with ☕ by Frewster',
  },

  es: {
    subtitle: 'Adivina el juego que CaseOh transmitió',
    blurb: 'Adivina uno de los 810 juegos que CaseOh ha transmitido. Cada intento revela pistas sobre el género, plataforma, año, desarrollador y más.',
    dayLabel: (n) => `Día #${n}`,
    modeDaily: '📅 Diario',
    modeUnlimited: '∞ Ilimitado',
    streak: '🔥 Racha',
    best: '🏆 Récord',
    searchPlaceholder: 'Buscar un juego…',
    giveUp: 'Rendirse',
    startGuessing: 'Empieza a adivinar arriba ↑',
    colGame: 'Juego',
    colGenre: 'Género',
    colPlatform: 'Plataforma',
    colYear: 'Año',
    colDeveloper: 'Dev',
    colViewers: 'Espect.',
    colHours: 'Horas',
    colLastSeen: 'Último',
    winMessages: [
      '¡No estás baneado! 🎉',
      '¡CaseOh aprueba! ✅',
      '¡El chat está loco! 📺',
      'Realmente conoces a CaseOh 🫡',
      '¡Eso es una W! 💪',
    ],
    banned: '¡ESTÁS BANEADO! 🔨',
    theGameWas: 'El juego era',
    solvedIn: (n) => `Resuelto en ${n} intento${n !== 1 ? 's' : ''}`,
    share: '📋 Compartir',
    copied: '¡Copiado al portapapeles!',
    newGame: 'Nuevo juego',
    correct: 'Correcto',
    partial: 'Parcial',
    incorrect: 'Incorrecto',
    higher: 'Mayor',
    lower: 'Menor',
    aboutToggle: 'Acerca de',
    aboutWhatTitle: '¿Qué es CaseOhdle?',
    aboutWhatBody: 'Cada día, adivina un juego diferente que CaseOh ha transmitido en Twitch.',
    aboutHowTitle: 'Cómo jugar',
    aboutCreditsTitle: 'Créditos',
    aboutCreditsBody: 'Proyecto de fans — no afiliado ni respaldado por CaseOh. Datos de TwitchTracker y RAWG. Inspirado en Wordle y Loldle.',
    aboutFeedbackTitle: 'Comentarios / Preguntas',
    aboutFeedbackBody: '¿Encontraste un error? ¿Quieres saludar?',
    aboutSupport: 'Apoyar en Ko-fi',
    aboutMadeBy: 'Hecho con ☕ por Frewster',
  },

  fr: {
    subtitle: 'Devinez le jeu que CaseOh a streamé',
    blurb: 'Devinez l\'un des 810 jeux que CaseOh a streamés. Chaque essai révèle des indices sur le genre, la plateforme, l\'année, le développeur et plus encore.',
    dayLabel: (n) => `Jour #${n}`,
    modeDaily: '📅 Quotidien',
    modeUnlimited: '∞ Illimité',
    streak: '🔥 Série',
    best: '🏆 Record',
    searchPlaceholder: 'Rechercher un jeu…',
    giveUp: 'Abandonner',
    startGuessing: 'Commencez à deviner ci-dessus ↑',
    colGame: 'Jeu',
    colGenre: 'Genre',
    colPlatform: 'Plateforme',
    colYear: 'Année',
    colDeveloper: 'Dev',
    colViewers: 'Viewers',
    colHours: 'Heures',
    colLastSeen: 'Vu',
    winMessages: [
      'Vous n\'êtes PAS banni ! 🎉',
      'CaseOh approuve ! ✅',
      'Le chat est fou ! 📺',
      'Tu connais vraiment CaseOh 🫡',
      'C\'est un W ! 💪',
    ],
    banned: 'VOUS ÊTES BANNI. 🔨',
    theGameWas: 'Le jeu était',
    solvedIn: (n) => `Résolu en ${n} essai${n !== 1 ? 's' : ''}`,
    share: '📋 Partager',
    copied: 'Copié dans le presse-papiers !',
    newGame: 'Nouveau jeu',
    correct: 'Correct',
    partial: 'Partiel',
    incorrect: 'Incorrect',
    higher: 'Plus haut',
    lower: 'Plus bas',
    aboutToggle: 'À propos',
    aboutWhatTitle: 'Qu\'est-ce que CaseOhdle ?',
    aboutWhatBody: 'Chaque jour, devinez un jeu différent que CaseOh a streamé sur Twitch.',
    aboutHowTitle: 'Comment jouer',
    aboutCreditsTitle: 'Crédits',
    aboutCreditsBody: 'Projet fan — non affilié à CaseOh. Données de TwitchTracker et RAWG. Inspiré par Wordle et Loldle.',
    aboutFeedbackTitle: 'Retours / Questions',
    aboutFeedbackBody: 'Trouvé un bug ? Envie de dire bonjour ?',
    aboutSupport: 'Soutenir sur Ko-fi',
    aboutMadeBy: 'Fait avec ☕ par Frewster',
  },

  de: {
    subtitle: 'Errate das Spiel, das CaseOh gestreamt hat',
    blurb: 'Errate eines von 810 Spielen, die CaseOh gestreamt hat. Jeder Tipp enthüllt Hinweise zu Genre, Plattform, Erscheinungsjahr, Entwickler und mehr.',
    dayLabel: (n) => `Tag #${n}`,
    modeDaily: '📅 Täglich',
    modeUnlimited: '∞ Unbegrenzt',
    streak: '🔥 Serie',
    best: '🏆 Rekord',
    searchPlaceholder: 'Spiel suchen…',
    giveUp: 'Aufgeben',
    startGuessing: 'Oben raten ↑',
    colGame: 'Spiel',
    colGenre: 'Genre',
    colPlatform: 'Plattform',
    colYear: 'Jahr',
    colDeveloper: 'Entwickler',
    colViewers: 'Zuschauer',
    colHours: 'Stunden',
    colLastSeen: 'Zuletzt',
    winMessages: [
      'Du bist NICHT gebannt! 🎉',
      'CaseOh ist beeindruckt! ✅',
      'Der Chat dreht durch! 📺',
      'Du kennst CaseOh wirklich 🫡',
      'Das ist ein W! 💪',
    ],
    banned: 'DU BIST GEBANNT. 🔨',
    theGameWas: 'Das Spiel war',
    solvedIn: (n) => `Gelöst in ${n} Versuch${n !== 1 ? 'en' : ''}`,
    share: '📋 Teilen',
    copied: 'In die Zwischenablage kopiert!',
    newGame: 'Neues Spiel',
    correct: 'Korrekt',
    partial: 'Teilweise',
    incorrect: 'Falsch',
    higher: 'Höher',
    lower: 'Niedriger',
    aboutToggle: 'Über',
    aboutWhatTitle: 'Was ist CaseOhdle?',
    aboutWhatBody: 'Errate jeden Tag ein anderes Spiel, das CaseOh auf Twitch gestreamt hat.',
    aboutHowTitle: 'Wie man spielt',
    aboutCreditsTitle: 'Credits',
    aboutCreditsBody: 'Fan-Projekt — nicht mit CaseOh verbunden. Daten von TwitchTracker und RAWG. Inspiriert von Wordle und Loldle.',
    aboutFeedbackTitle: 'Feedback / Fragen',
    aboutFeedbackBody: 'Fehler gefunden? Einfach Hallo sagen?',
    aboutSupport: 'Auf Ko-fi unterstützen',
    aboutMadeBy: 'Gemacht mit ☕ von Frewster',
  },

  pt: {
    subtitle: 'Adivinhe o jogo que o CaseOh transmitiu',
    blurb: 'Adivinhe um dos 810 jogos que o CaseOh transmitiu. Cada tentativa revela dicas sobre gênero, plataforma, ano, desenvolvedor e mais.',
    dayLabel: (n) => `Dia #${n}`,
    modeDaily: '📅 Diário',
    modeUnlimited: '∞ Ilimitado',
    streak: '🔥 Sequência',
    best: '🏆 Recorde',
    searchPlaceholder: 'Buscar um jogo…',
    giveUp: 'Desistir',
    startGuessing: 'Comece a adivinhar acima ↑',
    colGame: 'Jogo',
    colGenre: 'Gênero',
    colPlatform: 'Plataforma',
    colYear: 'Ano',
    colDeveloper: 'Dev',
    colViewers: 'Viewers',
    colHours: 'Horas',
    colLastSeen: 'Visto',
    winMessages: [
      'Você NÃO foi banido! 🎉',
      'CaseOh aprova! ✅',
      'O chat está doido! 📺',
      'Você realmente conhece o CaseOh 🫡',
      'Isso é um W! 💪',
    ],
    banned: 'VOCÊ FOI BANIDO. 🔨',
    theGameWas: 'O jogo era',
    solvedIn: (n) => `Resolvido em ${n} tentativa${n !== 1 ? 's' : ''}`,
    share: '📋 Compartilhar',
    copied: 'Copiado para a área de transferência!',
    newGame: 'Novo jogo',
    correct: 'Correto',
    partial: 'Parcial',
    incorrect: 'Incorreto',
    higher: 'Maior',
    lower: 'Menor',
    aboutToggle: 'Sobre',
    aboutWhatTitle: 'O que é o CaseOhdle?',
    aboutWhatBody: 'Todo dia, adivinhe um jogo diferente que o CaseOh transmitiu na Twitch.',
    aboutHowTitle: 'Como jogar',
    aboutCreditsTitle: 'Créditos',
    aboutCreditsBody: 'Projeto de fã — não afiliado ao CaseOh. Dados do TwitchTracker e RAWG. Inspirado no Wordle e Loldle.',
    aboutFeedbackTitle: 'Feedback / Perguntas',
    aboutFeedbackBody: 'Encontrou um bug? Quer dizer oi?',
    aboutSupport: 'Apoiar no Ko-fi',
    aboutMadeBy: 'Feito com ☕ por Frewster',
  },
};

export default translations;
