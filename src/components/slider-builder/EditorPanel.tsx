import { useState } from 'react';
import { SliderData, Slide } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SlideEditor } from './SlideEditor';
import { StyleEditor } from './StyleEditor';
import { TypographyEditor } from './TypographyEditor';
import { Plus, Trash2, Copy, Download, Layers, FileCode } from 'lucide-react';
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
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const reorderSlides = (from: number, to: number) => {
    if (from === to) return;
    const updatedSlides = [...data.slides];
    const [moved] = updatedSlides.splice(from, 1);
    updatedSlides.splice(to, 0, moved);
    onDataChange({ ...data, slides: updatedSlides });
    const newIndex = updatedSlides.findIndex((slide) => slide.id === moved.id);
    onSlideChange(newIndex);
    toast.success('Slides reordered');
  };

  const handleDrop = (targetIndex: number) => {
    if (draggingIndex === null) return;
    reorderSlides(draggingIndex, targetIndex);
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnter = (targetIndex: number) => {
    if (draggingIndex === null || draggingIndex === targetIndex) return;
    setDragOverIndex(targetIndex);
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
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

  const exportHtmlBundle = () => {
    const sliderDataString = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slider Export</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #0f172a; display: flex; align-items: center; justify-content: center; padding: 24px; }
    #sms-slider-root { width: min(100%, 960px); }
    .sms-slider { position: relative; background: var(--sms-bg); color: var(--sms-title); border-radius: 18px; overflow: hidden; width: 100%; min-height: 520px; box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25); isolation: isolate; }
    .sms-slides { position: relative; height: 100%; }
    .sms-slide { position: absolute; inset: 0; display: flex; flex-direction: column; opacity: 0; transform: translateX(12px); transition: opacity 220ms ease, transform 220ms ease; pointer-events: none; }
    .sms-slide.is-active { opacity: 1; transform: translateX(0); pointer-events: auto; }
    .sms-image { height: 45%; width: 100%; overflow: hidden; }
    .sms-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .sms-content { flex: 1; display: flex; flex-direction: column; gap: 10px; justify-content: flex-end; padding: 24px 28px 64px; }
    .sms-title, .sms-subtitle { display: flex; flex-direction: column; gap: 4px; }
    .sms-title span { font-family: 'Saira', 'Inter', system-ui, sans-serif; font-weight: 900; text-transform: uppercase; line-height: 1.1; }
    .sms-subtitle span { font-family: 'Archivo', 'Inter', system-ui, sans-serif; font-weight: 500; line-height: 1.2; }
    .sms-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
    .sms-buttons a { text-decoration: none; font-family: 'Saira', 'Inter', system-ui, sans-serif; font-weight: 800; text-transform: uppercase; border-radius: 12px; padding: 10px 18px; transition: transform 160ms ease, box-shadow 160ms ease; }
    .sms-buttons a:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,0,0,0.12); }
    .sms-buttons a.primary { background: var(--sms-button); color: var(--sms-button-text); border: none; }
    .sms-buttons a.outline { background: transparent; color: var(--sms-title); border: 3px solid var(--sms-title); }
    .sms-dots { position: absolute; bottom: 16px; left: 0; right: 0; display: flex; justify-content: center; gap: 8px; }
    .sms-dot { width: 11px; height: 11px; border-radius: 9999px; background: var(--sms-dot); border: none; cursor: pointer; transition: transform 160ms ease, background 160ms ease; }
    .sms-dot.is-active { background: var(--sms-dot-active); transform: scale(1.05); }
    .sms-arrow { position: absolute; top: 42%; transform: translateY(-50%); border: none; background: transparent; color: var(--sms-arrow); cursor: pointer; width: 42px; height: 42px; display: grid; place-items: center; font-size: 24px; font-weight: 800; }
    .sms-arrow:focus-visible { outline: 2px solid var(--sms-dot-active); outline-offset: 4px; border-radius: 10px; }
    .sms-arrow.prev { left: 6px; }
    .sms-arrow.next { right: 6px; }
    .sms-close { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; border: none; cursor: pointer; background: var(--sms-button); color: var(--sms-button-text); font-weight: 800; }
    @media (max-width: 640px) {
      body { padding: 16px; }
      .sms-slider { min-height: 580px; }
      .sms-content { padding: 18px 18px 60px; }
    }
  </style>
