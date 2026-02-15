import { useState } from 'react';
import { DcfInputs, DEFAULT_INPUTS } from '../features/dcf/presets';

/**
 * Hook to sync calculator inputs with URL query string
 * Query parameter naming convention:
 * - Company Snapshot: name, mcap, ltp, revY, profY, revQ, profQ, pb, indGrowth, pubHold, pledge, res6y, psu, npa
 */
export function useQueryInputs() {
  const [inputs, setInputs] = useState<DcfInputs>(() => {
    // Try to load from URL on mount
    const params = new URLSearchParams(window.location.search);
    if (params.has('name') || params.has('mcap')) {
      return parseInputsFromQuery(params);
    }
    return DEFAULT_INPUTS;
  });

  const updateInputs = (newInputs: DcfInputs) => {
    setInputs(newInputs);
  };

  const copyShareableLink = () => {
    const params = encodeInputsToQuery(inputs);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    return url;
  };

  return {
    inputs,
    updateInputs,
    copyShareableLink,
  };
}

function parseInputsFromQuery(params: URLSearchParams): DcfInputs {
  // Helper to parse percentage values with backward compatibility
  const parsePercentValue = (paramValue: string | null, defaultValue: number): number => {
    if (!paramValue) return defaultValue;
    const parsed = parseFloat(paramValue);
    if (isNaN(parsed)) return defaultValue;
    // If value is greater than 1, assume it's in old format (absolute number) and convert to decimal
    // Otherwise, treat as decimal percentage
    return parsed > 1 ? parsed / 100 : parsed;
  };

  return {
    // Company Snapshot fields
    shareName: params.get('name') || DEFAULT_INPUTS.shareName,
    marketCap: parseFloat(params.get('mcap') || String(DEFAULT_INPUTS.marketCap)),
    ltp: parseFloat(params.get('ltp') || String(DEFAULT_INPUTS.ltp)),
    revenueLastYear: parseFloat(params.get('revY') || String(DEFAULT_INPUTS.revenueLastYear)),
    netProfitLastYear: parseFloat(params.get('profY') || String(DEFAULT_INPUTS.netProfitLastYear)),
    revenueLastQuarter: parseFloat(params.get('revQ') || String(DEFAULT_INPUTS.revenueLastQuarter)),
    netProfitLastQuarter: parseFloat(params.get('profQ') || String(DEFAULT_INPUTS.netProfitLastQuarter)),
    pbRatio: parseFloat(params.get('pb') || String(DEFAULT_INPUTS.pbRatio)),
    industryGrowth: parseFloat(params.get('indGrowth') || String(DEFAULT_INPUTS.industryGrowth)),
    publicHolding: parseFloat(params.get('pubHold') || String(DEFAULT_INPUTS.publicHolding)),
    promoterPledgeQuantity: parsePercentValue(params.get('pledge'), DEFAULT_INPUTS.promoterPledgeQuantity),
    resultUpdatedSince6Years: params.get('res6y') === 'true' || DEFAULT_INPUTS.resultUpdatedSince6Years,
    psuOrNot: params.get('psu') === 'true' || DEFAULT_INPUTS.psuOrNot,
    netNpaNbfc: parsePercentValue(params.get('npa'), DEFAULT_INPUTS.netNpaNbfc),
  };
}

function encodeInputsToQuery(inputs: DcfInputs): URLSearchParams {
  const params = new URLSearchParams();
  
  // Company Snapshot fields (only include non-default values to keep URLs shorter)
  if (inputs.shareName !== DEFAULT_INPUTS.shareName) {
    params.set('name', inputs.shareName);
  }
  if (inputs.marketCap !== DEFAULT_INPUTS.marketCap) {
    params.set('mcap', inputs.marketCap.toString());
  }
  if (inputs.ltp !== DEFAULT_INPUTS.ltp) {
    params.set('ltp', inputs.ltp.toString());
  }
  if (inputs.revenueLastYear !== DEFAULT_INPUTS.revenueLastYear) {
    params.set('revY', inputs.revenueLastYear.toString());
  }
  if (inputs.netProfitLastYear !== DEFAULT_INPUTS.netProfitLastYear) {
    params.set('profY', inputs.netProfitLastYear.toString());
  }
  if (inputs.revenueLastQuarter !== DEFAULT_INPUTS.revenueLastQuarter) {
    params.set('revQ', inputs.revenueLastQuarter.toString());
  }
  if (inputs.netProfitLastQuarter !== DEFAULT_INPUTS.netProfitLastQuarter) {
    params.set('profQ', inputs.netProfitLastQuarter.toString());
  }
  if (inputs.pbRatio !== DEFAULT_INPUTS.pbRatio) {
    params.set('pb', inputs.pbRatio.toString());
  }
  if (inputs.industryGrowth !== DEFAULT_INPUTS.industryGrowth) {
    params.set('indGrowth', inputs.industryGrowth.toString());
  }
  if (inputs.publicHolding !== DEFAULT_INPUTS.publicHolding) {
    params.set('pubHold', inputs.publicHolding.toString());
  }
  if (inputs.promoterPledgeQuantity !== DEFAULT_INPUTS.promoterPledgeQuantity) {
    params.set('pledge', inputs.promoterPledgeQuantity.toString());
  }
  if (inputs.resultUpdatedSince6Years !== DEFAULT_INPUTS.resultUpdatedSince6Years) {
    params.set('res6y', inputs.resultUpdatedSince6Years.toString());
  }
  if (inputs.psuOrNot !== DEFAULT_INPUTS.psuOrNot) {
    params.set('psu', inputs.psuOrNot.toString());
  }
  if (inputs.netNpaNbfc !== DEFAULT_INPUTS.netNpaNbfc) {
    params.set('npa', inputs.netNpaNbfc.toString());
  }
  
  return params;
}
