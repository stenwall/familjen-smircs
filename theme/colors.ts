const themeColors = {
  black: '#000',
  white: '#fff',
  transparent: 'transparent',
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D'
  },
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12'
  },
  yellow: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12'
  },
  green: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B'
  },
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A'
  },
  blue: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E'
  },
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87'
  },
  pink: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843'
  },
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63'
  },
  blackAlpha: {
    50: 'rgba(0,0,0,0.05)',
    100: 'rgba(0,0,0,0.1)',
    200: 'rgba(0,0,0,0.2)',
    300: 'rgba(0,0,0,0.3)',
    400: 'rgba(0,0,0,0.4)',
    500: 'rgba(0,0,0,0.5)',
    600: 'rgba(0,0,0,0.6)',
    700: 'rgba(0,0,0,0.7)',
    800: 'rgba(0,0,0,0.8)',
    900: 'rgba(0,0,0,0.9)'
  },
  whiteAlpha: {
    50: 'rgba(255,255,255,0.05)',
    100: 'rgba(255,255,255,0.1)',
    200: 'rgba(255,255,255,0.2)',
    300: 'rgba(255,255,255,0.3)',
    400: 'rgba(255,255,255,0.4)',
    500: 'rgba(255,255,255,0.5)',
    600: 'rgba(255,255,255,0.6)',
    700: 'rgba(255,255,255,0.7)',
    800: 'rgba(255,255,255,0.8)',
    900: 'rgba(255,255,255,0.9)'
  },
  gray: {
    50: '#F2F2F7',
    100: '#E5E5EA',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C7C7CC',
    500: '#AEAEB2',
    600: '#8E8E93',
    700: '#636366',
    800: '#3A3A3C',
    900: '#1C1C1E'
  }
};

export const colors = {
  // straight from design
  backgroundLight: '#F5F6F8',
  backgroundDark: '#11141E',
  wordMark: '#262A36',
  heading: '#272E36',
  paragraph: 'rgba(39, 46, 54, 0.9)',
  headingLight: '#F2FBFF',
  paragraphLight: 'rgba(242, 251, 255, 0.8)',
  ...themeColors,
  primary: themeColors.blue,
  /**
   * @deprecated - use `purple` instead
   */
  twurple: themeColors.purple,
  /**
   * @deprecated - use `orange` instead
   */
  tworange: themeColors.orange,
  /**
   * @deprecated - use `red` instead
   */
  tworal: themeColors.red
};
