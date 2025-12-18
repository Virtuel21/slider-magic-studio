import { TextStyle, SliderConfig } from '@/types/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Type, ALargeSmall, Space } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface TypographyEditorProps {
  config: SliderConfig;
  onUpdate: (config: SliderConfig) => void;
}

interface StyleSectionProps {
  label: string;
  style: TextStyle;
  colorValue: string;
  onStyleChange: (style: TextStyle) => void;
  onColorChange: (color: string) => void;
}

const StyleSection = ({ label, style, colorValue, onStyleChange, onColorChange }: StyleSectionProps) => {
  return (
    <div className="p-3 bg-muted/30 rounded-lg space-y-3">
      <h4 className="text-sm font-medium text-foreground">{label}</h4>
      
      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ALargeSmall size={12} />
            Font Size
          </Label>
          <span className="text-xs text-muted-foreground">{style.fontSize}px</span>
        </div>
        <Slider
          value={[style.fontSize]}
          onValueChange={([value]) => onStyleChange({ ...style, fontSize: value })}
          min={10}
          max={72}
          step={1}
          className="w-full"
        />
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Space size={12} />
            Letter Spacing
          </Label>
          <span className="text-xs text-muted-foreground">{style.letterSpacing}px</span>
        </div>
        <Slider
          value={[style.letterSpacing]}
          onValueChange={([value]) => onStyleChange({ ...style, letterSpacing: value })}
          min={-5}
          max={20}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Color */}
      <ColorPicker
        label="Color"
        value={colorValue}
        onChange={onColorChange}
      />
    </div>
  );
};

export const TypographyEditor = ({ config, onUpdate }: TypographyEditorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
        <Type size={16} />
        Typography
      </div>

      <StyleSection
        label="Title Style"
        style={config.titleStyle}
        colorValue={config.titleColor}
        onStyleChange={(titleStyle) => onUpdate({ ...config, titleStyle })}
        onColorChange={(titleColor) => onUpdate({ ...config, titleColor })}
      />

      <StyleSection
        label="Subtitle Style"
        style={config.subtitleStyle}
        colorValue={config.subtitleColor}
        onStyleChange={(subtitleStyle) => onUpdate({ ...config, subtitleStyle })}
        onColorChange={(subtitleColor) => onUpdate({ ...config, subtitleColor })}
      />

      <StyleSection
        label="Button Text Style"
        style={config.buttonStyle}
        colorValue={config.buttonTextColor}
        onStyleChange={(buttonStyle) => onUpdate({ ...config, buttonStyle })}
        onColorChange={(buttonTextColor) => onUpdate({ ...config, buttonTextColor })}
      />
    </div>
  );
};
