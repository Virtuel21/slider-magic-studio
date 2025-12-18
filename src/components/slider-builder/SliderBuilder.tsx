import { useState } from 'react';
import { SliderData, ViewportMode } from '@/types/slider';
import { defaultSliderData } from '@/data/defaultSliderData';
import { SliderPreview } from './SliderPreview';
import { EditorPanel } from './EditorPanel';
import { ViewportSwitcher } from './ViewportSwitcher';

export const SliderBuilder = () => {
  const [data, setData] = useState<SliderData>(defaultSliderData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('mobile');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Preview Area */}
      <div className="flex-1 min-h-[60vh] lg:min-h-screen flex flex-col">
        {/* Viewport Switcher */}
        <div className="flex justify-center py-3 bg-background/80 backdrop-blur-sm border-b border-border">
          <ViewportSwitcher mode={viewportMode} onChange={setViewportMode} />
        </div>
        
        {/* Preview */}
        <div className="flex-1">
          <SliderPreview
            data={data}
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            viewportMode={viewportMode}
          />
        </div>
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
