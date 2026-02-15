import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DcfInputs } from '@/features/dcf/presets';
import { calculateHiddenValues } from '@/features/dcf/calculations';
import { formatCurrency } from '@/lib/format';
import { useCountUp } from '@/hooks/useCountUp';
import { TrendingUp, DollarSign, Sparkles } from 'lucide-react';

interface ResultsSectionProps {
  inputs: DcfInputs;
}

type OutputType = 'intrinsic' | 'actual' | null;

export function ResultsSection({ inputs }: ResultsSectionProps) {
  const [activeOutput, setActiveOutput] = useState<OutputType>(null);
  const [outputValue, setOutputValue] = useState(0);

  const animatedValue = useCountUp({
    start: 0,
    end: outputValue,
    duration: 1500,
    decimals: 2,
  });

  const handleCalculate = (type: OutputType) => {
    if (!type) return;

    const calculations = calculateHiddenValues(inputs);
    
    let value = 0;
    if (type === 'intrinsic') {
      // Intrinsic Price = Total Market Cap / Total Shares
      value = calculations.totalShares > 0 
        ? calculations.totalMarketCap / calculations.totalShares 
        : 0;
    } else if (type === 'actual') {
      // Actual = (Initial capital + asset) / Total Shares
      value = calculations.totalShares > 0
        ? calculations.initialCapitalReturnPlusAsset / calculations.totalShares
        : 0;
    }

    setOutputValue(value);
    setActiveOutput(type);
  };

  const isIntrinsicActive = activeOutput === 'intrinsic';
  const isActualActive = activeOutput === 'actual';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Output Values</h2>
        <p className="text-muted-foreground">
          Calculate per-share metrics based on your company snapshot
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Button
          size="lg"
          variant={isIntrinsicActive ? 'default' : 'outline'}
          onClick={() => handleCalculate('intrinsic')}
          className="h-auto py-6 flex flex-col items-center gap-2 relative overflow-hidden group"
        >
          <TrendingUp className="h-6 w-6" />
          <span className="text-lg font-semibold">Intrinsic Price</span>
          <span className="text-xs opacity-70">Market Cap ÷ Total Shares</span>
          {isIntrinsicActive && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          )}
        </Button>

        <Button
          size="lg"
          variant={isActualActive ? 'default' : 'outline'}
          onClick={() => handleCalculate('actual')}
          className="h-auto py-6 flex flex-col items-center gap-2 relative overflow-hidden group"
        >
          <DollarSign className="h-6 w-6" />
          <span className="text-lg font-semibold">Actual Value</span>
          <span className="text-xs opacity-70">Capital + Assets ÷ Shares</span>
          {isActualActive && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          )}
        </Button>
      </div>

      {/* Result Display */}
      {activeOutput && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle>
                {activeOutput === 'intrinsic' ? 'Intrinsic Price Per Share' : 'Actual Value Per Share'}
              </CardTitle>
            </div>
            <CardDescription>
              {activeOutput === 'intrinsic' 
                ? 'Calculated as Total Market Cap divided by Total Shares'
                : 'Calculated as (Initial Capital + Assets) divided by Total Shares'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="text-5xl font-bold text-primary animate-in zoom-in duration-700">
                {formatCurrency(animatedValue)}
              </div>
              <div className="absolute -inset-4 bg-primary/5 rounded-lg blur-xl -z-10 animate-pulse" />
            </div>
            
            {outputValue === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                ⚠️ Result is zero. Please check your input values.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!activeOutput && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Click a button above to calculate and reveal the output value
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
