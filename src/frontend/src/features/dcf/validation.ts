import { DcfInputs } from './presets';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateInputs(inputs: DcfInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  // Company Snapshot validations
  if (inputs.shareName.trim() !== '' && inputs.shareName.trim().length === 0) {
    errors.push({ field: 'shareName', message: 'Share name cannot be only whitespace' });
  }

  if (inputs.marketCap < 0) {
    errors.push({ field: 'marketCap', message: 'Market cap cannot be negative' });
  }

  if (inputs.ltp < 0) {
    errors.push({ field: 'ltp', message: 'Last traded price cannot be negative' });
  }

  if (inputs.revenueLastYear < 0) {
    errors.push({ field: 'revenueLastYear', message: 'Revenue last year cannot be negative' });
  }

  if (inputs.netProfitLastYear < 0) {
    errors.push({ field: 'netProfitLastYear', message: 'Net profit last year cannot be negative' });
  }

  if (inputs.revenueLastQuarter < 0) {
    errors.push({ field: 'revenueLastQuarter', message: 'Revenue last quarter cannot be negative' });
  }

  if (inputs.netProfitLastQuarter < 0) {
    errors.push({ field: 'netProfitLastQuarter', message: 'Net profit last quarter cannot be negative' });
  }

  if (inputs.pbRatio < 0) {
    errors.push({ field: 'pbRatio', message: 'P/B ratio cannot be negative' });
  }

  if (inputs.publicHolding < 0 || inputs.publicHolding > 1) {
    errors.push({ field: 'publicHolding', message: 'Public holding must be between 0% and 100%' });
  }

  if (inputs.promoterPledgeQuantity < 0 || inputs.promoterPledgeQuantity > 1) {
    errors.push({ field: 'promoterPledgeQuantity', message: 'Promoter pledge quantity must be between 0% and 100%' });
  }

  if (inputs.netNpaNbfc < 0 || inputs.netNpaNbfc > 1) {
    errors.push({ field: 'netNpaNbfc', message: 'Net NPA (NBFC) must be between 0% and 100%' });
  }

  if (inputs.industryGrowthPercent < 0 || inputs.industryGrowthPercent > 100) {
    errors.push({ field: 'industryGrowthPercent', message: 'Industry growth percentage must be between 0% and 100%' });
  }

  return errors;
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}
