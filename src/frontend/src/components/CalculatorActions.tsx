import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles, Link2, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';

interface CalculatorActionsProps {
  onUseExample: () => void;
  onReset: () => void;
  onCopyLink: () => string;
  onRunDevCheck?: () => void;
}

export function CalculatorActions({
  onUseExample,
  onReset,
  onCopyLink,
  onRunDevCheck,
}: CalculatorActionsProps) {
  const handleCopyLink = () => {
    const url = onCopyLink();
    toast.success('Link copied to clipboard!', {
      description: 'Share this link to preserve your current inputs',
    });
  };

  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onUseExample} variant="outline" size="sm">
        <Sparkles className="h-4 w-4 mr-2" />
        Use Example
      </Button>
      <Button onClick={onReset} variant="outline" size="sm">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
      <Button onClick={handleCopyLink} variant="outline" size="sm">
        <Link2 className="h-4 w-4 mr-2" />
        Copy Shareable Link
      </Button>
      {isDevelopment && onRunDevCheck && (
        <Button onClick={onRunDevCheck} variant="outline" size="sm" className="border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950">
          <FlaskConical className="h-4 w-4 mr-2" />
          Run Dev Check
        </Button>
      )}
    </div>
  );
}
