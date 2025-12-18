import { Slide, SlideButton } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Image } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  slideIndex: number;
  onUpdate: (slide: Slide) => void;
}

export const SlideEditor = ({ slide, slideIndex, onUpdate }: SlideEditorProps) => {
  const updateTitle = (index: number, value: string) => {
    const newTitle = [...slide.title];
    newTitle[index] = value;
    onUpdate({ ...slide, title: newTitle });
  };

  const addTitleLine = () => {
    onUpdate({ ...slide, title: [...slide.title, ''] });
  };

  const removeTitleLine = (index: number) => {
    const newTitle = slide.title.filter((_, i) => i !== index);
    onUpdate({ ...slide, title: newTitle });
  };

  const updateSubtitle = (index: number, value: string) => {
    const newSubtitle = [...slide.subtitle];
    newSubtitle[index] = value;
    onUpdate({ ...slide, subtitle: newSubtitle });
  };

  const addSubtitleLine = () => {
    onUpdate({ ...slide, subtitle: [...slide.subtitle, ''] });
  };

  const removeSubtitleLine = (index: number) => {
    const newSubtitle = slide.subtitle.filter((_, i) => i !== index);
    onUpdate({ ...slide, subtitle: newSubtitle });
  };

  const updateButton = (buttonId: string, updates: Partial<SlideButton>) => {
    const newButtons = slide.buttons.map((btn) =>
      btn.id === buttonId ? { ...btn, ...updates } : btn
    );
    onUpdate({ ...slide, buttons: newButtons });
  };

  const addButton = () => {
    const newButton: SlideButton = {
      id: `${slide.id}-${Date.now()}`,
      text: 'New Button',
      url: '#',
      variant: 'primary',
    };
    onUpdate({ ...slide, buttons: [...slide.buttons, newButton] });
  };

  const removeButton = (buttonId: string) => {
    const newButtons = slide.buttons.filter((btn) => btn.id !== buttonId);
    onUpdate({ ...slide, buttons: newButtons });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Image */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Image size={14} />
          Image URL
        </Label>
        <Input
          value={slide.imageUrl}
          onChange={(e) => onUpdate({ ...slide, imageUrl: e.target.value })}
          placeholder="https://..."
          className="bg-muted border-border text-sm"
        />
      </div>

      {/* Title Lines */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Title Lines</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addTitleLine}
            className="h-6 px-2 text-xs text-primary hover:text-primary"
          >
            <Plus size={12} className="mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {slide.title.map((line, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={line}
                onChange={(e) => updateTitle(i, e.target.value)}
                placeholder={`Title line ${i + 1}`}
                className="bg-muted border-border text-sm flex-1"
              />
              {slide.title.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTitleLine(i)}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subtitle Lines */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Subtitle Lines</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addSubtitleLine}
            className="h-6 px-2 text-xs text-primary hover:text-primary"
          >
            <Plus size={12} className="mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {slide.subtitle.map((line, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={line}
                onChange={(e) => updateSubtitle(i, e.target.value)}
                placeholder={`Subtitle line ${i + 1}`}
                className="bg-muted border-border text-sm flex-1"
              />
              {slide.subtitle.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubtitleLine(i)}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">CTA Buttons</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addButton}
            className="h-6 px-2 text-xs text-primary hover:text-primary"
          >
            <Plus size={12} className="mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {slide.buttons.map((btn) => (
            <div key={btn.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex gap-2">
                <Input
                  value={btn.text}
                  onChange={(e) => updateButton(btn.id, { text: e.target.value })}
                  placeholder="Button text"
                  className="bg-muted border-border text-sm flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeButton(btn.id)}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <Input
                value={btn.url}
                onChange={(e) => updateButton(btn.id, { url: e.target.value })}
                placeholder="URL"
                className="bg-muted border-border text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant={btn.variant === 'primary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateButton(btn.id, { variant: 'primary' })}
                  className="flex-1 text-xs"
                >
                  Primary
                </Button>
                <Button
                  variant={btn.variant === 'outline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateButton(btn.id, { variant: 'outline' })}
                  className="flex-1 text-xs"
                >
                  Outline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
