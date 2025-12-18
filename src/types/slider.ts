export interface SlideButton {
  id: string;
  text: string;
  url: string;
  variant: 'primary' | 'outline';
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
}

export interface SliderData {
  slides: Slide[];
  config: SliderConfig;
}
