import type { DcfInputs as BackendDcfInputs } from "@/backend";
import { useQuery } from "@tanstack/react-query";
import type { DcfInputs } from "../features/dcf/presets";
import { useActor } from "./useActor";

/**
 * Map frontend DcfInputs to backend DcfInputs format
 */
function mapToBackendInputs(inputs: DcfInputs): BackendDcfInputs {
  const {
    marketCap,
    ltp,
    netProfitLastYear,
    revenueLastYear,
    revenueLastQuarter,
  } = inputs;

  // Calculate total shares = Market cap / ltp
  const sharesOutstanding = ltp > 0 ? marketCap / ltp : 0;

  // Use net profit as forecasted FCF
  const forecastedFCF = netProfitLastYear;

  // Default values for DCF parameters
  const perpetualGrowthRate = 0.03; // 3%
  const weightedAveCostOfCapital = 0.1; // 10%
  const terminalYears = BigInt(5);

  return {
    sharesOutstanding,
    forecastedFCF,
    perpetualGrowthRate,
    weightedAveCostOfCapital,
    terminalYears,
    actualSharePrice: ltp,
    revenueLastQuarter,
    revenueLastYear,
  };
}

/**
 * Hook to calculate values from the backend using the processDcf method
 */
export function useBackendCalculation(inputs: DcfInputs) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery({
    queryKey: ["backendCalculation", inputs],
    queryFn: async () => {
      if (!actor) {
        throw new Error("Actor not initialized");
      }

      const backendInputs = mapToBackendInputs(inputs);
      const result = await actor.processDcf(backendInputs);

      return result;
    },
    enabled: !!actor && !isActorFetching,
    staleTime: 30000, // 30 seconds
  });
}
