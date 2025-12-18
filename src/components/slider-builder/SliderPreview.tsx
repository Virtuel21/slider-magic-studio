import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SliderData } from '@/types/slider';

interface SliderPreviewProps {
  data: SliderData;
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

export const SliderPreview = ({ data, currentSlide, onSlideChange }: SliderPreviewProps) => {
  const { slides, config } = data;
  const slide = slides[currentSlide];

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/30 p-4">
      <div
        className="relative w-full max-w-[340px] h-[90vh] max-h-[700px] rounded-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: config.backgroundColor }}
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
        <div className="h-1/2 w-full overflow-hidden">
          <img
            src={slide.imageUrl}
            alt="Slide"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slide Content */}
        <div className="h-1/2 flex flex-col items-center justify-end p-5 pb-16 relative">
          {/* Title */}
          <div className="text-center mb-2">
            {slide.title.map((line, i) => (
              <div
                key={i}
                className="font-saira font-black uppercase leading-tight"
                style={{
                  color: i === 1 && currentSlide === 0 ? config.accentColor : config.titleColor,
                  fontSize: currentSlide === 2 && i === 1 ? '48px' : i === 1 ? '26px' : '28px',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <div className="text-center mb-4">
            {slide.subtitle.map((line, i) => (
              <div
                key={i}
                className="font-archivo font-medium leading-tight"
                style={{
                  color: config.subtitleColor,
                  fontSize: '18px',
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
          <div className="flex gap-2 mt-4">
            {slide.buttons.map((btn) => (
              <button
                key={btn.id}
                className="px-6 py-2 rounded-lg font-saira font-black uppercase text-lg transition-transform hover:scale-105"
                style={{
                  backgroundColor: btn.variant === 'primary' ? config.buttonColor : 'transparent',
                  color: btn.variant === 'primary' ? config.buttonTextColor : config.titleColor,
                  border: btn.variant === 'outline' ? `3px solid ${config.titleColor}` : 'none',
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
