import { SliderConfig } from '@/types/slider';
import { ColorPicker } from './ColorPicker';
import { Palette } from 'lucide-react';

interface StyleEditorProps {
  config: SliderConfig;
  onUpdate: (config: SliderConfig) => void;
}

export const StyleEditor = ({ config, onUpdate }: StyleEditorProps) => {
  const updateConfig = (key: keyof SliderConfig, value: string) => {
    onUpdate({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
        <Palette size={16} />
        Global Colors
      </div>
      
      <div className="space-y-3">
        <ColorPicker
          label="Background"
          value={config.backgroundColor}
          onChange={(v) => updateConfig('backgroundColor', v)}
        />
        <ColorPicker
          label="Button Color"
          value={config.buttonColor}
          onChange={(v) => updateConfig('buttonColor', v)}
        />
        <ColorPicker
          label="Accent Color"
          value={config.accentColor}
          onChange={(v) => updateConfig('accentColor', v)}
        />
        <ColorPicker
          label="Arrow Color"
          value={config.arrowColor}
          onChange={(v) => updateConfig('arrowColor', v)}
        />
        <ColorPicker
          label="Dot Color"
          value={config.dotColor}
          onChange={(v) => updateConfig('dotColor', v)}
        />
        <ColorPicker
          label="Active Dot"
          value={config.dotActiveColor}
          onChange={(v) => updateConfig('dotActiveColor', v)}
        />
      </div>
    </div>
  );
};
