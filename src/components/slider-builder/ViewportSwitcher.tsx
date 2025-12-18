import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { ViewportMode } from '@/types/slider';

interface ViewportSwitcherProps {
  mode: ViewportMode;
  onChange: (mode: ViewportMode) => void;
}

export const ViewportSwitcher = ({ mode, onChange }: ViewportSwitcherProps) => {
  const viewports: { id: ViewportMode; icon: React.ReactNode; label: string }[] = [
    { id: 'mobile', icon: <Smartphone size={16} />, label: 'Mobile' },
    { id: 'tablet', icon: <Tablet size={16} />, label: 'Tablet' },
    { id: 'desktop', icon: <Monitor size={16} />, label: 'Desktop' },
  ];

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      {viewports.map((viewport) => (
        <button
          key={viewport.id}
          onClick={() => onChange(viewport.id)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
            ${mode === viewport.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          title={viewport.label}
        >
          {viewport.icon}
          <span className="hidden sm:inline">{viewport.label}</span>
        </button>
      ))}
    </div>
  );
};
