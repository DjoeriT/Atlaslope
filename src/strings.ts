// All interface text lives here (decision #5).
export const strings = {
  appName: 'Atlaslope',
  brandContext: 'Spain',
  mapMountLabel: 'Map of Spain. Click a place to select it.',
  topBar: {
    darkInterface: 'Dark interface',
    searchPlaceholder: 'Search places and regions',
    searchLabel: 'Search places and regions',
    modeNav: 'Mode',
    explore: 'Explore',
    quiz: 'Quiz',
    progress: 'Progress',
    comingSoon: 'Coming soon',
  },
  firstRun: {
    label: 'Welcome to Atlaslope',
    kicker: 'Welcome',
    lede: "The wine atlas that quizzes you. Learn where Spain's wine places are and why their wines taste as they do.",
    hintsTitle: 'Moving the map',
    // Each hint alternates plain and bold text, starting with bold.
    hints: [
      ['Drag', ' to move, ', 'pinch or scroll', ' to zoom.'],
      ['Two fingers up or down', ', or ', 'right-drag', ' with a mouse, to tilt into 3D.'],
      ['Two fingers twist', ', or ', 'Ctrl-drag', ', to turn. The compass button points north again.'],
    ],
    start: 'Start exploring',
  },
} as const;