</head>
<body>
  <div id="sms-slider-root"></div>
  <script>
    (() => {
      const sliderData = ${sliderDataString};
      const alignToFlex = (align = 'center') => {
        switch (align) {
          case 'left':
            return 'flex-start';
          case 'right':
            return 'flex-end';
          case 'justify':
            return 'stretch';
          default:
            return 'center';
        }
      };

      const justifyForAlign = (align = 'center') => {
        switch (align) {
          case 'left':
            return 'flex-start';
          case 'right':
            return 'flex-end';
          case 'justify':
            return 'space-between';
          default:
            return 'center';
        }
      };

      const root = document.getElementById('sms-slider-root');
      const slider = document.createElement('div');
      slider.className = 'sms-slider';
      slider.style.setProperty('--sms-bg', sliderData.config.backgroundColor);
      slider.style.setProperty('--sms-button', sliderData.config.buttonColor);
      slider.style.setProperty('--sms-button-text', sliderData.config.buttonTextColor);
      slider.style.setProperty('--sms-title', sliderData.config.titleColor);
      slider.style.setProperty('--sms-subtitle', sliderData.config.subtitleColor);
      slider.style.setProperty('--sms-accent', sliderData.config.accentColor);
      slider.style.setProperty('--sms-dot', sliderData.config.dotColor);
      slider.style.setProperty('--sms-dot-active', sliderData.config.dotActiveColor);
      slider.style.setProperty('--sms-arrow', sliderData.config.arrowColor);

      const slidesWrapper = document.createElement('div');
      slidesWrapper.className = 'sms-slides';

      const slides = [];
      const dots = [];

      sliderData.slides.forEach((slide, index) => {
        const slideEl = document.createElement('div');
        slideEl.className = 'sms-slide' + (index === 0 ? ' is-active' : '');
        slideEl.dataset.index = String(index);

        const imageWrap = document.createElement('div');
        imageWrap.className = 'sms-image';
        const img = document.createElement('img');
        img.src = slide.imageUrl;
        img.alt = 'Slide ' + (index + 1);
        imageWrap.appendChild(img);

        const content = document.createElement('div');
        content.className = 'sms-content';

        const titleBlock = document.createElement('div');
        titleBlock.className = 'sms-title';
        const titleAlign = slide.titleStyle?.textAlign || sliderData.config.titleStyle.textAlign || 'center';
        titleBlock.style.textAlign = titleAlign;
        titleBlock.style.alignItems = alignToFlex(titleAlign);
        slide.title.forEach((line, lineIndex) => {
          const span = document.createElement('span');
          span.textContent = line;
          span.style.color = lineIndex === 1 ? sliderData.config.accentColor : sliderData.config.titleColor;
          span.style.fontSize = sliderData.config.titleStyle.fontSize + 'px';
          span.style.letterSpacing = sliderData.config.titleStyle.letterSpacing + 'px';
          titleBlock.appendChild(span);
        });

        const subtitleBlock = document.createElement('div');
        subtitleBlock.className = 'sms-subtitle';
        const subtitleAlign = slide.subtitleStyle?.textAlign || sliderData.config.subtitleStyle.textAlign || 'center';
        subtitleBlock.style.textAlign = subtitleAlign;
        subtitleBlock.style.alignItems = alignToFlex(subtitleAlign);
        slide.subtitle.forEach((line) => {
          const span = document.createElement('span');
          span.textContent = line;
          span.style.color = sliderData.config.subtitleColor;
          span.style.fontSize = sliderData.config.subtitleStyle.fontSize + 'px';
          span.style.letterSpacing = sliderData.config.subtitleStyle.letterSpacing + 'px';
          subtitleBlock.appendChild(span);
        });

        const buttonsBlock = document.createElement('div');
        buttonsBlock.className = 'sms-buttons';
        const buttonAlign = slide.buttonStyle?.textAlign || sliderData.config.buttonStyle.textAlign || 'center';
        buttonsBlock.style.justifyContent = justifyForAlign(buttonAlign);
        buttonsBlock.style.alignItems = alignToFlex(buttonAlign);

        slide.buttons.forEach((btn) => {
          const anchor = document.createElement('a');
          anchor.textContent = btn.text;
          anchor.href = btn.url;
          anchor.target = '_blank';
          anchor.rel = 'noreferrer';
          anchor.className = btn.variant === 'outline' ? 'outline' : 'primary';
          anchor.style.fontSize = sliderData.config.buttonStyle.fontSize + 'px';
          anchor.style.letterSpacing = sliderData.config.buttonStyle.letterSpacing + 'px';
          buttonsBlock.appendChild(anchor);
        });

        content.appendChild(titleBlock);
        content.appendChild(subtitleBlock);
        content.appendChild(buttonsBlock);

        slideEl.appendChild(imageWrap);
        slideEl.appendChild(content);
        slidesWrapper.appendChild(slideEl);
        slides.push(slideEl);
      });

      const prevBtn = document.createElement('button');
      prevBtn.className = 'sms-arrow prev';
      prevBtn.setAttribute('aria-label', 'Previous slide');
      prevBtn.innerHTML = '&#10094;';

      const nextBtn = document.createElement('button');
      nextBtn.className = 'sms-arrow next';
      nextBtn.setAttribute('aria-label', 'Next slide');
      nextBtn.innerHTML = '&#10095;';

      const dotsWrapper = document.createElement('div');
      dotsWrapper.className = 'sms-dots';

      sliderData.slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'sms-dot' + (index === 0 ? ' is-active' : '');
        dot.dataset.index = String(index);
        dotsWrapper.appendChild(dot);
        dots.push(dot);
      });

      const closeButton = document.createElement('button');
      closeButton.className = 'sms-close';
      closeButton.textContent = '×';
      closeButton.setAttribute('aria-label', 'Close');
      closeButton.style.display = sliderData.slides.length > 0 ? 'grid' : 'none';

      let activeIndex = 0;

      const updateSlides = (nextIndex) => {
        const index = Math.max(0, Math.min(slides.length - 1, nextIndex));
        slides.forEach((slideEl, i) => {
          if (i === index) {
            slideEl.classList.add('is-active');
          } else {
            slideEl.classList.remove('is-active');
          }
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === index);
        });
        activeIndex = index;
        closeButton.style.display = index === slides.length - 1 ? 'grid' : 'none';
      };

      prevBtn.addEventListener('click', () => updateSlides(activeIndex - 1));
      nextBtn.addEventListener('click', () => updateSlides(activeIndex + 1));
      dots.forEach((dot, index) => dot.addEventListener('click', () => updateSlides(index)));
      closeButton.addEventListener('click', () => slider.remove());

      slider.appendChild(slidesWrapper);
      slider.appendChild(prevBtn);
      slider.appendChild(nextBtn);
      slider.appendChild(dotsWrapper);
      slider.appendChild(closeButton);

      root.appendChild(slider);
    })();
  </script>
</body>
</html>`;

    const blob = new Blob([template], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slider-export.html';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export HTML/CSS/JS prêt');
  };

  return (
    <div className="w-full lg:w-[400px] bg-card border-l border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Layers size={20} className="text-primary" />
          Slider Builder
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            className="gap-2"
          >
            <Download size={14} />
            Export JSON
          </Button>
          <Button
            size="sm"
            onClick={exportHtmlBundle}
            className="gap-2"
          >
            <FileCode size={14} />
            Export Code
          </Button>
        </div>
      </div>

      {/* Slide Tabs */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {data.slides.map((slide, i) => {
            const isActive = i === currentSlide;
            const isDragOver = dragOverIndex === i && draggingIndex !== null;

            return (
              <button
                key={slide.id}
                onClick={() => onSlideChange(i)}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={() => handleDrop(i)}
                onDragEnd={handleDragEnd}
                aria-grabbed={draggingIndex === i}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border
                  ${isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                  }
                  ${isDragOver ? 'ring-2 ring-primary/60' : ''}
                  ${draggingIndex === i ? 'opacity-80' : ''}
                `}
              >
                Slide {i + 1}
              </button>
            );
          })}
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
