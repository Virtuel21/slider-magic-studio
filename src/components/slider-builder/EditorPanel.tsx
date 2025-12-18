import { useState } from 'react';
import { SliderData, Slide } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SlideEditor } from './SlideEditor';
import { StyleEditor } from './StyleEditor';
import { TypographyEditor } from './TypographyEditor';
import { Plus, Trash2, Copy, Download, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface EditorPanelProps {
  data: SliderData;
  currentSlide: number;
  onDataChange: (data: SliderData) => void;
  onSlideChange: (index: number) => void;
}

export const EditorPanel = ({
  data,
  currentSlide,
  onDataChange,
  onSlideChange,
}: EditorPanelProps) => {
  const [activeTab, setActiveTab] = useState('content');

  const updateSlide = (updatedSlide: Slide) => {
    const newSlides = data.slides.map((s) =>
      s.id === updatedSlide.id ? updatedSlide : s
    );
    onDataChange({ ...data, slides: newSlides });
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: ['New Slide'],
      subtitle: ['Add your content here'],
      imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
      buttons: [
        { id: `${Date.now()}-1`, text: 'CLICK ME', url: '#', variant: 'primary' },
      ],
    };
    onDataChange({ ...data, slides: [...data.slides, newSlide] });
    onSlideChange(data.slides.length);
    toast.success('Slide added');
  };

  const deleteSlide = (index: number) => {
    if (data.slides.length <= 1) {
      toast.error('Cannot delete the last slide');
      return;
    }
    const newSlides = data.slides.filter((_, i) => i !== index);
    onDataChange({ ...data, slides: newSlides });
    if (currentSlide >= newSlides.length) {
      onSlideChange(newSlides.length - 1);
    }
    toast.success('Slide deleted');
  };

  const duplicateSlide = (index: number) => {
    const slideToDuplicate = data.slides[index];
    const newSlide: Slide = {
      ...slideToDuplicate,
      id: Date.now().toString(),
      buttons: slideToDuplicate.buttons.map((btn) => ({
        ...btn,
        id: `${Date.now()}-${btn.id}`,
      })),
    };
    const newSlides = [...data.slides];
    newSlides.splice(index + 1, 0, newSlide);
    onDataChange({ ...data, slides: newSlides });
    onSlideChange(index + 1);
    toast.success('Slide duplicated');
  };

  const exportData = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slider-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Configuration exported');
  };

  return (
    <div className="w-full lg:w-[400px] bg-card border-l border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Layers size={20} className="text-primary" />
          Slider Builder
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={exportData}
          className="gap-2"
        >
          <Download size={14} />
          Export
        </Button>
      </div>

      {/* Slide Tabs */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {data.slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => onSlideChange(i)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${i === currentSlide
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              Slide {i + 1}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={addSlide}
            className="h-8 px-2"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        {/* Slide Actions */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => duplicateSlide(currentSlide)}
            className="flex-1 text-xs gap-1"
          >
            <Copy size={12} />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteSlide(currentSlide)}
            className="flex-1 text-xs gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 size={12} />
            Delete
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 grid grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto p-4 editor-scroll">
            <TabsContent value="content" className="mt-0">
              {data.slides[currentSlide] && (
                <SlideEditor
                  slide={data.slides[currentSlide]}
                  slideIndex={currentSlide}
                  onUpdate={updateSlide}
                />
              )}
            </TabsContent>
            
            <TabsContent value="style" className="mt-0">
              <StyleEditor
                config={data.config}
                onUpdate={(config) => onDataChange({ ...data, config })}
              />
            </TabsContent>

            <TabsContent value="typography" className="mt-0">
              <TypographyEditor
                config={data.config}
                onUpdate={(config) => onDataChange({ ...data, config })}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
