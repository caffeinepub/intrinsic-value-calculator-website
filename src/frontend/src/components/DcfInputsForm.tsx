import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { DcfInputs } from "../features/dcf/presets";
import {
  type ValidationError,
  getFieldError,
} from "../features/dcf/validation";
import {
  parseNumericInput,
  parsePercentInput,
  toPercentString,
} from "../lib/number";

interface DcfInputsFormProps {
  inputs: DcfInputs;
  onChange: (inputs: DcfInputs) => void;
  errors: ValidationError[];
}

export function DcfInputsForm({
  inputs,
  onChange,
  errors,
}: DcfInputsFormProps) {
  const updateField = (field: keyof DcfInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Snapshot</CardTitle>
          <CardDescription>Enter company and stock information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shareName">Share Name</Label>
            <Input
              id="shareName"
              type="text"
              value={inputs.shareName}
              onChange={(e) => updateField("shareName", e.target.value)}
              placeholder="Example Corp"
            />
            {getFieldError(errors, "shareName") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "shareName")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketCap">Market Cap (₹)</Label>
            <Input
              id="marketCap"
              type="number"
              value={inputs.marketCap || ""}
              onChange={(e) =>
                updateField("marketCap", parseNumericInput(e.target.value))
              }
              placeholder="150000000000"
            />
            {getFieldError(errors, "marketCap") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "marketCap")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ltp">Last Traded Price (₹)</Label>
            <Input
              id="ltp"
              type="number"
              value={inputs.ltp || ""}
              onChange={(e) =>
                updateField("ltp", parseNumericInput(e.target.value))
              }
              placeholder="150"
              step="0.01"
            />
            {getFieldError(errors, "ltp") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "ltp")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueLastYear">Revenue Last Year (₹)</Label>
            <Input
              id="revenueLastYear"
              type="number"
              value={inputs.revenueLastYear || ""}
              onChange={(e) =>
                updateField(
                  "revenueLastYear",
                  parseNumericInput(e.target.value),
                )
              }
              placeholder="50000000000"
            />
            {getFieldError(errors, "revenueLastYear") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "revenueLastYear")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="netProfitLastYear">Net Profit Last Year (₹)</Label>
            <Input
              id="netProfitLastYear"
              type="number"
              value={inputs.netProfitLastYear || ""}
              onChange={(e) =>
                updateField(
                  "netProfitLastYear",
                  parseNumericInput(e.target.value),
                )
              }
              placeholder="8000000000"
            />
            {getFieldError(errors, "netProfitLastYear") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "netProfitLastYear")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueLastQuarter">Revenue Last Quarter (₹)</Label>
            <Input
              id="revenueLastQuarter"
              type="number"
              value={inputs.revenueLastQuarter || ""}
              onChange={(e) =>
                updateField(
                  "revenueLastQuarter",
                  parseNumericInput(e.target.value),
                )
              }
              placeholder="13000000000"
            />
            {getFieldError(errors, "revenueLastQuarter") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "revenueLastQuarter")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="netProfitLastQuarter">
              Net Profit Last Quarter (₹)
            </Label>
            <Input
              id="netProfitLastQuarter"
              type="number"
              value={inputs.netProfitLastQuarter || ""}
              onChange={(e) =>
                updateField(
                  "netProfitLastQuarter",
                  parseNumericInput(e.target.value),
                )
              }
              placeholder="2100000000"
            />
            {getFieldError(errors, "netProfitLastQuarter") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "netProfitLastQuarter")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pbRatio">P/B Ratio</Label>
            <Input
              id="pbRatio"
              type="number"
              value={inputs.pbRatio || ""}
              onChange={(e) =>
                updateField("pbRatio", parseNumericInput(e.target.value))
              }
              placeholder="3.5"
              step="0.1"
            />
            {getFieldError(errors, "pbRatio") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "pbRatio")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicHolding">Public Holding (%)</Label>
            <Input
              id="publicHolding"
              type="number"
              value={toPercentString(inputs.publicHolding)}
              onChange={(e) =>
                updateField("publicHolding", parsePercentInput(e.target.value))
              }
              placeholder="65"
              step="0.1"
            />
            {getFieldError(errors, "publicHolding") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "publicHolding")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="promoterPledgeQuantity">
              Promoter Pledge Quantity (%)
            </Label>
            <Input
              id="promoterPledgeQuantity"
              type="number"
              value={toPercentString(inputs.promoterPledgeQuantity)}
              onChange={(e) =>
                updateField(
                  "promoterPledgeQuantity",
                  parsePercentInput(e.target.value),
                )
              }
              placeholder="12.5"
              step="0.1"
            />
            {getFieldError(errors, "promoterPledgeQuantity") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "promoterPledgeQuantity")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Result Updated Since 6 Months</Label>
            <RadioGroup
              value={inputs.resultUpdatedSince6Years ? "yes" : "no"}
              onValueChange={(value) =>
                updateField("resultUpdatedSince6Years", value === "yes")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="resultUpdated-yes" />
                <Label
                  htmlFor="resultUpdated-yes"
                  className="font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="resultUpdated-no" />
                <Label
                  htmlFor="resultUpdated-no"
                  className="font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
            {getFieldError(errors, "resultUpdatedSince6Years") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "resultUpdatedSince6Years")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>PSU (Public Sector Undertaking)</Label>
            <RadioGroup
              value={inputs.psuOrNot ? "yes" : "no"}
              onValueChange={(value) =>
                updateField("psuOrNot", value === "yes")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="psu-yes" />
                <Label htmlFor="psu-yes" className="font-normal cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="psu-no" />
                <Label htmlFor="psu-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
            {getFieldError(errors, "psuOrNot") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "psuOrNot")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="netNpaNbfc">Net NPA (NBFC) (%)</Label>
            <Input
              id="netNpaNbfc"
              type="number"
              value={toPercentString(inputs.netNpaNbfc)}
              onChange={(e) =>
                updateField("netNpaNbfc", parsePercentInput(e.target.value))
              }
              placeholder="3.2"
              step="0.1"
            />
            {getFieldError(errors, "netNpaNbfc") && (
              <p className="text-sm text-destructive">
                {getFieldError(errors, "netNpaNbfc")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
