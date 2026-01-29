// Svenska skogens tema - färger och stil för Manifest App
export const SwedishForestTheme = {
  colors: {
    // Primära svenska skogsfärger
    primary: '#4A7C59',        // Skogsgrön - knappar, förtroende, tillväxt
    secondary: '#87A96B',      // Salviagrön - balans, sekundära element
    accent: '#6B8E23',         // Olivgrön - naturlig energi, accenter
    
    // Neutral grund
    background: '#F8F9FA',     // Ljus kräm - huvudbakgrund
    surface: '#FFFFFF',        // Ren vit - kort, input-områden
    
    // Textfärger
    text: {
      primary: '#2D3748',      // Varmgrå - huvudtext
      secondary: '#718096',    // Mjukgrå - tidsstämplar, metadata
      disabled: '#A0AEC0',     // Ljusgrå - inaktiverade tillstånd
      inverse: '#FFFFFF',      // Vit text på mörka bakgrunder
    },
    
    // Återkopplingsfärger - milda, inte aggressiva
    success: '#68D391',        // Ljusgrön - slutföranden
    warning: '#F6AD55',        // Mjuk orange - varningar
    error: '#FC8181',          // Mjuk röd - fel
    info: '#63B3ED',          // Mjuk blå - information
    
    // Mörkt läge
    dark: {
      background: '#1A1A1A',   // Mjuk svart
      surface: '#2D2D2D',      // Mörk yta
      primary: '#5A9D69',      // Ljusare grön för kontrast
      secondary: '#9FBA8C',    // Mer lysande salvia
      text: {
        primary: '#FFFFFF',
        secondary: '#B3B3B3',
        disabled: '#6B7280',
      }
    }
  },
  
  // Avstånd baserat på 8px-rutnät
  spacing: {
    xs: 4,     // Mikro-avstånd
    sm: 8,     // Små mellanrum  
    md: 16,    // Standard avstånd
    lg: 24,    // Sektionsavstånd
    xl: 32,    // Huvudavstånd
    xxl: 48,   // Skärmavstånd
  },
  
  // Typografi - svenska system-teckensnitt
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System-Medium', 
      bold: 'System-Bold',
    },
    fontSize: {
      small: 14,   // Småtext
      caption: 16, // Bildtexter
      body: 18,    // Huvudinnehåll
      h2: 24,      // Sektionsrubriker
      h1: 28,      // Skärmrubriker
      hero: 32,    // Apptitel, speciella ögonblick
    },
    lineHeight: {
      tight: 1.2,   // Tajt
      normal: 1.4,  // Normal
      relaxed: 1.6, // Avslappnad
    }
  },
  
  // Rundade hörn
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    card: 16,
    button: 12,
  },
  
  // Skuggor för djup
  shadows: {
    card: {
      shadowColor: '#4A7C59',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3, // Android
    },
    button: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    }
  }
};

export type Theme = typeof SwedishForestTheme;