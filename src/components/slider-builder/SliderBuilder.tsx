import { useState } from 'react';
import { SliderData } from '@/types/slider';
import { defaultSliderData } from '@/data/defaultSliderData';
import { SliderPreview } from './SliderPreview';
import { EditorPanel } from './EditorPanel';

export const SliderBuilder = () => {
  const [data, setData] = useState<SliderData>(defaultSliderData);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Preview Area */}
      <div className="flex-1 min-h-[60vh] lg:min-h-screen">
        <SliderPreview
          data={data}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
        />
      </div>

      {/* Editor Panel */}
      <EditorPanel
        data={data}
        currentSlide={currentSlide}
        onDataChange={setData}
        onSlideChange={setCurrentSlide}
      />
    </div>
  );
};
