import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DcfInputs } from '@/features/dcf/presets';
import { calculateIntrinsicPrice, calculateActualValue } from '@/features/dcf/calculations';
import { formatCurrency } from '@/lib/format';
import { useCountUp } from '@/hooks/useCountUp';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface ResultsSectionProps {
  inputs: DcfInputs;
}

export function ResultsSection({ inputs }: ResultsSectionProps) {
  const [intrinsicValue, setIntrinsicValue] = useState<number | null>(null);
  const [actualValue, setActualValue] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);

  const animatedIntrinsic = useCountUp({
    start: 0,
    end: intrinsicValue ?? 0,
    duration: 1500,
    decimals: 2,
  });

  const animatedActual = useCountUp({
    start: 0,
    end: actualValue ?? 0,
    duration: 1500,
    decimals: 2,
  });

  const handleCalculateBoth = () => {
    setCalculating(true);
    const intrinsic = calculateIntrinsicPrice(inputs);
    const actual = calculateActualValue(inputs);
    setIntrinsicValue(intrinsic);
    setActualValue(actual);
    setTimeout(() => setCalculating(false), 1500);
  };

  const hasCalculated = intrinsicValue !== null && actualValue !== null;

  // Determine display order: lower value first, higher value second
  const displayLowerValue = hasCalculated && intrinsicValue !== null && actualValue !== null
    ? (intrinsicValue <= actualValue ? animatedIntrinsic : animatedActual)
    : 0;
  
  const displayHigherValue = hasCalculated && intrinsicValue !== null && actualValue !== null
    ? (intrinsicValue <= actualValue ? animatedActual : animatedIntrinsic)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Output Values</h2>
        <p className="text-muted-foreground">
          Calculate per-share metrics based on your company snapshot
        </p>
      </div>

      {/* Combined Action Button */}
      <div className="space-y-4">
        <Button
          size="lg"
          variant={hasCalculated ? 'default' : 'outline'}
          onClick={handleCalculateBoth}
          className="w-full h-auto py-6 flex flex-col items-center gap-2 relative overflow-hidden group"
        >
          <TrendingUp className="h-6 w-6" />
          <span className="text-lg font-semibold">BUY PRICE ~ TARGET PRICE</span>
          <span className="text-xs opacity-70">Calculate both metrics</span>
          {calculating && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          )}
        </Button>
        
        {hasCalculated && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(displayLowerValue)} ~ {formatCurrency(displayHigherValue)}
                </div>
              </div>
              {(intrinsicValue === 0 || actualValue === 0) && (
                <div className="mt-4 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 rounded">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {intrinsicValue === 0 && actualValue === 0
                      ? 'Both results are zero. Please verify your input values.'
                      : intrinsicValue === 0
                      ? 'Intrinsic Price is zero. Please verify your input values.'
                      : 'Actual Value is zero. Please verify your input values.'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Placeholder when no calculations yet */}
      {!hasCalculated && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Click the button above to calculate and reveal both output values
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
