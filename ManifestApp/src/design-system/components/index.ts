/**
 * 📐 FIGMA DESIGN SYSTEM COMPONENTS
 * 
 * Export all Figma design system components
 */

export { FigmaButton } from './FigmaButton';
export { FigmaCard } from './FigmaCard';
export { FigmaInput } from './FigmaInput';
export { 
  FigmaText, 
  FigmaHeading1, 
  FigmaHeading2, 
  FigmaHeading3, 
  FigmaBody, 
  FigmaCaption 
} from './FigmaText';

// Re-export design system core
export { DesignTokens, ComponentVariants, Layout, FigmaComponentFactory } from '../FigmaDesignSystem';