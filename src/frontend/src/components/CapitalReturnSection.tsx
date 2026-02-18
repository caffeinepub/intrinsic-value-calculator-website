import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { Coins } from 'lucide-react';

interface CapitalReturnSectionProps {
  initialCapitalReturnYearly: number;
  initialCapitalReturnQuarterly: number;
  initialAverageCapitalReturn: number;
  initialCapitalReturnPlusAsset: number;
}

export function CapitalReturnSection({
  initialCapitalReturnYearly,
  initialCapitalReturnQuarterly,
  initialAverageCapitalReturn,
  initialCapitalReturnPlusAsset,
}: CapitalReturnSectionProps) {
  return (
    <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-background">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Coins className="h-5 w-5 text-accent" />
          </div>
          <CardTitle className="text-xl">Capital Return (CR)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Initial Capital Return Yearly */}
          <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
            <span className="text-sm font-medium text-muted-foreground">
              Initial Capital Return Yearly
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(initialCapitalReturnYearly)}
            </span>
          </div>

          {/* Initial Capital Return Quarterly */}
          <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
            <span className="text-sm font-medium text-muted-foreground">
              Initial Capital Return Quarterly
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(initialCapitalReturnQuarterly)}
            </span>
          </div>

          {/* Initial Average Capital Return */}
          <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
            <span className="text-sm font-medium text-muted-foreground">
              Initial Average Capital Return
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(initialAverageCapitalReturn)}
            </span>
          </div>

          {/* Initial Capital Return + Asset */}
          <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg border-2 border-accent/30">
            <span className="text-sm font-semibold text-foreground">
              Initial Capital Return + Asset
            </span>
            <span className="text-xl font-bold text-accent">
              {formatCurrency(initialCapitalReturnPlusAsset)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
