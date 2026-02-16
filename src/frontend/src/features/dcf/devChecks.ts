import { DcfInputs, VERIFICATION_INPUTS } from './presets';
import { calculateHiddenValues, calculateIntrinsicPrice, calculateActualValue } from './calculations';

export interface DevCheckResult {
  passed: boolean;
  message: string;
  details: {
    AA: { calculated: number; expected: number; passed: boolean };
    BB: { calculated: number; expected: number; passed: boolean };
    CC: { calculated: number; expected: number; passed: boolean };
    DD: { calculated: number; expected: number; passed: boolean };
    intrinsicPrice: { calculated: number; expected: number; passed: boolean };
    actualValue: { calculated: number; expected: number; passed: boolean };
  };
}

/**
 * Expected values for verification (rounded to 2 decimals)
 */
const EXPECTED_VALUES = {
  AA: 4000000000, // (11B * 4) - 40B = 44B - 40B = 4B
  BB: 10, // 4B * 100 / 40B = 10
  CC: 5, // 10 / 2 = 5
  DD: 5, // CC > 0, so DD = 5
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
  // Calculate all hidden values using frontend formulas
  const calculations = calculateHiddenValues(inputs);
  
  // Calculate intrinsic and actual values
  const intrinsicPrice = calculateIntrinsicPrice(inputs);
  const actualValue = calculateActualValue(inputs);

  // Extract and round values
  const calcAA = round2(calculations.AA);
  const calcBB = round2(calculations.BB);
  const calcCC = round2(calculations.CC);
  const calcDD = round2(calculations.DD);
  const calcIntrinsic = round2(intrinsicPrice);
  const calcActual = round2(actualValue);

  // Check each value
  const aaPass = numbersMatch(calcAA, EXPECTED_VALUES.AA);
  const bbPass = numbersMatch(calcBB, EXPECTED_VALUES.BB);
  const ccPass = numbersMatch(calcCC, EXPECTED_VALUES.CC);
  const ddPass = numbersMatch(calcDD, EXPECTED_VALUES.DD);
  const intrinsicPass = numbersMatch(calcIntrinsic, EXPECTED_VALUES.intrinsicPrice);
  const actualPass = numbersMatch(calcActual, EXPECTED_VALUES.actualValue);

  const allPassed = aaPass && bbPass && ccPass && ddPass && intrinsicPass && actualPass;

  // Build detailed result
  const details = {
    AA: { calculated: calcAA, expected: EXPECTED_VALUES.AA, passed: aaPass },
    BB: { calculated: calcBB, expected: EXPECTED_VALUES.BB, passed: bbPass },
    CC: { calculated: calcCC, expected: EXPECTED_VALUES.CC, passed: ccPass },
    DD: { calculated: calcDD, expected: EXPECTED_VALUES.DD, passed: ddPass },
    intrinsicPrice: { calculated: calcIntrinsic, expected: EXPECTED_VALUES.intrinsicPrice, passed: intrinsicPass },
    actualValue: { calculated: calcActual, expected: EXPECTED_VALUES.actualValue, passed: actualPass },
  };

  // Log to console for debugging
  console.group('🔍 Dev Check Results');
  console.log('Industry Growth Calculations:');
  console.log(`  AA (Revenue Growth): ${calcAA} (expected: ${EXPECTED_VALUES.AA}) ${aaPass ? '✅' : '❌'}`);
  console.log(`  BB (YoY Growth %): ${calcBB} (expected: ${EXPECTED_VALUES.BB}) ${bbPass ? '✅' : '❌'}`);
  console.log(`  CC (Adjusted Growth): ${calcCC} (expected: ${EXPECTED_VALUES.CC}) ${ccPass ? '✅' : '❌'}`);
  console.log(`  DD (Industry Growth): ${calcDD} (expected: ${EXPECTED_VALUES.DD}) ${ddPass ? '✅' : '❌'}`);
  console.log('Output Values:');
  console.log(`  Intrinsic Price: ${calcIntrinsic} (expected: ${EXPECTED_VALUES.intrinsicPrice}) ${intrinsicPass ? '✅' : '❌'}`);
  console.log(`  Actual Value: ${calcActual} (expected: ${EXPECTED_VALUES.actualValue}) ${actualPass ? '✅' : '❌'}`);
  console.log(`Overall: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.groupEnd();

  // Build message
  let message = '';
  if (allPassed) {
    message = 'All calculations match expected values!';
  } else {
    const failures: string[] = [];
    if (!aaPass) failures.push(`AA: ${calcAA} ≠ ${EXPECTED_VALUES.AA}`);
    if (!bbPass) failures.push(`BB: ${calcBB} ≠ ${EXPECTED_VALUES.BB}`);
    if (!ccPass) failures.push(`CC: ${calcCC} ≠ ${EXPECTED_VALUES.CC}`);
    if (!ddPass) failures.push(`DD: ${calcDD} ≠ ${EXPECTED_VALUES.DD}`);
    if (!intrinsicPass) failures.push(`Intrinsic: ${calcIntrinsic} ≠ ${EXPECTED_VALUES.intrinsicPrice}`);
    if (!actualPass) failures.push(`Actual: ${calcActual} ≠ ${EXPECTED_VALUES.actualValue}`);
    message = `Mismatches: ${failures.join(', ')}`;
  }

  return {
    passed: allPassed,
    message,
    details,
  };
}
