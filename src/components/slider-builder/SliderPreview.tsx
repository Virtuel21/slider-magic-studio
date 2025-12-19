import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SliderData, TextAlignment, ViewportMode } from '@/types/slider';

interface SliderPreviewProps {
  data: SliderData;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  viewportMode: ViewportMode;
}

const viewportSizes = {
  mobile: { width: 340, height: 700 },
  tablet: { width: 500, height: 700 },
  desktop: { width: 800, height: 600 },
};

const getAlignItemsClass = (alignment: TextAlignment = 'center') => {
  switch (alignment) {
    case 'left':
      return 'items-start';
    case 'right':
      return 'items-end';
    case 'justify':
      return 'items-stretch';
    default:
      return 'items-center';
  }
};

const getJustifyContentClass = (alignment: TextAlignment = 'center') => {
  switch (alignment) {
    case 'left':
      return 'justify-start';
    case 'right':
      return 'justify-end';
    case 'justify':
      return 'justify-between';
    default:
      return 'justify-center';
  }
};

export const SliderPreview = ({ data, currentSlide, onSlideChange, viewportMode }: SliderPreviewProps) => {
  const { slides, config } = data;
  const slide = slides[currentSlide];
  const viewport = viewportSizes[viewportMode];
  const titleAlign = config.titleStyle.textAlign ?? 'center';
  const subtitleAlign = config.subtitleStyle.textAlign ?? 'center';
  const buttonAlign = config.buttonStyle.textAlign ?? 'center';

  const goToNext = () => {
    if (currentSlide < slides.length - 1) {
      onSlideChange(currentSlide + 1);
    }
  };

  const goToPrev = () => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  };

  if (!slide) return null;

  // Compute responsive font sizes based on viewport
  const scaleFactor = viewportMode === 'desktop' ? 1.2 : viewportMode === 'tablet' ? 1.1 : 1;
  const titleFontSize = config.titleStyle.fontSize * scaleFactor;
  const subtitleFontSize = config.subtitleStyle.fontSize * scaleFactor;
  const buttonFontSize = config.buttonStyle.fontSize * scaleFactor;

  return (
    <div className="flex items-center justify-center min-h-full bg-black/30 p-4">
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
        style={{
          backgroundColor: config.backgroundColor,
          width: `${viewport.width}px`,
          height: `${viewport.height}px`,
          maxWidth: '100%',
          maxHeight: '90vh',
        }}
      >
        {/* Close button - only on last slide */}
        {currentSlide === slides.length - 1 && (
          <button
            className="absolute top-4 right-4 z-10 w-7 h-7 rounded flex items-center justify-center"
            style={{ backgroundColor: config.buttonColor }}
          >
            <X size={18} style={{ color: config.buttonTextColor }} strokeWidth={3} />
          </button>
        )}

        {/* Navigation arrows */}
        {currentSlide > 0 && (
          <button
            onClick={goToPrev}
            className="absolute left-2 top-[40%] z-10 p-2"
            style={{ color: config.arrowColor }}
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
        )}
        {currentSlide < slides.length - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-2 top-[40%] z-10 p-2"
            style={{ color: config.arrowColor }}
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        )}

        {/* Slide Image */}
        <div className={viewportMode === 'desktop' ? 'h-2/5' : 'h-1/2'} style={{ width: '100%', overflow: 'hidden' }}>
          <img
            src={slide.imageUrl}
            alt="Slide"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slide Content */}
        <div className={`${viewportMode === 'desktop' ? 'h-3/5' : 'h-1/2'} flex flex-col justify-end p-5 pb-16 relative gap-2`}>
          {/* Title */}
          <div
            className={`w-full flex flex-col mb-2 ${getAlignItemsClass(titleAlign)}`}
            style={{ textAlign: titleAlign }}
          >
            {slide.title.map((line, i) => (
              <div
                key={i}
                className="font-saira font-black uppercase leading-tight"
                style={{
                  color: i === 1 && currentSlide === 0 ? config.accentColor : config.titleColor,
                  fontSize: `${titleFontSize}px`,
                  letterSpacing: `${config.titleStyle.letterSpacing}px`,
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <div
            className={`w-full flex flex-col mb-4 ${getAlignItemsClass(subtitleAlign)}`}
            style={{ textAlign: subtitleAlign }}
          >
            {slide.subtitle.map((line, i) => (
              <div
                key={i}
                className="font-archivo font-medium leading-tight"
                style={{
                  color: config.subtitleColor,
                  fontSize: `${subtitleFontSize}px`,
                  letterSpacing: `${config.subtitleStyle.letterSpacing}px`,
                  fontWeight: i === slide.subtitle.length - 1 && currentSlide === 2 ? 800 : 500,
                }}
              >
                {currentSlide === 2 && i === 2 ? (
                  <span
                    className="inline-block px-4 py-1 mt-2 border-2 border-dashed font-bold"
                    style={{ borderColor: config.titleColor, color: config.titleColor }}
                  >
                    {line}
                  </span>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div
            className={`flex gap-2 mt-4 flex-wrap ${getJustifyContentClass(buttonAlign)} ${getAlignItemsClass(buttonAlign)}`}
            style={{ textAlign: buttonAlign }}
          >
            {slide.buttons.map((btn) => (
              <button
                key={btn.id}
                className="px-6 py-2 rounded-lg font-saira font-black uppercase transition-transform hover:scale-105"
                style={{
                  backgroundColor: btn.variant === 'primary' ? config.buttonColor : 'transparent',
                  color: btn.variant === 'primary' ? config.buttonTextColor : config.titleColor,
                  border: btn.variant === 'outline' ? `3px solid ${config.titleColor}` : 'none',
                  fontSize: `${buttonFontSize}px`,
                  letterSpacing: `${config.buttonStyle.letterSpacing}px`,
                }}
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => onSlideChange(i)}
              className="w-2.5 h-2.5 rounded-full transition-colors"
              style={{
                backgroundColor: i === currentSlide ? config.dotActiveColor : config.dotColor,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
