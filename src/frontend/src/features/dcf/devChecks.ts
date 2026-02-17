import { DcfInputs, VERIFICATION_INPUTS } from './presets';
import { calculateIntrinsicPrice, calculateActualValue } from './calculations';

export interface DevCheckResult {
  passed: boolean;
  message: string;
  details: {
    intrinsicPrice: { calculated: number; expected: number; passed: boolean };
    actualValue: { calculated: number; expected: number; passed: boolean };
  };
}

/**
 * Expected values for verification (rounded to 2 decimals)
 */
const EXPECTED_VALUES = {
  intrinsicPrice: 107.12,
  actualValue: 105.65,
};

/**
 * Tolerance for floating point comparison (0.01 for 2 decimal places)
 */
const TOLERANCE = 0.01;

/**
 * Compare two numbers with tolerance
 */
function numbersMatch(calculated: number, expected: number, tolerance: number = TOLERANCE): boolean {
  return Math.abs(calculated - expected) <= tolerance;
}

/**
 * Round to 2 decimal places
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Run dev verification check using frontend formulas
 * Returns detailed pass/fail results for all calculated values
 */
export function runDevCheck(inputs: DcfInputs = VERIFICATION_INPUTS): DevCheckResult {
  // Calculate intrinsic and actual values
  const intrinsicPrice = calculateIntrinsicPrice(inputs);
  const actualValue = calculateActualValue(inputs);

  // Round values
  const calcIntrinsic = round2(intrinsicPrice);
  const calcActual = round2(actualValue);

  // Check each value
  const intrinsicPass = numbersMatch(calcIntrinsic, EXPECTED_VALUES.intrinsicPrice);
  const actualPass = numbersMatch(calcActual, EXPECTED_VALUES.actualValue);

  const allPassed = intrinsicPass && actualPass;

  // Build detailed result
  const details = {
    intrinsicPrice: { calculated: calcIntrinsic, expected: EXPECTED_VALUES.intrinsicPrice, passed: intrinsicPass },
    actualValue: { calculated: calcActual, expected: EXPECTED_VALUES.actualValue, passed: actualPass },
  };

  // Log to console for debugging
  console.group('🔍 Dev Check Results');
  console.log('Output Values:');
  console.log(`  Intrinsic Price: ${calcIntrinsic} (expected: ${EXPECTED_VALUES.intrinsicPrice}) ${intrinsicPass ? '✅' : '❌'}`);
  console.log(`  Actual Value: ${calcActual} (expected: ${EXPECTED_VALUES.actualValue}) ${actualPass ? '✅' : '❌'}`);
  console.log(`\nOverall: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.groupEnd();

  // Build message
  let message = allPassed
    ? 'All calculations match expected values!'
    : 'Some calculations do not match expected values. Check console for details.';

  if (!allPassed) {
    const failures: string[] = [];
    if (!intrinsicPass) failures.push(`Intrinsic Price: ${calcIntrinsic} ≠ ${EXPECTED_VALUES.intrinsicPrice}`);
    if (!actualPass) failures.push(`Actual Value: ${calcActual} ≠ ${EXPECTED_VALUES.actualValue}`);
    message += '\n' + failures.join(', ');
  }

  return {
    passed: allPassed,
    message,
    details,
  };
}
