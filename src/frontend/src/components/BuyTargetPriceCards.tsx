import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";

interface BuyTargetPriceCardsProps {
  buyPrice: number;
  targetPrice: number;
  showWarning?: boolean;
  warningMessage?: string;
}

export function BuyTargetPriceCards({
  buyPrice,
  targetPrice,
  showWarning,
  warningMessage,
}: BuyTargetPriceCardsProps) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Buy Price Card */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="py-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                Buy price
              </span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(buyPrice)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Lower valuation threshold
            </p>
          </CardContent>
        </Card>

        {/* Target Price Card */}
        <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="py-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                Target price
              </span>
            </div>
            <div className="text-3xl font-bold text-accent">
              {formatCurrency(targetPrice)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Higher valuation threshold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Warning Message */}
      {showWarning && warningMessage && (
        <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 rounded border border-amber-200 dark:border-amber-900/30">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{warningMessage}</span>
        </div>
      )}
    </div>
  );
}
