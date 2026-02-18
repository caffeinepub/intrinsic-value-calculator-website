import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DcfInputs } from '@/features/dcf/presets';
import { calculateIntrinsicPrice, calculateActualValue } from '@/features/dcf/calculations';
import { useCountUp } from '@/hooks/useCountUp';
import { TrendingUp, Sparkles } from 'lucide-react';
import { BuyTargetPriceCards } from './BuyTargetPriceCards';

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

  // Determine Buy (lower) and Target (higher) prices
  const buyPrice = hasCalculated && intrinsicValue !== null && actualValue !== null
    ? Math.min(animatedIntrinsic, animatedActual)
    : 0;
  
  const targetPrice = hasCalculated && intrinsicValue !== null && actualValue !== null
    ? Math.max(animatedIntrinsic, animatedActual)
    : 0;

  // Warning logic
  const showWarning = hasCalculated && (intrinsicValue === 0 || actualValue === 0);
  const warningMessage = showWarning
    ? intrinsicValue === 0 && actualValue === 0
      ? 'Both Buy price and Target price are zero. Please verify your input values.'
      : intrinsicValue === 0
      ? 'Buy price is zero (Intrinsic Price calculation). Please verify your input values.'
      : 'Target price is zero (Actual Value calculation). Please verify your input values.'
    : undefined;

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
          <span className="text-lg font-semibold">Calculate Buy & Target price</span>
          <span className="text-xs opacity-70">Calculate both metrics</span>
          {calculating && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          )}
        </Button>
        
        {hasCalculated && (
          <BuyTargetPriceCards
            buyPrice={buyPrice}
            targetPrice={targetPrice}
            showWarning={showWarning}
            warningMessage={warningMessage}
          />
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
