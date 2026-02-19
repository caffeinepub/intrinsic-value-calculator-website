import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DcfInputs } from '@/features/dcf/presets';
import { Building2, TrendingUp, DollarSign, BarChart3, PiggyBank } from 'lucide-react';

interface CompanyInfoDisplayProps {
  inputs: DcfInputs;
}

export function CompanyInfoDisplay({ inputs }: CompanyInfoDisplayProps) {
  const hasData = inputs.shareName || inputs.marketCap || inputs.ltp || inputs.revenueLastYear || inputs.netProfitLastYear;

  if (!hasData) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inputs.shareName && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Share Name</span>
              </div>
            </div>
          )}

          {inputs.marketCap !== null && inputs.marketCap !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span>Market Cap</span>
              </div>
            </div>
          )}

          {inputs.ltp !== null && inputs.ltp !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Last Traded Price</span>
              </div>
            </div>
          )}

          {inputs.revenueLastYear !== null && inputs.revenueLastYear !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Revenue Last Year</span>
              </div>
            </div>
          )}

          {inputs.netProfitLastYear !== null && inputs.netProfitLastYear !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <PiggyBank className="h-4 w-4" />
                <span>Net Profit Last Year</span>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
          Value in Cr.
        </p>
      </CardContent>
    </Card>
  );
}
