import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getFormulasArray } from "@/features/dcf/formulas";
import type { DcfInputs } from "@/features/dcf/presets";
import { formatCurrency, formatNumber } from "@/lib/format";

interface FormulasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputs: DcfInputs;
}

export function FormulasDialog({
  open,
  onOpenChange,
  inputs,
}: FormulasDialogProps) {
  const formulas = getFormulasArray(inputs);

  // Group formulas by category
  const primaryFormulas = formulas.slice(0, 4); // Total Shares, Book Value, Initial Growth, Industry Growth
  const intermediateFormulas = formulas.slice(4, 18); // B through Q
  const capitalReturnFormulas = formulas.slice(18, 22); // Capital return calculations
  const outputFormulas = formulas.slice(22); // Total Market Cap, Intrinsic Price, Actual Value

  const renderFormulaCard = (formula: {
    name: string;
    expression: string;
    value: number;
    description?: string;
  }) => (
    <Card key={formula.name} className="bg-muted/30">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{formula.name}</h4>
              {formula.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formula.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-mono font-medium">
                {formula.name.includes("Price") ||
                formula.name.includes("Value") ||
                formula.name.includes("Cap")
                  ? formatCurrency(formula.value)
                  : formatNumber(formula.value)}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-mono text-muted-foreground">
              {formula.expression}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>All Formulas</DialogTitle>
          <DialogDescription>
            Complete list of formulas used in the Company Snapshot Tool with
            current calculated values
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Primary Formulas */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Primary Calculations
              </h3>
              <div className="grid gap-3">
                {primaryFormulas.map(renderFormulaCard)}
              </div>
            </div>

            <Separator />

            {/* Intermediate Formulas */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Intermediate Formulas (B–Q)
              </h3>
              <div className="grid gap-3">
                {intermediateFormulas.map(renderFormulaCard)}
              </div>
            </div>

            <Separator />

            {/* Capital Return Formulas */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Capital Return Calculations
              </h3>
              <div className="grid gap-3">
                {capitalReturnFormulas.map(renderFormulaCard)}
              </div>
            </div>

            <Separator />

            {/* Output Formulas */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Final Outputs
              </h3>
              <div className="grid gap-3">
                {outputFormulas.map(renderFormulaCard)}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
