export const DesignTokens = {
  colors: {
    // Light Mode Background & Surfaces
    background: '#F9FAFB',     // bg / background
    surface: '#FFFFFF',        // white / card
    
    // Text Colors
    textPrimary: '#111827',    // n900
    textSecondary: '#6B7280',  // n500
    textTertiary: '#9CA3AF',   // n400
    
    // Brand Colors
    brand: '#0F766E',          // primary
    brandDark: '#0A5255',
    brandLight: '#CCECF0',     
    brandExtraLight: '#F0FAFB',
    
    // Standard Neutrals
    n100: '#F3F4F6',
    n200: '#E5E7EB',
    n300: '#D1D5DB',
    n400: '#9CA3AF',
    n500: '#6B7280',
    n600: '#4B5563',
    n700: '#374151',
    n800: '#1F2937',
    n900: '#111827',
    
    // Semantic & Feedback
    success: '#059669',
    successLight: '#D1FAE5',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    danger: '#DC2626',
    dangerLight: '#FEE2E2',
    info: '#2563EB',
    infoLight: '#DBEAFE',

    // Mood Specific
    moodGreat: '#059669',
    moodGood: '#0F766E',
    moodOkay: '#D97706',
    moodLow: '#DC2626',
    moodRough: '#7C3AED',
    moodRoughLight: '#EDE9FE',

    // Legacy/Component specific mappings
    primary: '#0F766E',
    border: '#E5E7EB',         // n200
    borderSelected: '#0F766E', // brand
    buttonPrimary: '#0F766E',  // brand
    buttonSecondary: '#FFFFFF',
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700', color: '#111827' },
    h2: { fontSize: 28, fontWeight: '700', color: '#111827' },
    h3: { fontSize: 24, fontWeight: '700', color: '#111827' },
    title: { fontSize: 18, fontWeight: '600', color: '#111827' },
    bodyBold: { fontSize: 16, fontWeight: '600', color: '#111827' },
    body: { fontSize: 15, fontWeight: '500', color: '#4B5563' },
    caption: { fontSize: 13, fontWeight: '500', color: '#6B7280' },
    micro: { fontSize: 12, fontWeight: '500', color: '#6B7280' }
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    padding: 24, // Mood App typical outer padding
    margin: 24
  },
  borderRadius: {
    sm: 8,
    md: 12,
    card: 14, // Mood App card radius
    button: 14, // Mood App button radius
    pill: 9999
  },
  borderWeight: {
    default: 1, // Mood App defaults to 1px
    selected: 1.5 // Mood App uses 1.5px for selected items
  }
};
