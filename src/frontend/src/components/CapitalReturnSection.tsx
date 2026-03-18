import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface CapitalReturnSectionProps {
  initialCapitalReturnYearly: number;
  initialCapitalReturnQuarterly: number;
  initialAverageCapitalReturn: number;
  initialCapitalReturnPlusAsset: number;
}

export function CapitalReturnSection({
  initialCapitalReturnYearly: _initialCapitalReturnYearly,
  initialCapitalReturnQuarterly: _initialCapitalReturnQuarterly,
  initialAverageCapitalReturn: _initialAverageCapitalReturn,
  initialCapitalReturnPlusAsset: _initialCapitalReturnPlusAsset,
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
          </div>

          {/* Initial Capital Return Quarterly */}
          <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
            <span className="text-sm font-medium text-muted-foreground">
              Initial Capital Return Quarterly
            </span>
          </div>

          {/* Initial Average Capital Return */}
          <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
            <span className="text-sm font-medium text-muted-foreground">
              Initial Average Capital Return
            </span>
          </div>

          {/* Initial Capital Return + Asset */}
          <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg border-2 border-accent/30">
            <span className="text-sm font-semibold text-foreground">
              Initial Capital Return + Asset
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
