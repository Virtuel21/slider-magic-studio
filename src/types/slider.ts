export interface SlideButton {
  id: string;
  text: string;
  url: string;
  variant: 'primary' | 'outline';
}

export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

export interface TextStyle {
  fontSize: number;
  letterSpacing: number;
  color?: string;
  textAlign?: TextAlignment;
}

export interface Slide {
  id: string;
  title: string[];
  subtitle: string[];
  imageUrl: string;
  buttons: SlideButton[];
}

export interface SliderConfig {
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  titleColor: string;
  subtitleColor: string;
  accentColor: string;
  dotColor: string;
  dotActiveColor: string;
  arrowColor: string;
  // Typography settings
  titleStyle: TextStyle;
  subtitleStyle: TextStyle;
  buttonStyle: TextStyle;
}

export interface SliderData {
  slides: Slide[];
  config: SliderConfig;
}

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';
