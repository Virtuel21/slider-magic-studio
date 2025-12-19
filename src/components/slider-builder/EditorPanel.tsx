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

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const exportData = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    triggerDownload(blob, 'slider-config.json');
    toast.success('Configuration exported');
  };

  const exportHtmlBundle = () => {
    const sliderDataString = JSON.stringify(data, null, 2).replace(/</g, '\u003c');
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slider Export</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Saira:ital,wght@0,100..900;1,100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; }
    .inApp {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100dvh;
      width: 100dvw;
      padding: 10px;
      box-sizing: border-box;
      background-color: #00000020;
      backdrop-filter: 20px;
      position: absolute;
      top: 0;
    }
    .inApp #widget {
      width: 100%;
      min-width: 300px;
      max-width: 340px;
      height: 100dvh;
      background: ${data.config.backgroundColor};
      overflow: hidden;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      color: ${data.config.titleColor};
      position: relative;
      align-items: center;
    }
    .inApp #widget .close{
      display: none;
      position: absolute;
      z-index: 10;
      right: 16px;
      top:16px;
    }
    .inApp #widget[data-id="1"] .close, .inApp #widget[data-id="0"] .close{
      display: block;
      position: absolute;
      z-index: 10;
      right: 16px;
      top:16px;
    }
    .inApp #widget img {
      width: 100%;
      height: 50%;
      object-fit: cover;
    }
    .inApp .content {
      padding: 0 20px 30px;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 50%;
      justify-content: flex-end;
    }
    .inApp .decor {
      position: absolute;
      top: 265px;
      left: -15px;
      scale: 0.8;
    }

    .inApp .slide[data-id="0"] .content #title {
      color: ${data.config.titleColor};
      font-family: Saira;
      display: flex;
      flex-direction: column;
      line-height: 100%;
      text-align: center;
      font-size: ${data.config.titleStyle.fontSize}px;
      text-transform: uppercase;
      letter-spacing: ${data.config.titleStyle.letterSpacing}px;
      font-weight: 900;
      width: 100%;
    }
    .inApp .slide[data-id="0"] .content #title span:nth-child(2) {
      font-size: ${Math.round(data.config.titleStyle.fontSize * 2.3)}px;
      line-height: 50%;
      color: ${data.config.accentColor};
    }
    .inApp .slide .content #subtitle {
      text-align: center;
      color: ${data.config.subtitleColor};
      font-size: ${data.config.subtitleStyle.fontSize}px;
      font-weight: 500;
      line-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: Archivo;
      margin: 0;
      letter-spacing: ${data.config.subtitleStyle.letterSpacing}px;
    }
    .inApp .slide .content #subtitle span:nth-child(3) {
      color: ${data.config.titleColor};
      display: block;
      width: 200px;
      height: 45px;
      box-sizing: border-box;
      border: 4px dashed ${data.config.titleColor};
      background-color: transparent;
      font-size: ${Math.max(data.config.subtitleStyle.fontSize, data.config.buttonStyle.fontSize)}px;
      line-height: 100%;
      padding: 5px 20px;
      font-weight: 900;
      margin-top: 10px;
    }
    .inApp #button-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: fit-content;
      gap: 10px;
      flex-wrap: wrap;
    }
    .inApp a {
      width: 200px;
      box-sizing: border-box;
      padding: 5px 40px;
      height: 50px;
      background-color: ${data.config.buttonColor};
      color: ${data.config.buttonTextColor};
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 900;
      font-family: Saira;
      font-size: ${data.config.buttonStyle.fontSize + 7}px;
      margin: 30px 0;
      text-transform: uppercase;
      text-decoration: none;
      display: flex;
      justify-content: center;
      align-items: center;
      letter-spacing: ${data.config.buttonStyle.letterSpacing}px;
    }
    .inApp a.outline {
      background: transparent;
      color: ${data.config.titleColor};
      border: 4px dashed ${data.config.titleColor};
    }
    .inApp .slide[data-id="0"] a {
      width: 200px;
      height: 40px;
      font-size: ${Math.max(data.config.buttonStyle.fontSize, 18)}px;
      line-height: 100%;
      padding: 5px 10px;
    }

    .inApp .dots {
      display: flex;
      gap: 8px;
      position: absolute;
      bottom: 20px;
    }
    .inApp .dot {
      width: 9px;
      height: 9px;
      background: ${data.config.dotColor};
      border-radius: 50%;
    }
    .inApp .dot.active {
      background: ${data.config.dotActiveColor};
    }
    .inApp #widget {
      position: relative;
      overflow: hidden;
    }
    #slides {
      display: flex;
      width: 100%;
      height: 100%;
      transition: transform 0.45s ease;
      position: relative;
    }
    .inApp .slide {
      height: 100%;
      width: 100%;
      opacity: 1;
      pointer-events: auto;
      flex: 0 0 100%;
      position: relative;
    }

    @media screen and (max-height: 734px){
      .inApp .decor{
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="inApp">
    <div id="widget" data-id="0">
      <div class="close">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="4" fill="${data.config.buttonColor}"/>
          <path d="M20 8L8 20.1527" stroke="${data.config.titleColor}" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round"/>
          <path d="M8 8.00358L20 20.1562" stroke="${data.config.titleColor}" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round"/>
        </svg>
      </div>
      <div id="slides"></div>
      <div class="dots"></div>
    </div>
  </div>
  <script>
    (() => {
      const sliderData = ${sliderDataString};

      const views = sliderData.slides.map((slide) => {
        const title = slide.title
          .map((line, idx) => \`<span style="color:${idx === 1 ? sliderData.config.accentColor : sliderData.config.titleColor}">${line}</span>\`)
          .join('');
        const subtitle = slide.subtitle.map((line) => \`<span>${line}</span>\`).join('');
        const btn = slide.buttons
          .map((button) => \`<a href="${button.url}" class="${button.variant === 'outline' ? 'outline' : 'primary'}">${button.text}</a>\`)
          .join('');

        return {
          title,
          subtitle,
          btn,
          img: slide.imageUrl
        };
      });

      const decor = \`<svg xmlns="http://www.w3.org/2000/svg" width="141" height="190" viewBox="0 0 141 190" fill="none">
            <g clip-path="url(#clip0_2_3269)">
            <path d="M-72.0328 16.379C-72.1701 34.9661 -68.6552 53.0283 -61.5835 70.0577C-54.7564 86.5059 -44.917 101.301 -32.3417 114.033C-19.7665 126.765 -5.08691 136.797 11.291 143.849C28.2513 151.151 46.292 154.919 64.9134 155.049L66.0131 155.058C65.8378 152.654 65.7279 150.221 65.7416 148.325C65.7551 146.426 65.9017 143.996 66.1137 141.594L65.014 141.585C48.2071 141.468 31.9306 138.071 16.6375 131.486C1.86168 125.127 -11.3841 116.075 -22.7338 104.581C-34.0832 93.0898 -42.9612 79.7404 -49.1214 64.9005C-55.4974 49.5419 -58.6682 33.2503 -58.5444 16.4745" fill="${data.config.titleColor}"/>
            <path d="M103.775 164.956C105.916 164.903 107.857 163.386 108.373 161.302C108.723 159.926 109.549 152.833 109.582 148.63C109.612 144.431 108.891 137.324 108.563 135.944C108.079 133.852 106.158 132.31 104.02 132.226L81.6669 132.069C79.5257 132.122 77.5846 133.639 77.0684 135.724C76.719 137.099 75.8928 144.192 75.8598 148.395C75.8294 152.594 76.5503 159.701 76.8788 161.081C77.3625 163.173 79.284 164.716 81.4215 164.799L103.775 164.956Z" fill="white"/>
            </g>
            <g clip-path="url(#clip1_2_3269)">
            <path d="M119.91 162.483C119.82 165.403 117.72 168.043 114.86 168.723C103.15 170.753 91.87 170.753 80.16 168.723C77.3 168.043 75.21 165.403 75.11 162.483V131.953C75.2 129.033 77.3 126.393 80.16 125.713C91.87 123.683 103.15 123.683 114.86 125.713C117.72 126.393 119.81 129.033 119.91 131.953V162.483Z" fill="${data.config.buttonColor}"/>
            <path d="M97.46 157.853C92.24 157.853 87.99 153.603 87.99 148.383V144.233H90.39V148.383C90.39 152.283 93.56 155.453 97.46 155.453C101.36 155.453 104.53 152.283 104.53 148.383V145.433H100.02V143.033H106.93V148.383C106.93 153.603 102.68 157.853 97.46 157.853Z" fill="${data.config.titleColor}"/>
            <path d="M92.2 136.213C90.95 136.213 89.93 137.233 89.93 138.483C89.93 139.733 90.95 140.753 92.2 140.753C93.45 140.753 94.47 139.733 94.47 138.483C94.47 137.233 93.45 136.213 92.2 136.213ZM107.58 135.183H104.87C103.89 136.613 102.52 138.103 101.56 138.103C100.6 138.103 100.45 137.043 100.45 136.583H97.99C97.99 138.923 99.46 140.563 101.56 140.563C104.65 140.563 107.23 136.143 107.71 135.253L107.57 135.183H107.58Z" fill="${data.config.titleColor}"/>
            </g>
            <defs>
            <clipPath id="clip0_2_3269">
            <rect width="165" height="169" fill="white" transform="translate(95.3945) rotate(84.4126)"/>
            </clipPath>
            <clipPath id="clip1_2_3269">
            <rect width="85.04" height="85.04" fill="white" transform="translate(55 104.703)"/>
            </clipPath>
            </defs>
          </svg>\`;


      const dc = document.querySelector('.inApp');
      const widget = dc.querySelector('#widget');
      const slidesContainer = document.getElementById('slides');
      const dotsContainer = widget.querySelector('.dots');
      const close = widget.querySelector('.close');
      let current = 0;
      let startX = 0;
      let endX = 0;

      function renderSlides() {
        slidesContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        views.forEach((v, index) => {
          const slide = document.createElement('div');
          slide.classList.add('slide');
          slide.dataset.id = String(index);
          slide.innerHTML = \`
        <img id="widget-img" src="${v.img}" />
        <div class="content">
             <div class="decor">
          ${decor}
        </div>
          <h2 id="title">${v.title}</h2>
          <h3 id="subtitle">${v.subtitle}</h3>
          <div id="button-wrapper">
            ${v.btn}
          </div>
        </div>
      \`;
          slidesContainer.appendChild(slide);

          const dot = document.createElement('span');
          dot.classList.add('dot');
          dot.dataset.id = String(index);
          dotsContainer.appendChild(dot);
        });
      }

      function updateSlideContent() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        widget.dataset.id = String(current);
        const slides = slidesContainer.querySelectorAll('.slide');
          slides.forEach((s, i) => {
            s.classList.toggle('active', i === current);
          });
        slidesContainer.style.transform = 'translateX(-' + current * 100 + '%)';
      }
      function handleButtons() {
        const allButtons = dc.querySelectorAll('#slides a');
        allButtons.forEach((btn) => {
          const t = btn.textContent?.toLowerCase() || '';
          btn.addEventListener('click', (e) => e.stopPropagation());
          if (btn.classList.contains('outline')) {
            btn.style.backgroundColor = 'transparent';
            btn.style.borderColor = sliderData.config.titleColor;
            btn.style.color = sliderData.config.titleColor;
          }

          if (t.includes('envoie')) {
              btn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  if (typeof SRInApp !== 'undefined') {
                    SRInApp.trackCustomEvent(
                      'inApp.click',
                      {
                        button:'envoie'
                      },
                      'In-App C2U'
                    );
                    setTimeout(() => {
                      SRInApp.close();
                    },100);
                  }
              });
          }
        });
      }

      function attachDotListeners() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot) => {
          dot.addEventListener('click', () => {
            const next = parseInt(dot.dataset.id || '0');
            if (next !== current) goToSlide(next);
          });
        });
      }

      function slideToNext() {
        goToSlide((current + 1) % views.length);
      }

      function goToSlide(index) {
        current = index;
        updateSlideContent();
      }

      let isTouchOnButton = false;
      slidesContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        endX = startX;
        const target = e.target;
        isTouchOnButton = target && target.tagName === 'A';
      });

      slidesContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
      });
      
      slidesContainer.addEventListener('touchend', () => {
        if (isTouchOnButton) {
          isTouchOnButton = false;
          return;
        }
        const diff = endX - startX;
        if (Math.abs(diff) < 10) {
          return;
        }
        if (diff < 0) {
          slideToNext();
        } else {
          const prevIndex = (current - 1 + views.length) % views.length;
          goToSlide(prevIndex);
        }
      });
      
      close.addEventListener('click', () => {
        if (typeof SRInApp !== 'undefined') {
          SRInApp.close();
        }
        });

      renderSlides();
      attachDotListeners();
      handleButtons();
      updateSlideContent();
    })();
  </script>
</body>
</html>`;

    const blob = new Blob([template], { type: 'text/html' });
    triggerDownload(blob, 'slider-export.html');
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
